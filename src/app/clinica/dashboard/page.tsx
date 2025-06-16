"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import type { FC, ReactNode } from "react"
import {
  Users,
  FileText,
  Settings,
  CreditCard,
  AlertCircle,
  RefreshCw,
  Clock,
  DollarSign,
  Target,
  Activity,
  Bell,
  BarChart3,
  Zap,
  CheckCircle,
  AlertTriangle,
  Download,
  PhoneCall,
  PieChart,
  TrendingUp,
  Calendar,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/common/components/ui/card"
import { Progress } from "@/src/common/components/ui/progress"
import { Button } from "@/src/common/components/ui/button"
import { Badge } from "@/src/common/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/common/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/common/components/ui/select"
import { Skeleton } from "@/src/common/components/ui/skeleton"
import { MetricCard } from "@/src/common/components/metricCard"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { motion } from "framer-motion"

// Mock data and hooks
const mockDashboard = {
  stats: {
    totalReceivables: 125000,
    paidThisMonth: 45000,
    collectionRate: 72.5,
    overduePayments: 28000,
    averageDaysOverdue: 15,
    totalContracts: 156,
    totalPatients: 89,
    overdueContracts: 23,
  },
  recentPayments: [
    { id: 1, patient: "Maria Silva", amount: 1200, date: "2024-01-15T10:30:00Z" },
    { id: 2, patient: "João Santos", amount: 800, date: "2024-01-14T14:20:00Z" },
    { id: 3, patient: "Ana Costa", amount: 1500, date: "2024-01-13T09:15:00Z" },
  ],
  pendingPayments: [
    { id: 1, patient: "Carlos Lima", amount: 950, date: "2 dias" },
    { id: 2, patient: "Lucia Ferreira", amount: 1100, date: "5 dias" },
  ],
  notification: {
    byStep: { "0": 12, "1": 8, "2": 5, "3": 3, "4": 1 },
    pendingSchedules: 7,
    pendingCalls: 4,
  },
  collection: {
    preOverduePatients: 25,
    overduePatients: 34,
    withPipeboard: 28,
    withoutPipeboard: 6,
  },
  monthlyReceivables: [
    { month: "Jan", receivable: 120000, paid: 85000 },
    { month: "Fev", receivable: 135000, paid: 92000 },
    { month: "Mar", receivable: 125000, paid: 88000 },
    { month: "Abr", receivable: 140000, paid: 95000 },
  ],
  lastNotifications: [
    { id: 1, patient: "Pedro Oliveira", channel: "whatsapp", sent_at: "2024-01-15T08:00:00Z", success: true },
    { id: 2, patient: "Sofia Mendes", channel: "email", sent_at: "2024-01-14T16:30:00Z", success: false },
  ],
}

const useCurrentUser = () => ({
  data: {
    name: "Dr. João Silva",
    email: "joao@clinica.com",
    clinics: [{ id: "1", name: "Clínica Central" }],
  },
})

const useFetchDashboardSummary = () => ({
  data: mockDashboard,
  isLoading: false,
  isError: false,
  error: null,
  refetch: () => {},
})

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

const formatDateTime = (date: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))

function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-3">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

type QuickActionCardProps = {
  title: string
  description: string
  icon: React.ElementType
  onClick: () => void
  variant?: "default" | "urgent" | "success"
  badge?: string
}

const QuickActionCard: FC<QuickActionCardProps> = ({
  title,
  description,
  icon: Icon,
  onClick,
  variant = "default",
  badge,
}) => {
  const variants = {
    default: "hover:border-primary/50 hover:bg-primary/5",
    urgent: "border-amber-200 bg-amber-50/50 hover:bg-amber-100/50 dark:border-amber-800 dark:bg-amber-950/20",
    success:
      "border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/50 dark:border-emerald-800 dark:bg-emerald-950/20",
  }

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${variants[variant]}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{title}</CardTitle>
              {badge && (
                <Badge variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              )}
            </div>
            <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
          </div>
          <div className="p-2 rounded-lg bg-primary/10 ml-4">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

type ActivityItemProps = {
  type: "payment" | "alert" | "system"
  message: ReactNode
  time: string
  priority?: "low" | "normal" | "high"
}

const ActivityItem: FC<ActivityItemProps> = ({ type, message, time, priority = "normal" }) => {
  const iconMap = {
    payment: <CheckCircle className="h-4 w-4 text-emerald-500" />,
    alert: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    system: <Zap className="h-4 w-4 text-blue-500" />,
  }

  const priorityStyles = {
    low: "text-muted-foreground",
    normal: "text-foreground",
    high: "text-destructive font-medium",
  }

  return (
    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
      <div className="mt-0.5 p-1 rounded-full bg-muted/50">{iconMap[type]}</div>
      <div className="flex-1 space-y-1">
        <p className={`text-sm leading-relaxed ${priorityStyles[priority]}`}>{message}</p>
        <p className="text-xs text-muted-foreground">{formatDateTime(time)}</p>
      </div>
    </div>
  )
}

function FunnelRow({
  label,
  value,
  pct,
  danger,
}: {
  label: string
  value: number
  pct: number
  danger?: boolean
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${danger ? "text-destructive" : ""}`}>{value}</span>
          <span className="text-muted-foreground">({pct.toFixed(1)}%)</span>
        </div>
      </div>
      <Progress
        value={pct}
        className={`h-2 ${danger ? "bg-destructive/20" : ""}`}
        style={
          {
            "--progress-background": danger ? "hsl(var(--destructive))" : undefined,
          } as React.CSSProperties
        }
      />
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { data: currentUser } = useCurrentUser()
  const { data: dashboard, isLoading, isError, error, refetch } = useFetchDashboardSummary()

  if (isLoading || !currentUser) return <DashboardLoadingSkeleton />

  if (isError || !dashboard) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Erro ao carregar o painel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Não foi possível buscar os dados. Por favor, tente novamente.
          </p>
          <Button variant="destructive" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    )
  }

  const { stats, recentPayments, pendingPayments, notification, collection, monthlyReceivables, lastNotifications } =
    dashboard

  const kpis = [
    {
      title: "Total de Recebíveis",
      value: formatCurrency(stats.totalReceivables),
      change: "+12% vs mês anterior",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "Valor total a receber de todos os contratos",
    },
    {
      title: "Recebido este Mês",
      value: formatCurrency(stats.paidThisMonth),
      change: "+18% vs mês anterior",
      changeType: "positive" as const,
      icon: CreditCard,
      description: "Pagamentos confirmados no mês atual",
    },
    {
      title: "Taxa de Cobrança",
      value: `${stats.collectionRate.toFixed(1)}%`,
      change: stats.collectionRate > 60 ? "Acima da meta" : "Abaixo da meta",
      changeType: stats.collectionRate > 60 ? ("positive" as const) : ("negative" as const),
      icon: Target,
      description: "Eficiência do processo de cobrança",
    },
    {
      title: "Pagamentos em Atraso",
      value: formatCurrency(stats.overduePayments),
      change: `${Math.round((stats.overdueContracts / (stats.totalContracts || 1)) * 100)}% dos contratos`,
      changeType: "negative" as const,
      icon: AlertTriangle,
      description: "Valores vencidos e não pagos",
    },
    {
      title: "Dias Médios em Atraso",
      value: `${stats.averageDaysOverdue.toFixed(0)} dias`,
      icon: Clock,
      description: "Tempo médio de atraso nos pagamentos",
    },
    {
      title: "Pacientes no Fluxo",
      value: Object.values(notification?.byStep ?? {})
        .reduce((a, b) => a + b, 0)
        .toString(),
      icon: Users,
      description: "Pacientes ativos no processo de cobrança",
    },
    {
      title: "Notificações Pendentes",
      value: (notification?.pendingSchedules ?? 0).toString(),
      icon: Bell,
      changeType: "neutral" as const,
      description: "Notificações agendadas para envio",
    },
    {
      title: "Contratos Ativos",
      value: stats.totalContracts.toString(),
      icon: FileText,
      description: "Total de contratos em vigência",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Painel Geral</h1>
          <p className="text-lg text-muted-foreground">Olá, {currentUser?.name}! Aqui está o resumo da sua operação.</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full lg:w-auto items-stretch sm:items-center gap-3">
          <Select defaultValue="30">
            <SelectTrigger className="w-full sm:w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MetricCard {...kpi} />
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Recebíveis vs Pagamentos (Últimos 12 meses)
          </CardTitle>
          <CardDescription>Comparativo entre valores a receber e pagamentos efetivados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            {monthlyReceivables?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyReceivables} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="paid" name="Pagamentos Recebidos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="receivable" name="Total a Receber" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Sem dados históricos suficientes</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Funil de Cobrança
            </CardTitle>
            <CardDescription>Distribuição dos pacientes por estágio do processo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {collection && (
              <>
                <FunnelRow label="Total de pacientes" value={stats.totalPatients} pct={100} />
                <FunnelRow
                  label="Pré-vencidos"
                  value={collection.preOverduePatients}
                  pct={(collection.preOverduePatients / (stats.totalPatients || 1)) * 100}
                />
                <FunnelRow
                  label="Vencidos"
                  value={collection.overduePatients}
                  pct={(collection.overduePatients / (stats.totalPatients || 1)) * 100}
                />
                <FunnelRow
                  label="Em cobrança ativa"
                  value={collection.withPipeboard}
                  pct={(collection.withPipeboard / (collection.overduePatients || 1)) * 100}
                />
                <FunnelRow
                  label="Sem cobrança"
                  value={collection.withoutPipeboard}
                  pct={(collection.withoutPipeboard / (collection.overduePatients || 1)) * 100}
                  danger
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Distribuição por Etapa do Fluxo
            </CardTitle>
            <CardDescription>Pacientes em cada etapa do processo de cobrança</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-3">
              {Object.entries(notification?.byStep ?? {}).map(([step, count]) => (
                <div key={step} className="text-center space-y-2">
                  <div className="relative">
                    <div
                      className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto"
                      style={{
                        backgroundColor: `hsl(var(--primary) / ${Math.max(0.1, count / 20)})`,
                      }}
                    >
                      <span className="text-sm font-bold text-primary">{step}</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    >
                      {count}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Etapa {step}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions and Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Ações Rápidas</h3>
          <QuickActionCard
            title="Chamadas Pendentes"
            description={`${notification?.pendingCalls ?? 0} chamadas aguardando retorno`}
            icon={PhoneCall}
            onClick={() => router.push("/chamadas")}
            variant={notification?.pendingCalls ? "urgent" : "default"}
            badge={notification?.pendingCalls ? `${notification.pendingCalls}` : undefined}
          />
          <QuickActionCard
            title="Disparar Fluxo Agora"
            description="Iniciar processo de cobrança para novos vencimentos"
            icon={Zap}
            onClick={() => router.push("/fluxo/forcar")}
            variant="success"
          />
          <QuickActionCard
            title="Configurações da Clínica"
            description="Ajustar parâmetros de cobrança e notificações"
            icon={Settings}
            onClick={() => router.push("/configuracoes")}
          />
        </div>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Atividade Recente
            </CardTitle>
            <CardDescription>Acompanhe os últimos eventos do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="payments" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="payments">Pagamentos</TabsTrigger>
                <TabsTrigger value="pending">Próximos Venc.</TabsTrigger>
                <TabsTrigger value="notifs">Notificações</TabsTrigger>
              </TabsList>

              <TabsContent value="payments" className="mt-6">
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {recentPayments?.length ? (
                    recentPayments.map((p) => (
                      <ActivityItem
                        key={p.id}
                        type="payment"
                        message={
                          <>
                            Pagamento de <strong>{formatCurrency(p.amount)}</strong> recebido de{" "}
                            <span className="font-semibold text-primary">{p.patient}</span>
                          </>
                        }
                        time={p.date}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <CheckCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">Nenhum pagamento recente encontrado</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="pending" className="mt-6">
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {pendingPayments?.length ? (
                    pendingPayments.map((p) => (
                      <ActivityItem
                        key={p.id}
                        type="alert"
                        priority="normal"
                        message={
                          <>
                            Vencimento de <strong>{formatCurrency(p.amount)}</strong> para{" "}
                            <span className="font-semibold text-primary">{p.patient}</span>
                          </>
                        }
                        time={`Vence em ${p.date}`}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">Nenhum vencimento próximo</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="notifs" className="mt-6">
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {lastNotifications?.length ? (
                    lastNotifications.map((n) => (
                      <ActivityItem
                        key={n.id}
                        type="system"
                        message={
                          <>
                            Notificação <strong>{n.channel.toUpperCase()}</strong> para{" "}
                            <span className="font-semibold text-primary">{n.patient}</span>
                            {!n.success && (
                              <Badge variant="destructive" className="ml-2 text-xs">
                                Falhou
                              </Badge>
                            )}
                          </>
                        }
                        time={n.sent_at}
                        priority={n.success ? "low" : "high"}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">Nenhuma notificação recente</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
