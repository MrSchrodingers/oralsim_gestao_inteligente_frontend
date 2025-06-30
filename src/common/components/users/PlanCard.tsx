import { Card, CardHeader, CardContent, CardTitle } from "@/src/common/components/ui/card"
import { Package, CheckCircle } from "lucide-react"
import { formatCurrency, formatDateOnly } from "@/src/common/utils/formatters"
import { getPlanBadge } from "@/src/common/components/helpers/GetBadge"

interface Props {
  plan: {
    name: string
    type: string
    price: number
    billing_cycle: "monthly" | "yearly"
    started_at: string
    expires_at: string
    features: string[]
  }
  subscriptionInfo: { remainingDays: number }
}

export default function PlanCard({ plan, subscriptionInfo }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" /> Plano Atual
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">{plan.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(plan.price)}/{plan.billing_cycle === "monthly" ? "mês" : "ano"}
            </p>
          </div>
          {getPlanBadge(plan.type)}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <InfoRow label="Tempo de assinatura">
            {Math.floor(
              (Date.now() - new Date(plan.started_at).getTime()) / 86_400_000,
            )}{" "}
            dias
          </InfoRow>
          <InfoRow label="Dias restantes">{subscriptionInfo.remainingDays} dias</InfoRow>
          <InfoRow label="Início">{formatDateOnly(plan.started_at)}</InfoRow>
          <InfoRow label="Expira">{formatDateOnly(plan.expires_at)}</InfoRow>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Recursos inclusos:</p>
          <ul className="space-y-1">
            {plan.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-3 w-3 text-green-600" /> {f}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{children}</span>
    </div>
  )
}
