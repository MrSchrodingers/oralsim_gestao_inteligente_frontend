import type { ICollectionCase } from "@/src/modules/cordialBilling/interfaces/ICollectionCase"
import { Badge } from "../ui/badge"
import type { IContactSchedule } from "@/src/modules/notification/interfaces/IContactSchedule"
import { AlertCircle, CheckCircle, Clock, Target } from "lucide-react"
import type { IPatient } from "../../interfaces/IPatient"

export type PatientWithFlow = IPatient & {
  flowType?: "receivable" | "collection" | null
  flowData?: IContactSchedule | ICollectionCase
}

export const getFlowBadge = (patient: PatientWithFlow) => {
  if (!patient.flowType) {
    return <Badge variant="secondary">Sem Fluxo</Badge>
  }

  if (patient.flowType === "receivable") {
    const data = patient.flowData as IContactSchedule
    return (
      <div className="flex flex-col gap-1 items-start">
        <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          Gestão de Recebíveis
        </Badge>
        <span className="text-xs text-muted-foreground">Etapa {data.current_step}</span>
      </div>
    )
  }

  if (patient.flowType === "collection") {
    const data = patient.flowData as ICollectionCase
    return (
      <div className="flex flex-col gap-1 items-start">
        <Badge variant="default" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
          Cobrança Amigável
        </Badge>
        <span className="text-xs text-muted-foreground capitalize">{data.status}</span>
      </div>
    )
  }
}

export const getStatusBadge = (patient: PatientWithFlow) => {
  if (!patient.flowType) {
    return <Badge variant="outline">Inativo</Badge>
  }

  if (patient.flowType === "receivable") {
    const data = patient.flowData as IContactSchedule
    const statusMap = {
      pending: { label: "Pendente", variant: "secondary" as const, icon: Clock },
      completed: { label: "Concluído", variant: "default" as const, icon: CheckCircle },
      failed: { label: "Falhou", variant: "destructive" as const, icon: AlertCircle },
    }
    const statusInfo = statusMap[data.status as keyof typeof statusMap] || statusMap.pending
    const Icon = statusInfo.icon

    return (
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {statusInfo.label}
      </Badge>
    )
  }
  if (patient.flowType === "collection") {
    const data = patient.flowData as ICollectionCase
    const statusMap = {
      open: { label: "Aberto", variant: "default" as const, icon: Target },
      closed: { label: "Fechado", variant: "secondary" as const, icon: CheckCircle },
      pending: { label: "Pendente", variant: "secondary" as const, icon: Clock },
    }
    const statusInfo = statusMap[data.status as keyof typeof statusMap] || statusMap.pending
    const Icon = statusInfo.icon

    return (
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {statusInfo.label}
      </Badge>
    )
  }
}