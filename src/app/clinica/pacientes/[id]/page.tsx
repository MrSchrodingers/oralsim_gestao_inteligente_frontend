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
  Edit,
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

// Mock data baseado no contexto fornecido
const mockPatient = {
  id: "8c8dfbaa-9b41-4236-bef2-623e32a539fc",
  oralsin_patient_id: 1818973,
  clinic_id: "5c91f4bf-fdc5-45a0-b0c9-814e7acb0b2d",
  name: "ADAO LOPES",
  contact_name: "ADAO LOPES",
  cpf: "049.533.008-66",
  address: {
    id: "45ff09ca-5b0c-434f-adf8-90985ce9398c",
    street: "NICOLAU DELGALO",
    number: "15-26",
    complement: "QD 15 26",
    neighborhood: "VL S JOAO DO IPIRANG",
    city: "Bauru",
    state: "São Paulo",
    zip_code: "17056150",
    created_at: "2025-06-17T08:41:07.301062-03:00",
    updated_at: "2025-06-17T08:41:07.528928-03:00",
  },
  email: "mrschrodingers@gmail.com",
  is_notification_enabled: true,
  flow_type: "notification_billing",
  phones: [
    {
      id: "67370260-bd04-481a-83ba-6c3bd3f0dfda",
      patient_id: "8c8dfbaa-9b41-4236-bef2-623e32a539fc",
      phone_number: "5543991938235",
      phone_type: "mobile",
      created_at: "2025-06-17T08:44:07.383241-03:00",
      updated_at: "2025-06-17T08:44:07.383260-03:00",
    },
  ],
  created_at: "2025-06-17T08:41:07.307365-03:00",
  updated_at: "2025-06-17T08:41:07.533570-03:00",
}

const mockContract = {
  id: "79c79ef6-7808-4ad1-bdd0-09bfc4768590",
  oralsin_contract_id: 961031,
  patient_id: "84824a2f-867c-4b5b-89cb-53638d3ac075",
  clinic_id: "5c91f4bf-fdc5-45a0-b0c9-814e7acb0b2d",
  status: "ativo",
  contract_version: "1",
  remaining_installments: 6,
  overdue_amount: "0.00",
  final_contract_value: "15000.00",
  do_notifications: true,
  do_billings: false,
  first_billing_date: "2025-05-22",
  negotiation_notes: "",
  payment_method: {
    id: "bdae79de-392f-4e84-ad80-a8066348f2e7",
    oralsin_payment_method_id: 1,
    name: "Boleto Bancário",
    created_at: "2025-06-17T08:40:47.045211-03:00",
  },
  created_at: "2025-06-17T08:41:38.706053-03:00",
  updated_at: "2025-06-17T08:41:39.005251-03:00",
}

const mockInstallments = [
  {
    id: "00081d7b-5d1c-4f03-b586-e3d8ab8b0d9e",
    contract_id: "7f5bf7fd-1558-4518-a60e-aec5c65d5c26",
    contract_version: 1,
    installment_number: 4,
    oralsin_installment_id: 14466394,
    due_date: "2025-01-04",
    installment_amount: "500.00",
    received: true,
    installment_status: "Compensado",
    payment_method: {
      id: "bdae79de-392f-4e84-ad80-a8066348f2e7",
      name: "Boleto Bancário",
    },
    is_current: false,
  },
  {
    id: "002a92fa-4184-47f6-a1bb-48db9dd1d285",
    contract_id: "0879fe22-88fa-4c8e-a51c-208085a248c0",
    contract_version: 2,
    installment_number: 25,
    oralsin_installment_id: 14840431,
    due_date: "2026-11-10",
    installment_amount: "1195.00",
    received: false,
    installment_status: "Não Compensado",
    payment_method: {
      id: "bdae79de-392f-4e84-ad80-a8066348f2e7",
      name: "Boleto Bancário",
    },
    is_current: true,
  },
  {
    id: "00676fb1-ba92-4b9d-9250-9a9e5c43ee1f",
    contract_id: "61b86c72-15e4-4ec6-a23e-dd2202e10cf0",
    contract_version: 2,
    installment_number: 8,
    oralsin_installment_id: 15603798,
    due_date: "2023-04-25",
    installment_amount: "928.00",
    received: true,
    installment_status: "Compensado",
    payment_method: {
      id: "bdae79de-392f-4e84-ad80-a8066348f2e7",
      name: "Boleto Bancário",
    },
    is_current: false,
  },
]

const mockCollectionCase = {
  id: "32074515-e51c-4a4c-958c-f3cd2ac8c68c",
  patient_id: "f9beeb24-36fc-465f-9da6-a1b0a9ebca2c",
  contract_id: "ebfaa646-01a3-452f-97ed-cb4add4b8143",
  installment_id: "14cf6435-89f7-406e-ac3a-ce99052c6980",
  clinic_id: "5c91f4bf-fdc5-45a0-b0c9-814e7acb0b2d",
  opened_at: "2025-06-17T08:47:28.913751-03:00",
  amount: "887.99",
  deal_id: 2407,
  deal_sync_status: "created",
  status: "open",
}

const mockFlowSteps = [
  {
    id: "6f7d0f09-0d94-4a98-9c0d-5463a4b71138",
    step_number: 0,
    channels: ["whatsapp"],
    active: true,
    description: "Semana 0: WhatsApp",
    cooldown_days: 7,
    created_at: "2025-06-17T08:40:31.333842-03:00",
    updated_at: "2025-06-17T08:40:31.333861-03:00",
  },
  {
    id: "eea98323-0045-4c89-a578-d8e868275bbb",
    step_number: 1,
    channels: ["whatsapp", "sms"],
    active: true,
    description: "Semana 1: WhatsApp + SMS",
    cooldown_days: 7,
    created_at: "2025-06-17T08:40:31.337084-03:00",
    updated_at: "2025-06-17T08:40:31.337098-03:00",
  },
  {
    id: "0766f4ea-5404-41b6-b050-afd783576510",
    step_number: 2,
    channels: ["whatsapp"],
    active: true,
    description: "Semana 2: WhatsApp",
    cooldown_days: 7,
    created_at: "2025-06-17T08:40:31.341205-03:00",
    updated_at: "2025-06-17T08:40:31.341220-03:00",
  },
  {
    id: "c839da85-7d35-4232-8f37-6cc1379f5a4e",
    step_number: 3,
    channels: ["email"],
    active: true,
    description: "Semana 3: E-mail",
    cooldown_days: 7,
    created_at: "2025-06-17T08:40:31.347243-03:00",
    updated_at: "2025-06-17T08:40:31.347258-03:00",
  },
  {
    id: "4d55ff74-e805-48cb-a0e4-7870173bc506",
    step_number: 4,
    channels: ["whatsapp"],
    active: true,
    description: "Semana 4: WhatsApp",
    cooldown_days: 7,
    created_at: "2025-06-17T08:40:31.349803-03:00",
    updated_at: "2025-06-17T08:40:31.349817-03:00",
  },
  {
    id: "6e6b5734-bb9e-42bd-abac-c6cb7e63a661",
    step_number: 5,
    channels: ["phonecall"],
    active: true,
    description: "Semana 5: Ligação",
    cooldown_days: 7,
    created_at: "2025-06-17T08:40:31.352358-03:00",
    updated_at: "2025-06-17T08:40:31.352373-03:00",
  },
  {
    id: "47ce5b15-288f-489a-bf8a-5da38b09524e",
    step_number: 6,
    channels: ["whatsapp", "sms"],
    active: true,
    description: "Semana 6: WhatsApp + SMS",
    cooldown_days: 7,
    created_at: "2025-06-17T08:40:31.359961-03:00",
    updated_at: "2025-06-17T08:40:31.359976-03:00",
  },
  {
    id: "884e37f5-0109-4cd7-8d06-a30774ff831e",
    step_number: 7,
    channels: ["whatsapp"],
    active: true,
    description: "Semana 7: WhatsApp",
    cooldown_days: 7,
    created_at: "2025-06-17T08:40:31.362274-03:00",
    updated_at: "2025-06-17T08:40:31.362285-03:00",
  },
  {
    id: "7f3f665d-6c60-481b-9999-fca1f9f2e3c5",
    step_number: 8,
    channels: ["whatsapp"],
    active: true,
    description: "Semana 8: WhatsApp",
    cooldown_days: 7,
    created_at: "2025-06-17T08:40:31.364283-03:00",
    updated_at: "2025-06-17T08:40:31.364295-03:00",
  },
  {
    id: "ef82d602-ca2c-4f8b-acc4-7560bbb215a6",
    step_number: 9,
    channels: ["phonecall"],
    active: true,
    description: "Semana 9: Ligação",
    cooldown_days: 7,
    created_at: "2025-06-17T08:40:31.366200-03:00",
    updated_at: "2025-06-17T08:40:31.366210-03:00",
  },
]

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

// Simular o passo atual do paciente (para notification_billing)
const currentStep = 3

const formatDate = (dateStr: string) => {
  if (!dateStr) return "N/A"
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateStr))
}

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return "N/A"
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr))
}

const formatCurrency = (value: string | number) => {
  const numValue = typeof value === "string" ? Number.parseFloat(value) : value
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numValue)
}

const formatPhone = (phone: string) => {
  if (!phone) return "N/A"
  // Remove country code if present
  const cleanPhone = phone.replace(/^55/, "")
  // Format as (XX) XXXXX-XXXX or (XX) XXXX-XXXX
  if (cleanPhone.length === 11) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`
  } else if (cleanPhone.length === 10) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`
  }
  return phone
}

const getStatusBadge = (status: string, received?: boolean) => {
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

const getFlowBadge = (flowType: string | null) => {
  switch (flowType) {
    case "cordial_billing":
      return (
        <Badge variant="default" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
          <PhoneCall className="h-3 w-3 mr-1" />
          Cobrança Amigável
        </Badge>
      )
    case "notification_billing":
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          <Target className="h-3 w-3 mr-1" />
          Gestão de Recebíveis
        </Badge>
      )
    default:
      return <Badge variant="outline">Sem fluxo</Badge>
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

  const patientInitials = mockPatient.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)

  const totalInstallments = mockInstallments.length
  const paidInstallments = mockInstallments.filter((i) => i.received).length
  const overdueInstallments = mockInstallments.filter((i) => !i.received && new Date(i.due_date) < new Date()).length
  const totalAmount = mockInstallments.reduce((sum, i) => sum + Number.parseFloat(i.installment_amount), 0)
  const paidAmount = mockInstallments
    .filter((i) => i.received)
    .reduce((sum, i) => sum + Number.parseFloat(i.installment_amount), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                {patientInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{mockPatient.name}</h1>
              <p className="text-muted-foreground">
                ID: {mockPatient.oralsin_patient_id} • CPF: {mockPatient.cpf}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Phone className="h-4 w-4 mr-2" />
                Ligar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="h-4 w-4 mr-2" />
                Enviar Email
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Send className="h-4 w-4 mr-2" />
                Enviar WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Exportar Dados
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Parcelas</p>
                <p className="text-2xl font-bold">{totalInstallments}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
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
              <CheckCircle className="h-8 w-8 text-green-600" />
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
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

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
                      <p className="text-sm text-muted-foreground">{mockPatient.email}</p>
                    </div>
                  </div>

                  {mockPatient.phones.map((phone) => (
                    <div key={phone.id} className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Telefone ({phone.phone_type})</p>
                        <p className="text-sm text-muted-foreground">{formatPhone(phone.phone_number)}</p>
                      </div>
                    </div>
                  ))}

                  {mockPatient.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Endereço</p>
                        <p className="text-sm text-muted-foreground">
                          {mockPatient.address.street}, {mockPatient.address.number}
                          {mockPatient.address.complement && ` - ${mockPatient.address.complement}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {mockPatient.address.neighborhood}, {mockPatient.address.city} - {mockPatient.address.state}
                        </p>
                        <p className="text-sm text-muted-foreground">CEP: {mockPatient.address.zip_code}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    {mockPatient.is_notification_enabled ? (
                      <Bell className="h-4 w-4 text-green-600" />
                    ) : (
                      <BellOff className="h-4 w-4 text-red-600" />
                    )}
                    <div>
                      <p className="text-sm font-medium">Notificações</p>
                      <p className="text-sm text-muted-foreground">
                        {mockPatient.is_notification_enabled ? "Habilitadas" : "Desabilitadas"}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-medium">Fluxo Atual</p>
                  {getFlowBadge(mockPatient.flow_type)}
                </div>
              </CardContent>
            </Card>

            {/* Collection Case */}
            {mockCollectionCase && (
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
                      <p className="text-lg font-semibold">{mockCollectionCase.deal_id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Valor</p>
                      <p className="text-lg font-semibold">{formatCurrency(mockCollectionCase.amount)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge variant={mockCollectionCase.status === "open" ? "destructive" : "default"} className="mt-1">
                      {mockCollectionCase.status === "open" ? "Aberto" : "Fechado"}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Aberto em</p>
                    <p className="text-sm">{formatDateTime(mockCollectionCase.opened_at)}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Sincronização</p>
                    <Badge variant="outline" className="mt-1">
                      {mockCollectionCase.deal_sync_status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="installments" className="space-y-6">
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
                    {mockInstallments.map((installment) => (
                      <TableRow key={installment.id}>
                        <TableCell className="font-medium">#{installment.installment_number}</TableCell>
                        <TableCell>{formatDate(installment.due_date)}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(installment.installment_amount)}</TableCell>
                        <TableCell>{getStatusBadge(installment.installment_status, installment.received)}</TableCell>
                        <TableCell>{installment.payment_method.name}</TableCell>
                        <TableCell>{installment.is_current && <Badge variant="outline">Atual</Badge>}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-6">
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
                    <p className="text-lg font-semibold">{mockContract.oralsin_contract_id}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mt-1"
                    >
                      {mockContract.status}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Versão</p>
                    <p className="text-sm">{mockContract.contract_version}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Parcelas Restantes</p>
                    <p className="text-lg font-semibold">{mockContract.remaining_installments}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                    <p className="text-lg font-semibold">{formatCurrency(mockContract.final_contract_value)}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Valor em Atraso</p>
                    <p className="text-lg font-semibold text-red-600">{formatCurrency(mockContract.overdue_amount)}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Método de Pagamento</p>
                    <p className="text-sm">{mockContract.payment_method.name}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Primeira Cobrança</p>
                    <p className="text-sm">{formatDate(mockContract.first_billing_date)}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Configurações</p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    {mockContract.do_notifications ? (
                      <Bell className="h-4 w-4 text-green-600" />
                    ) : (
                      <BellOff className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">
                      Notificações {mockContract.do_notifications ? "Habilitadas" : "Desabilitadas"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {mockContract.do_billings ? (
                      <CreditCard className="h-4 w-4 text-green-600" />
                    ) : (
                      <CreditCard className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">Cobrança {mockContract.do_billings ? "Habilitada" : "Desabilitada"}</span>
                  </div>
                </div>
              </div>

              {mockContract.negotiation_notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Observações de Negociação</p>
                    <p className="text-sm mt-1">{mockContract.negotiation_notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
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
              {mockPatient.flow_type === "notification_billing" ? (
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
                      {mockFlowSteps.map((step, index) => {
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
              ) : mockPatient.flow_type === "cordial_billing" ? (
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
                        <p className="text-lg font-semibold">{mockCollectionCase.deal_id || "Pendente"}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Status de Sincronização</p>
                        <div className="flex items-center gap-2">
                          {mockCollectionCase.deal_sync_status === "created" ? (
                            <CheckCheck className="h-5 w-5 text-green-600" />
                          ) : mockCollectionCase.deal_sync_status === "pending" ? (
                            <Clock className="h-5 w-5 text-amber-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                          <Badge
                            variant={
                              mockCollectionCase.deal_sync_status === "created"
                                ? "default"
                                : mockCollectionCase.deal_sync_status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="capitalize"
                          >
                            {mockCollectionCase.deal_sync_status}
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
