"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Users,
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  Bell,
  BellOff,
  Eye,
  Edit,
  Download,
  AlertCircle,
  Target,
  PhoneCall,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/src/common/components/ui/card"
import { Button } from "@/src/common/components/ui/button"
import { Badge } from "@/src/common/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/common/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/common/components/ui/dropdownMenu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/common/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/common/components/ui/avatar"
import { useFetchPatients, usePatientsSummary } from "@/src/common/hooks/usePatient"
import { useFetchCollectionCases } from "@/src/modules/cordialBilling/hooks/useCollectionCase"
import { useFetchContactSchedules } from "@/src/modules/notification/hooks/useContactSchedule"
import { formatPhone } from "@/src/common/utils/formatters"
import { getFlowBadge, getStatusBadge} from "@/src/common/components/helpers/GetBadge"
import type { IContactSchedule } from "@/src/modules/notification/interfaces/IContactSchedule"
import type { ICollectionCase } from "@/src/modules/cordialBilling/interfaces/ICollectionCase"
import type { IPatient } from "@/src/common/interfaces/IPatient"
import { Skeleton } from "@/src/common/components/ui/skeleton"
import type { MouseEvent as ReactMouseEvent } from "react"
import { useRouter } from "next/navigation"

const formatDate = (dateStr: string) => {
  if (!dateStr) return "N/A"
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr))
}

export default function PatientsPage() {
  const router = useRouter()
  const [flowFilter, setFlowFilter] = useState<string>("all")
  const [notificationFilter, setNotificationFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [isTableLoading, setIsTableLoading] = useState(false)

  const handleNavigation =
    (action: "detail" | "edit" | "call" | "email" | "remove", id: string) =>
    (e: ReactMouseEvent<HTMLDivElement>) => {
      e.preventDefault()

      switch (action) {
        case "detail":
          router.push(`/clinica/pacientes/${id}`)
          break
        case "edit":
          router.push(`/clinica/pacientes/${id}/editar`)
          break
        case "call":
          // usa tel: para abrir o dialer
          window.location.href = `tel:${patientsWithFlow.find(p => p.id === id)?.phones?.[0].phone_number}`
          break
        case "email":
          window.location.href = `mailto:${patientsWithFlow.find(p => p.id === id)?.email}`
          break
        default:
          break
      }
    }

  const {
    data: patientsData,
    isLoading: isLoadingPatients,
    isFetching: isFetchingPatients,
    isError: isErrorPatients,
  } = useFetchPatients({
    page,
    page_size: pageSize,
    flow_type: flowFilter !== "all" ? flowFilter : undefined,
    is_notification_enabled: notificationFilter !== "all" ? notificationFilter === "enabled" : undefined,
  })
  const { data: summary } = usePatientsSummary();

  const patientIds = useMemo(() => patientsData?.results.map((p: { id: string }) => p.id) ?? [], [patientsData])

  const {
    data: collectionCasesData,
    isLoading: isLoadingCollection,
    isError: isErrorCollection,
  } = useFetchCollectionCases(
    patientIds.length ? { patient_id__in: patientIds.join(","), page_size: patientIds.length } : undefined,
  )

  const {
    data: contactSchedulesData,
    isLoading: isLoadingSchedules,
    isError: isErrorSchedules,
  } = useFetchContactSchedules(
    patientIds.length ? { patient_id__in: patientIds.join(","), page_size: patientIds.length } : undefined,
  )

  // Diferencia entre loading inicial e refetch
  const isInitialLoading = isLoadingPatients || isLoadingCollection || isLoadingSchedules
  const isRefetching = isFetchingPatients && !isLoadingPatients
  const isError = isErrorPatients || isErrorCollection || isErrorSchedules

  const patientsWithFlow = useMemo(() => {
    if (!patientsData || !collectionCasesData || !contactSchedulesData) {
      return []
    }

    const collectionMap = new Map(collectionCasesData.results.map((c: ICollectionCase) => [c.patient_id, c]))
    const scheduleMap = new Map(contactSchedulesData.results.map((s: IContactSchedule) => [s.patient_id, s]))

    return patientsData.results.map((patient: IPatient) => {
      const collectionCase = collectionMap.get(patient.id)
      const schedule = scheduleMap.get(patient.id)

      if (collectionCase) {
        return { ...patient, flowType: "cordial_billing", flowData: collectionCase }
      }
      if (schedule) {
        return { ...patient, flowType: "notification_billing", flowData: schedule }
      }
      return { ...patient, flowType: patient.flow_type ?? null }
    })
  }, [patientsData, collectionCasesData, contactSchedulesData])

  useEffect(() => {
    setIsTableLoading(isFetchingPatients);
  }, [isFetchingPatients]);


  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold text-destructive">Erro ao carregar dados</h3>
            <p className="text-muted-foreground mt-2">Não foi possível buscar os dados dos pacientes.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
            {isRefetching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
          <p className="text-muted-foreground">Gerencie todos os pacientes e acompanhe seus fluxos de cobrança</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" disabled={isRefetching}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Cards de estatísticas com indicador sutil de loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={isRefetching ? "opacity-75 transition-opacity" : ""}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Pacientes</p>
                <p className="text-2xl font-bold">{summary?.total}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className={isRefetching ? "opacity-75 transition-opacity" : ""}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gestão de Recebíveis</p>
                <p className="text-2xl font-bold text-blue-600">{summary?.with_receivable}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className={isRefetching ? "opacity-75 transition-opacity" : ""}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cobrança Amigável</p>
                <p className="text-2xl font-bold text-orange-600">{summary?.with_collection}</p>
              </div>
              <PhoneCall className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card className={isRefetching ? "opacity-75 transition-opacity" : ""}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notificações Ativas</p>
                <p className="text-2xl font-bold text-green-600">{summary?.with_notifications}</p>
              </div>
              <Bell className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Lista de Pacientes
            </h2>
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <Select value={flowFilter} onValueChange={setFlowFilter} disabled={isRefetching}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por fluxo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os fluxos</SelectItem>
                  <SelectItem value="notification_billing">Gestão de Recebíveis</SelectItem>
                  <SelectItem value="cordial_billing">Cobrança Amigável</SelectItem>
                  <SelectItem value="none">Sem fluxo</SelectItem>
                </SelectContent>
              </Select>
              <Select value={notificationFilter} onValueChange={setNotificationFilter} disabled={isRefetching}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Notificações" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="enabled">Habilitadas</SelectItem>
                  <SelectItem value="disabled">Desabilitadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Tabela com indicador sutil de loading */}
            <div className={`rounded-md border ${isRefetching ? "opacity-75 transition-opacity" : ""}`}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Notificações</TableHead>
                    <TableHead>Fluxo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Última Atualização</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>

                {isRefetching ? (
                    // Skeleton apenas para as linhas
                    <tbody className="animate-pulse">
                      {Array.from({ length: pageSize }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  ) : (
                    <TableBody>
                      {patientsWithFlow.map((patient: IPatient) => (
                        <TableRow key={patient.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                  {patient.name
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")
                                    .slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{patient.name}</p>
                                <p className="text-sm text-muted-foreground">CPF: {patient.cpf || "N/A"}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="truncate max-w-[200px]">{patient.email || "N/A"}</span>
                              </div>
                              {patient.phones?.length > 0 && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span>{formatPhone(patient.phones[0].phone_number)}</span>
                                </div>
                              )}
                              {patient.address && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  <span>
                                    {patient.address.city}, {patient.address.state}
                                  </span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {patient.is_notification_enabled ? (
                                <>
                                  <Bell className="h-4 w-4 text-green-600" />
                                  <Badge
                                    variant="default"
                                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  >
                                    Habilitadas
                                  </Badge>
                                </>
                              ) : (
                                <>
                                  <BellOff className="h-4 w-4 text-red-600" />
                                  <Badge variant="secondary">Desabilitadas</Badge>
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{getFlowBadge(patient?.flow_type)}</TableCell>
                          <TableCell>{getStatusBadge(patient)}</TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(patient.updated_at || patient.created_at || "")}
                            </span>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" disabled={isRefetching}>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem  onClick={handleNavigation("detail", patient.id)} >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver Detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleNavigation("call", patient.id)} disabled>
                                  <Phone className="h-4 w-4 mr-2" />
                                  Ligar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleNavigation("email", patient.id)} disabled>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Enviar Email
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  )}
              </Table>
            </div>
          {/* Controles de paginação com indicadores de loading */}
          {patientsData && patientsData.total_items > 0 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Mostrando {(page - 1) * pageSize + 1} a {Math.min(page * pageSize, patientsData.total_items)} de{" "}
                  {patientsData.total_items} pacientes
                </p>
                {isRefetching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Itens por página:</p>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => {
                      setPageSize(Number(value))
                      setPage(1)
                    }}
                    disabled={isRefetching}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1 || isRefetching}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>

                  <div className="flex items-center gap-1">
                    {(() => {
                      const totalPages = Math.ceil(patientsData.total_items / pageSize)
                      const pages = []
                      const maxVisiblePages = 5

                      let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2))
                      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

                      if (endPage - startPage + 1 < maxVisiblePages) {
                        startPage = Math.max(1, endPage - maxVisiblePages + 1)
                      }

                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <Button
                            key={i}
                            variant={i === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPage(i)}
                            className="w-8 h-8 p-0"
                            disabled={isRefetching}
                          >
                            {i}
                          </Button>,
                        )
                      }

                      return pages
                    })()}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={!patientsData || page >= Math.ceil(patientsData.total_items / pageSize) || isRefetching}
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {patientsWithFlow.length === 0 && !isRefetching && !isTableLoading && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum paciente encontrado</h3>
              <p className="text-muted-foreground mb-4">Tente ajustar os filtros ou termos de busca</p>
              <Button
                variant="outline"
                onClick={() => {
                  setFlowFilter("all")
                  setNotificationFilter("all")
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

