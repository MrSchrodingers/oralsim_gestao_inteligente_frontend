import { Button } from "@/src/common/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/common/components/ui/card"
import { Badge } from "@/src/common/components/ui/badge"
import { Separator } from "@/src/common/components/ui/separator"
import { CheckCircle, Star, ArrowRight, Users, Shield, Clock, Activity } from "lucide-react"

// Placeholder data - replace with real Stripe integration
const PRICING_PLANS = [
  {
    id: "starter",
    name: "Starter",
    description: "Para clínicas pequenas",
    price: 29700, // R$ 297.00 in cents
    originalPrice: 39700,
    interval: "month",
    trialDays: 14,
    maxPatients: 500,
    popular: false,
    features: [
      "Até 500 pacientes ativos",
      "Notificações por e-mail",
      "Dashboard básico de inadimplência",
      "Relatórios mensais",
      "Suporte por e-mail",
      "Integração básica com sistemas",
      "Templates de mensagem padrão",
      "Backup automático",
    ],
    limitations: ["Sem SMS ou WhatsApp", "Relatórios limitados", "Suporte apenas em horário comercial"],
  },
  {
    id: "professional",
    name: "Professional",
    description: "Para clínicas em crescimento",
    price: 49700, // R$ 497.00 in cents
    originalPrice: 69700,
    interval: "month",
    trialDays: 14,
    maxPatients: 2000,
    popular: true,
    features: [
      "Até 2.000 pacientes ativos",
      "E-mail, SMS e WhatsApp",
      "Dashboard completo em tempo real",
      "Relatórios avançados e personalizáveis",
      "Suporte prioritário (chat + e-mail)",
      "Fluxos de cobrança personalizáveis",
      "Templates customizáveis",
      "API de integração",
      "Métricas de performance",
      "Agendamento automático de contatos",
      "Histórico completo de comunicações",
      "Backup em tempo real",
    ],
    limitations: [],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Para grandes clínicas e redes",
    price: 89700, // R$ 897.00 in cents
    originalPrice: 119700,
    interval: "month",
    trialDays: 30,
    maxPatients: null, // unlimited
    popular: false,
    features: [
      "Pacientes ilimitados",
      "Todos os canais de comunicação",
      "Dashboard executivo com BI",
      "Relatórios personalizados ilimitados",
      "Suporte 24/7 (telefone + chat + e-mail)",
      "Fluxos avançados com IA",
      "White-label disponível",
      "API completa e webhooks",
      "Métricas avançadas e alertas",
      "Automação completa de processos",
      "Integração com ERPs",
      "Backup redundante multi-região",
      "Consultoria especializada",
      "Treinamento da equipe",
      "SLA garantido de 99.9%",
    ],
    limitations: [],
  },
]

const FAQ_ITEMS = [
  {
    question: "Como funciona o período de teste gratuito?",
    answer:
      "Você pode testar todas as funcionalidades do plano escolhido por 14 dias (30 dias no Enterprise) sem compromisso. Não cobramos cartão de crédito durante o teste.",
  },
  {
    question: "Posso mudar de plano a qualquer momento?",
    answer:
      "Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças são aplicadas imediatamente e o valor é ajustado proporcionalmente.",
  },
  {
    question: "Os dados da minha clínica ficam seguros?",
    answer:
      "Absolutamente. Utilizamos criptografia de ponta a ponta, backup automático e seguimos todas as normas da LGPD. Seus dados nunca são compartilhados com terceiros.",
  },
  {
    question: "Quanto tempo leva para implementar o sistema?",
    answer:
      "A implementação básica leva apenas 24 horas. Nossa equipe técnica faz toda a configuração inicial e migração dos dados existentes.",
  },
  {
    question: "Vocês oferecem treinamento para a equipe?",
    answer:
      "Sim! Todos os planos incluem treinamento básico. O plano Enterprise inclui treinamento presencial e consultoria especializada.",
  },
]

export default function PricingPage() {
  return (
    <main className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
            Preços Transparentes
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Planos que se adaptam ao
            <span className="block text-emerald-600 dark:text-emerald-400">tamanho da sua clínica</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Escolha o plano ideal para reduzir a inadimplência da sua clínica ortodôntica. Todos os planos incluem teste
            gratuito e implementação em 24 horas.
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <span>Teste gratuito</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <span>Sem compromisso</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <span>Cancele quando quiser</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {PRICING_PLANS.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              💳 Aceitamos cartão de crédito, débito e PIX • 📞 Suporte em português • 🔒 Dados 100% seguros
            </p>
            <div className="flex justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>LGPD Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Implementação 24h</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Compare todos os recursos</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Veja em detalhes o que cada plano oferece para sua clínica
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-6 font-semibold">Recursos</th>
                  <th className="text-center p-6 font-semibold">Starter</th>
                  <th className="text-center p-6 font-semibold">Professional</th>
                  <th className="text-center p-6 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <ComparisonRow feature="Pacientes ativos" starter="500" professional="2.000" enterprise="Ilimitado" />
                <ComparisonRow feature="Notificações por e-mail" starter={true} professional={true} enterprise={true} />
                <ComparisonRow feature="Notificações SMS" starter={false} professional={true} enterprise={true} />
                <ComparisonRow feature="Notificações WhatsApp" starter={false} professional={true} enterprise={true} />
                <ComparisonRow
                  feature="Dashboard em tempo real"
                  starter="Básico"
                  professional="Completo"
                  enterprise="Executivo + BI"
                />
                <ComparisonRow
                  feature="Relatórios personalizados"
                  starter="Limitado"
                  professional="Avançado"
                  enterprise="Ilimitado"
                />
                <ComparisonRow
                  feature="API de integração"
                  starter={false}
                  professional="Básica"
                  enterprise="Completa + Webhooks"
                />
                <ComparisonRow
                  feature="Suporte técnico"
                  starter="E-mail"
                  professional="Chat + E-mail"
                  enterprise="24/7 Telefone + Chat"
                />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Perguntas frequentes</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Tire suas dúvidas sobre nossos planos e funcionalidades
            </p>
          </div>

          <div className="space-y-6">
            {FAQ_ITEMS.map((item, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">{item.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-emerald-600 dark:bg-emerald-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Pronto para começar?</h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Escolha seu plano e comece a reduzir a inadimplência da sua clínica hoje mesmo. Implementação em 24 horas e
            suporte completo em português.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Começar Teste Gratuito
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 text-lg"
            >
              Falar com Vendas
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

function PricingCard({ plan }: { plan: (typeof PRICING_PLANS)[0] }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(price / 100)
  }

  return (
    <Card
      className={`relative border-2 ${plan.popular ? "border-emerald-500 shadow-xl" : "border-gray-200 dark:border-gray-700"}`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-emerald-600 text-white px-4 py-1">
            <Star className="h-4 w-4 mr-1" />
            Mais Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
        <CardDescription className="text-base">{plan.description}</CardDescription>

        <div className="mt-6">
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-gray-500 line-through">{formatPrice(plan.originalPrice)}</span>
            <Badge variant="secondary" className="text-xs">
              Oferta de lançamento
            </Badge>
          </div>
          <div className="mt-2">
            <span className="text-4xl font-bold">{formatPrice(plan.price)}</span>
            <span className="text-gray-500 ml-1">/mês</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{plan.trialDays} dias de teste grátis</p>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <Users className="h-4 w-4" />
            <span>
              {plan.maxPatients ? `Até ${plan.maxPatients.toLocaleString("pt-BR")} pacientes` : "Pacientes ilimitados"}
            </span>
          </div>
        </div>

        <Separator className="mb-6" />

        <ul className="space-y-3 mb-8">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        {plan.limitations.length > 0 && (
          <>
            <Separator className="mb-4" />
            <div className="mb-6">
              <p className="text-xs text-gray-500 mb-2">Limitações:</p>
              <ul className="space-y-1">
                {plan.limitations.map((limitation, index) => (
                  <li key={index} className="text-xs text-gray-400 flex items-center gap-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full" />
                    {limitation}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <form action="#" className="space-y-3">
          <input type="hidden" name="planId" value={plan.id} />
          <Button
            className={`w-full ${plan.popular ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
            variant={plan.popular ? "default" : "outline"}
            size="lg"
          >
            {plan.name === "Enterprise" ? "Falar com Vendas" : "Começar Teste Grátis"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          {plan.name !== "Enterprise" && (
            <p className="text-xs text-center text-gray-500">Sem cartão de crédito • Cancele quando quiser</p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

function ComparisonRow({
  feature,
  starter,
  professional,
  enterprise,
}: {
  feature: string
  starter: boolean | string
  professional: boolean | string
  enterprise: boolean | string
}) {
  const renderCell = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <CheckCircle className="h-5 w-5 text-emerald-600 mx-auto" />
      ) : (
        <div className="w-5 h-5 mx-auto bg-gray-200 dark:bg-gray-600 rounded-full" />
      )
    }
    return <span className="text-sm">{value}</span>
  }

  return (
    <tr>
      <td className="p-6 font-medium">{feature}</td>
      <td className="p-6 text-center">{renderCell(starter)}</td>
      <td className="p-6 text-center">{renderCell(professional)}</td>
      <td className="p-6 text-center">{renderCell(enterprise)}</td>
    </tr>
  )
}
