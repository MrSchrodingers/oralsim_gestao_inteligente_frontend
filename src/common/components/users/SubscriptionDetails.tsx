import { Card, CardHeader, CardTitle, CardContent } from "@/src/common/components/ui/card"
import { CreditCard, CheckCircle } from "lucide-react"
import { formatCurrency, formatDateOnly } from "@/src/common/utils/formatters"

interface SubscriptionInfo {
  remainingDays: number
}
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
  subStatusBadge: React.ReactNode
  subscriptionInfo: SubscriptionInfo
}

export default function SubscriptionDetails({
  plan,
  subStatusBadge,
  subscriptionInfo,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" /> Detalhes da Assinatura
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-semibold text-lg">{plan.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(plan.price)}/{plan.billing_cycle === "monthly" ? "mês" : "ano"}
            </p>
          </div>
          <div className="text-right space-y-2">
            {subStatusBadge}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <Info label="Início">{formatDateOnly(plan.started_at)}</Info>
          <Info label="Expira">{formatDateOnly(plan.expires_at)}</Info>
          <Info label="Dias restantes">{subscriptionInfo.remainingDays}</Info>
          <Info label="Tempo total">
            {Math.floor(
              (Date.now() - new Date(plan.started_at).getTime()) / 86_400_000,
            )}{" "}
            dias
          </Info>
        </div>

        <section>
          <p className="text-sm font-medium mb-2">Recursos do Plano</p>
          <ul className="space-y-1">
            {plan.features.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" /> {f}
              </li>
            ))}
          </ul>
        </section>
      </CardContent>
    </Card>
  )
}

const Info = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <p className="text-muted-foreground">{label}</p>
    <p className="font-medium">{children}</p>
  </div>
)
