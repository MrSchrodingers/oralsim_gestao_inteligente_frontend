"use client"

import { useState, useMemo } from "react"
import {
  Users,
  Search,
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  Bell,
  BellOff,
  Eye,
  Edit,
  Trash2,
  Download,
  AlertCircle,
  Target,
  PhoneCall,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/src/common/components/ui/card"
import { Button } from "@/src/common/components/ui/button"
import { Input } from "@/src/common/components/ui/input"
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
import { useFetchPatients } from "@/src/common/hooks/usePatient"
import { useFetchCollectionCases } from "@/src/modules/cordialBilling/hooks/useCollectionCase"
import { useFetchContactSchedules } from "@/src/modules/notification/hooks/useContactSchedule"
import { PatientsLoadingSkeleton } from "./ loading"
import { formatPhone } from "@/src/common/utils/formatters"
import { getFlowBadge, getStatusBadge, type PatientWithFlow } from "@/src/common/components/helpers/GetBadge"


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
  const [searchTerm, setSearchTerm] = useState("")
  const [flowFilter, setFlowFilter] = useState<string>("all")
  const [notificationFilter, setNotificationFilter] = useState<string>("all")

  const { data: patientsData, isLoading: isLoadingPatients, isError: isErrorPatients } = useFetchPatients()
  const {
    data: collectionCasesData,
    isLoading: isLoadingCollection,
    isError: isErrorCollection,
  } = useFetchCollectionCases()
  const {
    data: contactSchedulesData,
    isLoading: isLoadingSchedules,
    isError: isErrorSchedules,
  } = useFetchContactSchedules()

  const isLoading = isLoadingPatients || isLoadingCollection || isLoadingSchedules
  const isError = isErrorPatients || isErrorCollection || isErrorSchedules

  const patientsWithFlow = useMemo((): PatientWithFlow[] => {
    if (!patientsData || !collectionCasesData || !contactSchedulesData) {
      return []
    }

    const collectionMap = new Map(collectionCasesData.results.map((c) => [c.patient_id, c]))
    const scheduleMap = new Map(contactSchedulesData.results.map((s) => [s.patient_id, s]))

    return patientsData.results.map((patient) => {
      const collectionCase = collectionMap.get(patient.id)
      const schedule = scheduleMap.get(patient.id)

      if (collectionCase) {
        return { ...patient, flowType: "collection", flowData: collectionCase }
      }
      if (schedule) {
        return { ...patient, flowType: "receivable", flowData: schedule }
      }
      return { ...patient, flowType: null }
    })
  }, [patientsData, collectionCasesData, contactSchedulesData])

  const filteredPatients = useMemo(() => {
    return patientsWithFlow.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.cpf?.includes(searchTerm) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFlow =
        flowFilter === "all" ||
        (flowFilter === "receivable" && patient.flowType === "receivable") ||
        (flowFilter === "collection" && patient.flowType === "collection") ||
        (flowFilter === "none" && !patient.flowType)

      const matchesNotification =
        notificationFilter === "all" ||
        (notificationFilter === "enabled" && patient.is_notification_enabled) ||
        (notificationFilter === "disabled" && !patient.is_notification_enabled)

      return matchesSearch && matchesFlow && matchesNotification
    })
  }, [searchTerm, flowFilter, notificationFilter, patientsWithFlow])

  const stats = useMemo(() => {
    const total = patientsWithFlow.length
    const withReceivable = patientsWithFlow.filter((p) => p.flowType === "receivable").length
    const withCollection = patientsWithFlow.filter((p) => p.flowType === "collection").length
    const withNotifications = patientsWithFlow.filter((p) => p.is_notification_enabled).length

    return { total, withReceivable, withCollection, withNotifications }
  }, [patientsWithFlow])

  if (isLoading) {
    return <PatientsLoadingSkeleton />
  }

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
          <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
          <p className="text-muted-foreground">Gerencie todos os pacientes e acompanhe seus fluxos de cobrança</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Pacientes</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gestão de Recebíveis</p>
                <p className="text-2xl font-bold text-blue-600">{stats.withReceivable}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cobrança Amigável</p>
                <p className="text-2xl font-bold text-orange-600">{stats.withCollection}</p>
              </div>
              <PhoneCall className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notificações Ativas</p>
                <p className="text-2xl font-bold text-green-600">{stats.withNotifications}</p>
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
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, CPF ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={flowFilter} onValueChange={setFlowFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por fluxo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os fluxos</SelectItem>
                  <SelectItem value="receivable">Gestão de Recebíveis</SelectItem>
                  <SelectItem value="collection">Cobrança Amigável</SelectItem>
                  <SelectItem value="none">Sem fluxo</SelectItem>
                </SelectContent>
              </Select>
              <Select value={notificationFilter} onValueChange={setNotificationFilter}>
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
          <div className="rounded-md border">
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
              <TableBody>
                {filteredPatients.map((patient) => (
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
                    <TableCell>{getFlowBadge(patient)}</TableCell>
                    <TableCell>{getStatusBadge(patient)}</TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(patient.updated_at || patient.created_at || "")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="h-4 w-4 mr-2" />
                            Ligar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Enviar Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum paciente encontrado</h3>
              <p className="text-muted-foreground mb-4">Tente ajustar os filtros ou termos de busca</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
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