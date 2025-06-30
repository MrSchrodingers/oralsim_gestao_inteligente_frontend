import { Card, CardContent } from "@/src/common/components/ui/card"
import {
  Users,
  UserCheck,
  Target,
  PhoneCall,
  TrendingUp,
} from "lucide-react"
import { formatCurrency } from "@/src/common/utils/formatters"
import type { IClinicSummary } from "@/src/common/interfaces/IClinic"

interface Props {
  stats: IClinicSummary
}
export default function OverviewStats({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <Stat icon={Users} label="Total Pacientes" value={stats.total_patients} />
      <Stat
        icon={UserCheck}
        label="Pacientes Ativos"
        value={stats.active_patients}
        color="text-green-600"
      />
      <Stat
        icon={Target}
        label="Recebíveis"
        value={stats.receivables}
        color="text-blue-600"
      />
      <Stat
        icon={PhoneCall}
        label="Cobrança"
        value={stats.collection_cases}
        color="text-orange-600"
      />
      <Stat
        icon={TrendingUp}
        label="Receita Mensal"
        value={formatCurrency(stats.monthly_revenue)}
        color="text-green-600"
      />
    </div>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
  color = "text-muted-foreground",
}: {
  icon: React.ElementType
  label: string
  value: React.ReactNode
  color?: string
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  )
}
