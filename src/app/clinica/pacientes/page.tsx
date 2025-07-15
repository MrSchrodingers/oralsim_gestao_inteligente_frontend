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
  Download,
  AlertCircle,
  Target,
  PhoneCall,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/src/common/components/ui/card"
import { Button } from "@/src/common/components/ui/button"
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
import { Avatar, AvatarFallback } from "@/src/common/components/ui/avatar"
import { useFetchPatients, usePatientsSummary } from "@/src/common/hooks/usePatient"
import { useFetchCollectionCases } from "@/src/modules/cordialBilling/hooks/useCollectionCase"
import { useFetchContactSchedules } from "@/src/modules/notification/hooks/useContactSchedule"
import { formatPhone } from "@/src/common/utils/formatters"
import { getFlowBadge, getStatusBadge, type PatientWithFlow } from "@/src/common/components/helpers/GetBadge"
import type { IContactSchedule } from "@/src/modules/notification/interfaces/IContactSchedule"
import type { ICollectionCase } from "@/src/modules/cordialBilling/interfaces/ICollectionCase"
import type { IPatient } from "@/src/common/interfaces/IPatient"
import { Skeleton } from "@/src/common/components/ui/skeleton"
import type { MouseEvent as ReactMouseEvent } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/src/common/components/ui/use-toast"

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

const DEFAULT_PAGE_SIZE = 5;
const PAGE_SIZES = [5, 10, 25, 50, 100] as const;

export default function PatientsPage() {
  const router = useRouter()
  const [flowFilter, setFlowFilter] = useState<string>("all")
  const [notificationFilter, setNotificationFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [isTableLoading, setIsTableLoading] = useState(false)
  const { toast } = useToast()

  const handleCopyPhone = (phoneNumber: string) => {
    navigator.clipboard.writeText(phoneNumber.replace(/\D/g, ""))
    toast({
      title: "Número copiado para área de trasnferência",
      description: formatPhone(phoneNumber),
    })
  }

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
    refetch
  } = useFetchPatients({
    page,
    page_size: pageSize,
    flow_type: flowFilter !== "all" ? flowFilter : undefined,
    do_notifications: notificationFilter !== "all" ? notificationFilter === "enabled" : undefined,
  })
  const { data: summary } = usePatientsSummary();

  const patientIds = useMemo(() => patientsData?.results.map((p: { id: string }) => p.id) ?? [], [patientsData])

  const {
    data: collectionCasesData,
    isError: isErrorCollection,
  } = useFetchCollectionCases(
    patientIds.length ? { patient_id__in: patientIds.join(","), page_size: patientIds.length } : undefined,
  )

  const {
    data: contactSchedulesData,
    isError: isErrorSchedules,
  } = useFetchContactSchedules(
    patientIds.length ? { patient_id__in: patientIds.join(","), page_size: patientIds.length } : undefined,
  )

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

  const channelsMap = useMemo(() => {
    const map: Record<string, number> = {};
    patientsWithFlow.forEach(p => {
      map[p.id] = (map[p.id] || 0) + 1;
    });
    return map;
  }, [patientsWithFlow]);

  const uniqueCount = useMemo(
    () => new Set(patientsWithFlow.map(p => p.id)).size,
    [patientsWithFlow]
  );

  useEffect(() => {
    if (flowFilter === "notification_billing" && uniqueCount < pageSize) {
      const idx = PAGE_SIZES.indexOf(pageSize as any);
      if (idx !== -1 && idx < PAGE_SIZES.length - 1) {
        setPageSize(PAGE_SIZES[idx + 1]);
      }
    }
  }, [flowFilter, uniqueCount, pageSize]);

  useEffect(() => {
    if (flowFilter !== "notification_billing") {
      setPageSize(DEFAULT_PAGE_SIZE);
      setPage(1);
    }
  }, [flowFilter]);

  const hasDuplicates = Object.values(channelsMap).some(c => c > 1);

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
          <Button variant="outline" onClick={() => refetch()} disabled={isFetchingPatients}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetchingPatients ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button variant="outline" disabled>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Cards de estatísticas com indicador sutil de loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <SelectItem value="all">Todos status</SelectItem>
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
                  {hasDuplicates && <TableHead>N° Canais</TableHead>}
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
                  {patientsWithFlow.map((patient, idx) => {
                    const count = channelsMap[patient.id] || 0;
                    console.log(count)

                    // se for repetido, só renderiza na primeira vez
                    if (count > 1) {
                      const firstIdx = patientsWithFlow.findIndex(p => p.id === patient.id);
                      if (idx !== firstIdx) return null;
                    }

                    return (
                      <TableRow key={patient.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
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
                          <div className="flex justify-center gap-2">
                            {patient?.flow_type == "notification_billing" ? (
                              <>
                                <Bell className="h-4 w-4 text-green-600" />
                              </>
                            ) : (
                              <>
                                <BellOff className="h-4 w-4 text-red-600" />
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-2">
                            {getFlowBadge(patient?.flow_type)}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(patient as PatientWithFlow)}</TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(patient.updated_at || patient.created_at || "")}
                          </span>
                        </TableCell>
                        {hasDuplicates && (
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              {(count ?? 0) > 1 ? count : null}
                            </div>
                          </TableCell>
                        )}
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
                              <DropdownMenuItem onClick={handleNavigation("detail", patient.id)} >
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleCopyPhone(patient.phones[0].phone_number)}
                              >
                                <Phone className="h-4 w-4 mr-2" />
                                Ligar Agora
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
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

