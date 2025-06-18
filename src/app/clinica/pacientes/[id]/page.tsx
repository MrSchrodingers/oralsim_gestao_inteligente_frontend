"use client"

import { useState } from "react"
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Bell,
  BellOff,
  CreditCard,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Target,
  PhoneCall,
  MoreHorizontal,
  Download,
  Send,
  MessageSquare,
  MessageCircle,
  PhoneOutgoing,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  MailOpen,
  Activity,
  Milestone,
  CheckCheck,
  XCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/common/components/ui/card"
import { Button } from "@/src/common/components/ui/button"
import { Badge } from "@/src/common/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/common/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/common/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/common/components/ui/avatar"
import { Separator } from "@/src/common/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/common/components/ui/dropdownMenu"
import { useParams } from "next/navigation"
import { useFetchPatientById } from "@/src/common/hooks/usePatient"
import { useFetchContracts } from "@/src/common/hooks/useContract"
import { useFetchInstallments } from "@/src/common/hooks/useInstallment"
import { useFetchCollectionCases } from "@/src/modules/cordialBilling/hooks/useCollectionCase"
import { useFetchContactSchedules } from "@/src/modules/notification/hooks/useContactSchedule"
import { useFetchFlowStepConfigs } from "@/src/modules/notification/hooks/useFlowStepConfig"
import { formatCurrency, formatDate, formatDateTime, formatPhone } from "@/src/common/utils/formatters"
import { getFlowBadge } from "@/src/common/components/helpers/GetBadge"
import {
  PatientInfoSkeleton,
  ContractInfoSkeleton,
  InstallmentsSkeleton,
  PatientHeaderSkeleton,
  StatusCardsSkeleton,
} from "@/src/common/components/patients/skeletons"

// Mock data para acordos de cobrança amigável
const mockDealActivities = [
  {
    id: 179,
    done: true,
    type: "call",
    subject: "Chamada",
    due_date: "2024-10-17",
    marked_as_done_time: "2024-10-24 13:23:48+00",
    deal_id: 2264,
    person_name: "ALEX APARECIDO SODRE AMBROZIO",
    org_name: "CLINICA ODONTOLOGICA JUIZ DE FORA 2 LTDA",
  },
  {
    id: 13,
    done: true,
    type: "task",
    subject: "PLANILHA",
    due_date: "2024-09-30",
    marked_as_done_time: "2024-11-04 19:20:27+00",
    deal_id: 1477,
    note: "PLANILHA- contato solicitando feito",
    org_name: "ALIANÇA ASSISTENCIA ODONTOLOGICA LTDA",
  },
  {
    id: 240,
    done: true,
    type: "call",
    subject: "Chamada",
    due_date: "2024-10-18",
    marked_as_done_time: "2024-10-24 19:13:51+00",
    deal_id: 2484,
    person_name: "JOVANE DE LIMA SILVA",
    org_name: "ODONTOLOGIA YANASE, CESTARI & COSIN LTDA",
  },
]

const getStatusBadge = (status?: string | null, received?: boolean) => {
  if (received) {
    return (
      <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        Pago
      </Badge>
    )
  }

  switch (status?.toLowerCase()) {
    case "compensado":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Compensado
        </Badge>
      )
    case "não compensado":
      return (
        <Badge variant="destructive">
          <AlertCircle className="h-3 w-3 mr-1" />
          Não Compensado
        </Badge>
      )
    case "pendente":
      return (
        <Badge variant="secondary">
          <Clock className="h-3 w-3 mr-1" />
          Pendente
        </Badge>
      )
    default:
      return <Badge variant="outline">{status || "N/A"}</Badge>
  }
}

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case "whatsapp":
      return <MessageSquare className="h-4 w-4" />
    case "sms":
      return <MessageCircle className="h-4 w-4" />
    case "email":
      return <MailOpen className="h-4 w-4" />
    case "phonecall":
      return <PhoneOutgoing className="h-4 w-4" />
    default:
      return <Activity className="h-4 w-4" />
  }
}

export default function PatientDetailsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const { id } = useParams<{ id: string }>()

  const { data: patient } = useFetchPatientById(id)
  const { data: contractsData } = useFetchContracts({ patient_id: id, page_size: 1 })
  const contract = contractsData?.results?.[0]
  const { data: installmentsData } = useFetchInstallments(contract ? { contract_id: contract?.id } : undefined)
  const installments = installmentsData?.results ?? []
  const { data: collectionCaseData } = useFetchCollectionCases({ patient_id: id, page_size: 1 })
  const collectionCase = collectionCaseData?.results?.[0]
  const { data: scheduleData } = useFetchContactSchedules({ patient_id: id, page_size: 1 })
  const currentStep = scheduleData?.results?.[0]?.current_step ?? 0
  const { data: flowStepsData } = useFetchFlowStepConfigs()
  const flowSteps = flowStepsData?.results ?? []

  const patientInitials = patient?.name
    ? patient?.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
    : ""

  const totalInstallments = installments.length
  const paidInstallments = installments.filter((i) => i.received).length
  const overdueInstallments = installments.filter((i) => !i.received && new Date(i.due_date) < new Date()).length
  const totalAmount = installments.reduce((sum, i) => sum + Number(i.installment_amount), 0)
  // const paidAmount = installments
  //   .filter((i) => i.received)
  //   .reduce((sum, i) => sum + Number.parseFloat(String(i.installment_amount)), 0)
  //   .reduce((sum, i) => sum + Number(i.installment_amount), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          {patient ? (
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                  {patientInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{patient?.name}</h1>
                <p className="text-muted-foreground">
                  ID: {patient?.oralsin_patient_id} • CPF: {patient?.cpf}
                </p>
              </div>
            </div>
          ) : (
            <PatientHeaderSkeleton />
          )}
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <Phone className="h-4 w-4 mr-2" />
                Ligar
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Mail className="h-4 w-4 mr-2" />
                Enviar Email
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Send className="h-4 w-4 mr-2" />
                Enviar WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Download className="h-4 w-4 mr-2" />
                Exportar Dados
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Status Cards */}
      {patient && contract && installments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Parcelas</p>
                  <p className="text-2xl font-bold">{totalInstallments}</p>
                </div>
                <FileText className="h-8 w-8 mt-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Parcelas Pagas</p>
                  <p className="text-2xl font-bold text-green-600">{paidInstallments}</p>
                </div>
                <CheckCircle className="h-8 w-8 mt-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Em Atraso</p>
                  <p className="text-2xl font-bold text-red-600">{overdueInstallments}</p>
                </div>
                <AlertCircle className="h-8 w-8 mt-5 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                  <p className="text-2xl font-bold">{formatCurrency(String(totalAmount))}</p>
                </div>
                <DollarSign className="h-8 w-8 mt-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <StatusCardsSkeleton />
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="installments">Parcelas</TabsTrigger>
          <TabsTrigger value="contracts">Contratos</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="flow">Fluxo</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient Info */}
            {patient ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informações do Paciente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{patient?.email}</p>
                      </div>
                    </div>

                    {patient?.phones.map((phone) => (
                      <div key={phone.id} className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Telefone ({phone.phone_type})</p>
                          <p className="text-sm text-muted-foreground">{formatPhone(phone.phone_number)}</p>
                        </div>
                      </div>
                    ))}

                    {patient?.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Endereço</p>
                          <p className="text-sm text-muted-foreground">
                            {patient?.address.street}, {patient?.address.number}
                            {patient?.address.complement && ` - ${patient?.address.complement}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {patient?.address.neighborhood}, {patient?.address.city} - {patient?.address.state}
                          </p>
                          <p className="text-sm text-muted-foreground">CEP: {patient?.address.zip_code}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      {patient?.is_notification_enabled ? (
                        <Bell className="h-4 w-4 text-green-600" />
                      ) : (
                        <BellOff className="h-4 w-4 text-red-600" />
                      )}
                      <div>
                        <p className="text-sm font-medium">Notificações</p>
                        <p className="text-sm text-muted-foreground">
                          {patient?.is_notification_enabled ? "Habilitadas" : "Desabilitadas"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Fluxo Atual</p>
                    {getFlowBadge(patient?.flow_type)}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <PatientInfoSkeleton />
            )}

            {/* Collection Case */}
            {collectionCase && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PhoneCall className="h-5 w-5" />
                    Caso de Cobrança
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Deal ID</p>
                      <p className="text-lg font-semibold">{collectionCase?.deal_id ? collectionCase?.deal_id : "Pendente"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Valor</p>
                      <p className="text-lg font-semibold">{formatCurrency(String(collectionCase?.amount))}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge variant={collectionCase?.status === "open" ? "destructive" : "default"} className="mt-1">
                      {collectionCase?.status === "open" ? "Aberto" : "Fechado"}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Aberto em</p>
                    <p className="text-sm">{formatDateTime(collectionCase?.opened_at)}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Sincronização</p>
                    <Badge variant="outline" className="mt-1">
                      {collectionCase?.deal_sync_status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="installments" className="space-y-6">
          {installments.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Parcelas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Parcela</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Método de Pagamento</TableHead>
                        <TableHead>Atual</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {installments.map((installment) => (
                        <TableRow key={installment?.id}>
                          <TableCell className="font-medium">#{installment?.installment_number}</TableCell>
                          <TableCell>{formatDate(installment?.due_date)}</TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(installment?.installment_amount)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(installment?.installment_status, installment?.received)}
                          </TableCell>
                          <TableCell>{installment?.payment_method?.name}</TableCell>
                          <TableCell>{installment?.is_current && <Badge variant="outline">Atual</Badge>}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <InstallmentsSkeleton />
          )}
        </TabsContent>

        <TabsContent value="contracts" className="space-y-6">
          {contract ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Contratos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">ID do Contrato</p>
                      <p className="text-lg font-semibold">{contract?.oralsin_contract_id}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mt-1"
                      >
                        {contract?.status}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Versão</p>
                      <p className="text-sm">{contract?.contract_version}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Parcelas Restantes</p>
                      <p className="text-lg font-semibold">{contract?.remaining_installments}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                      <p className="text-lg font-semibold">{formatCurrency(contract?.final_contract_value)}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Valor em Atraso</p>
                      <p className="text-lg font-semibold text-red-600">{formatCurrency(contract?.overdue_amount)}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Método de Pagamento</p>
                      <p className="text-sm">{contract?.payment_method?.name}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Primeira Cobrança</p>
                      <p className="text-sm">{formatDate(contract?.first_billing_date)}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Configurações</p>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      {contract?.do_notifications ? (
                        <Bell className="h-4 w-4 text-green-600" />
                      ) : (
                        <BellOff className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm">
                        Notificações {contract?.do_notifications ? "Habilitadas" : "Desabilitadas"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {contract?.do_billings ? (
                        <CreditCard className="h-4 w-4 text-green-600" />
                      ) : (
                        <CreditCard className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm">Cobrança {contract?.do_billings ? "Habilitada" : "Desabilitada"}</span>
                    </div>
                  </div>
                </div>

                {contract?.negotiation_notes && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Observações de Negociação</p>
                      <p className="text-sm mt-1">{contract?.negotiation_notes}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <ContractInfoSkeleton />
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Histórico de Contatos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum histórico encontrado</h3>
                <p className="text-muted-foreground">
                  O histórico de contatos aparecerá aqui quando houver interações registradas.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Fluxo de Cobrança
              </CardTitle>
            </CardHeader>
            <CardContent>
              {patient?.flow_type === "notification_billing" ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Milestone className="h-5 w-5 text-blue-600" />
                    <p className="text-sm font-medium">
                      Paciente está no passo <span className="font-bold">{currentStep}</span> do fluxo de notificações
                    </p>
                  </div>

                  <div className="relative">
                    {/* Linha vertical conectora */}
                    <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200 dark:bg-gray-800"></div>

                    {/* Timeline items */}
                    <div className="space-y-8">
                      {flowSteps.map((step, index) => {
                        const isCurrentStep = step.step_number === currentStep
                        const isPastStep = step.step_number < currentStep
                        const isFutureStep = step.step_number > currentStep

                        return (
                          <div key={step.id} className="relative flex items-start gap-4">
                            {/* Círculo indicador */}
                            <div
                              className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 ${
                                isCurrentStep
                                  ? "border-blue-600 bg-blue-50 dark:bg-blue-950 dark:border-blue-500"
                                  : isPastStep
                                    ? "border-green-600 bg-green-50 dark:bg-green-950 dark:border-green-500"
                                    : "border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700"
                              }`}
                            >
                              {isPastStep ? (
                                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-500" />
                              ) : isCurrentStep ? (
                                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                              ) : (
                                <Calendar className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                              )}
                            </div>

                            {/* Conteúdo */}
                            <div
                              className={`flex-1 rounded-lg border p-4 shadow-sm ${
                                isCurrentStep
                                  ? "border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-900"
                                  : isPastStep
                                    ? "border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-900"
                                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                              }`}
                            >
                              <div className="mb-1 flex items-center justify-between">
                                <h4
                                  className={`font-medium ${
                                    isCurrentStep
                                      ? "text-blue-800 dark:text-blue-300"
                                      : isPastStep
                                        ? "text-green-800 dark:text-green-300"
                                        : "text-gray-900 dark:text-gray-100"
                                  }`}
                                >
                                  {step.description}
                                </h4>
                                {isCurrentStep && <Badge className="bg-blue-500">Atual</Badge>}
                              </div>

                              <div className="mt-2 flex flex-wrap gap-2">
                                {step.channels.map((channel) => (
                                  <div
                                    key={channel}
                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                      isCurrentStep
                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                        : isPastStep
                                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                    }`}
                                  >
                                    {getChannelIcon(channel)}
                                    <span className="capitalize">{channel}</span>
                                  </div>
                                ))}
                              </div>

                              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                {isPastStep
                                  ? "Concluído"
                                  : isCurrentStep
                                    ? "Em andamento"
                                    : `Agendado para ${step.cooldown_days} dias após o passo anterior`}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ) : patient?.flow_type === "cordial_billing" ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="h-5 w-5 text-orange-600" />
                    <p className="text-sm font-medium">Paciente está em fluxo de Cobrança Amigável</p>
                  </div>

                  <div className="rounded-lg border bg-white p-4 dark:bg-gray-950 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4">Status do Acordo</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Deal ID</p>
                        <p className="text-lg font-semibold">{collectionCase?.deal_id || "Pendente"}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Status de Sincronização</p>
                        <div className="flex items-center gap-2">
                          {collectionCase?.deal_sync_status === "created" ? (
                            <CheckCheck className="h-5 w-5 text-green-600" />
                          ) : collectionCase?.deal_sync_status === "pending" ? (
                            <Clock className="h-5 w-5 text-amber-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                          <Badge
                            variant={
                              collectionCase?.deal_sync_status === "created"
                                ? "default"
                                : collectionCase?.deal_sync_status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="capitalize"
                          >
                            {collectionCase?.deal_sync_status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-sm text-muted-foreground">Atividades Recentes</h4>

                      <div className="relative">
                        {/* Linha vertical conectora */}
                        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                        {/* Timeline items */}
                        <div className="space-y-6">
                          {mockDealActivities.map((activity, index) => (
                            <div key={activity.id} className="relative flex items-start gap-4">
                              {/* Círculo indicador */}
                              <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-orange-500 bg-orange-50 dark:bg-orange-950/30 dark:border-orange-700">
                                {activity.type === "call" ? (
                                  <PhoneOutgoing className="h-5 w-5 text-orange-600" />
                                ) : activity.type === "task" ? (
                                  <CheckCircle2 className="h-5 w-5 text-orange-600" />
                                ) : (
                                  <Calendar className="h-5 w-5 text-orange-600" />
                                )}
                              </div>

                              {/* Conteúdo */}
                              <div className="flex-1 rounded-lg border border-orange-200 bg-orange-50 p-4 shadow-sm dark:bg-orange-950/20 dark:border-orange-900/50">
                                <div className="mb-1 flex items-center justify-between">
                                  <h4 className="font-medium text-orange-800 dark:text-orange-300">
                                    {activity.subject}
                                  </h4>
                                  <Badge variant="outline" className="capitalize">
                                    {activity.type}
                                  </Badge>
                                </div>

                                <div className="mt-2 text-sm">
                                  <p className="text-gray-600 dark:text-gray-400">
                                    <span className="font-medium">Data:</span> {formatDate(activity.due_date)}
                                  </p>
                                  {activity.person_name && (
                                    <p className="text-gray-600 dark:text-gray-400">
                                      <span className="font-medium">Contato:</span> {activity.person_name}
                                    </p>
                                  )}
                                  {activity.org_name && (
                                    <p className="text-gray-600 dark:text-gray-400">
                                      <span className="font-medium">Organização:</span> {activity.org_name}
                                    </p>
                                  )}
                                  {activity.note && (
                                    <p className="text-gray-600 dark:text-gray-400 mt-2 border-t border-orange-200 dark:border-orange-800 pt-2">
                                      {activity.note}
                                    </p>
                                  )}
                                </div>

                                <div className="mt-2 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                  <CheckCircle2 className="h-3 w-3" />
                                  <span>Concluído em {formatDate(activity.marked_as_done_time)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Sem fluxo de cobrança ativo</h3>
                  <p className="text-muted-foreground mb-4">
                    Este paciente não está em nenhum fluxo de cobrança no momento.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button variant="outline" size="sm">
                      <Target className="h-4 w-4 mr-2" />
                      Iniciar Gestão de Recebíveis
                    </Button>
                    <Button variant="outline" size="sm">
                      <PhoneCall className="h-4 w-4 mr-2" />
                      Iniciar Cobrança Amigável
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
