import type { ICollectionCase } from "@/src/modules/cordialBilling/interfaces/ICollectionCase"
import { Badge } from "../ui/badge"
import type { IContactSchedule } from "@/src/modules/notification/interfaces/IContactSchedule"
import { AlertCircle, CheckCircle, Clock, Mail, MessageSquare, PhoneCall, Smartphone, Target } from "lucide-react"
import type { IPatient } from "../../interfaces/IPatient"

export type PatientWithFlow = IPatient & {
  flowType?: "cordial_billing" | "notification_billing" | null | undefined
  flowData?: IContactSchedule | ICollectionCase
}

export const getStepBadge = (step: number) => {
  const colors = [
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  ]

  return <Badge className={colors[step % colors.length]}>Etapa {step}</Badge>
}

export const getPriorityBadge = (attempts: number, overdueAmount: string) => {
  const overdue = Number.parseFloat(overdueAmount)

  if (attempts >= 2 || overdue > 1000) {
    return (
      <Badge variant="destructive">
        <AlertCircle className="h-3 w-3 mr-1" />
        Alta
      </Badge>
    )
  } else if (attempts >= 1 || overdue > 500) {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
        <Clock className="h-3 w-3 mr-1" />
        Média
      </Badge>
    )
  } else {
    return (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        <Target className="h-3 w-3 mr-1" />
        Normal
      </Badge>
    )
  }
}

export const getFlowBadge = (
  flowType?: "notification_billing" | "cordial_billing" | null
) => {
  if (!flowType) {
    return <Badge variant="secondary">Sem Fluxo</Badge>
  }

  if (flowType === "notification_billing") {
    return (
      <div className="flex flex-col gap-1 items-start">
        <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          Gestão de Recebíveis
        </Badge>
      </div>
    )
  }

  if (flowType === "cordial_billing") {
    return (
      <div className="flex flex-col gap-1 items-start">
        <Badge variant="default" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
          Cobrança Amigável
        </Badge>
      </div>
    )
  }
}

export const getChannelIcon = (channel: string) => {
  switch (channel) {
    case "whatsapp":
      return <Smartphone className="h-4 w-4 text-green-600" />
    case "sms":
      return <MessageSquare className="h-4 w-4 text-blue-600" />
    case "email":
      return <Mail className="h-4 w-4 text-purple-600" />
    case "phonecall":
      return <PhoneCall className="h-4 w-4 text-orange-600" />
    case "letter":
      return <Mail className="h-4 w-4 text-orange-600" />
    default:
      return <MessageSquare className="h-4 w-4" />
  }
}

export const getChannelBadge = (channel: string) => {
  const configs = {
    whatsapp: { label: "WhatsApp", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
    sms: { label: "SMS", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
    email: { label: "E-mail", className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
    phonecall: { label: "Ligação", className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
    letter: { label: "Carta Amigável", className: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200" }
  }

  const config = configs[channel as keyof typeof configs] || { label: channel, className: "bg-gray-100 text-gray-800" }

  return (
    <Badge variant="secondary" className={config.className}>
      {getChannelIcon(channel)}
      <span className="ml-1">{config.label}</span>
    </Badge>
  )
}

export const getStatusBadge = (patient: PatientWithFlow) => {
  if (!patient.flowType) {
    return <Badge variant="outline">Inativo</Badge>
  }

  if (patient.flowType === "notification_billing") {
    const data = patient.flowData as IContactSchedule
    const statusMap = {
      pending: { label: "Pendente", variant: "secondary" as const, icon: Clock },
      completed: { label: "Concluído", variant: "default" as const, icon: CheckCircle },
      failed: { label: "Falhou", variant: "destructive" as const, icon: AlertCircle },
    }
    const statusInfo = statusMap[data?.status as keyof typeof statusMap] || statusMap.pending
    const Icon = statusInfo.icon

    return (
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {statusInfo.label}
      </Badge>
    )
  }
  if (patient.flowType === "cordial_billing") {
    const data = patient.flowData as ICollectionCase
    const statusMap = {
      open: { label: "Aberto", variant: "default" as const, icon: Target },
      closed: { label: "Fechado", variant: "secondary" as const, icon: CheckCircle },
      pending: { label: "Pendente", variant: "secondary" as const, icon: Clock },
    }
    const statusInfo = statusMap[data?.status as keyof typeof statusMap] || statusMap.pending
    const Icon = statusInfo.icon

    return (
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {statusInfo.label}
      </Badge>
    )
  }
}

export const getInstallmentStatusBadge = (status?: string | null, received?: boolean) => {
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