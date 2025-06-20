"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useState, type FC, type ReactNode } from "react"
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
  Loader2,
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

import { useCurrentUser } from "@/src/common/hooks/useUser"
import { useFetchDashboardSummary } from "@/src/common/hooks/useDashboard"
import DashboardLoadingSkeleton from "./loading"
import { formatCurrency } from "@/src/common/utils/formatters"
import { FunnelRow } from "@/src/common/components/dashboard/FunnelRow"
import { QuickActionCard } from "@/src/common/components/dashboard/QuickActionCard"
import { ActivityItem } from "@/src/common/components/dashboard/ActivityItem"
import { subDays } from "date-fns"
import { dashboardService } from "@/src/common/services/dashboard.service"

export default function DashboardPage() {
  const [slicePeriod, setSlicePeriod] = useState<number | undefined>(undefined) // Padrão em: Todo Período
  const [isExporting, setIsExporting] = useState(false) 
  const router = useRouter()
  const { data: currentUser } = useCurrentUser()
  const { data: dashboard, isLoading, isError, error, refetch, isFetching } =
    useFetchDashboardSummary(currentUser?.clinics?.[0]?.id, slicePeriod)

  if (isLoading || !currentUser) return <DashboardLoadingSkeleton />

  const handleExport = async () => {
    setIsExporting(true)                                        // 3) começo do loading
    try {
      const endDate = new Date().toISOString().split("T")[0]
      const params: Record<string, string> = { end_date: endDate }

      if (slicePeriod) {
        const start = subDays(new Date(), slicePeriod)
        params.start_date = start.toISOString().split("T")[0]
      }

      const response = await dashboardService.getReport(params)
      const blob = new Blob([response.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `relatorio_dashboard_${endDate}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Erro ao exportar relatório:", err)
    } finally {
      setIsExporting(false)                                     // 3) fim do loading
    }
  }

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
      value: stats.totalReceivables,
      icon: DollarSign,
      description: "Valor total a receber de todos os contratos",
    },
    {
      title: "Recebido este Mês",
      value: stats.paidThisMonth,
      icon: CreditCard,
      description: "Pagamentos confirmados no mês atual",
    },
    {
      title: "Taxa de Cobrança",
      value: `${stats.collectionRate.toFixed(1)}%`,
      icon: Target,
      description: "Eficiência do processo de cobrança",
    },
    {
      title: "Pagamentos em Atraso",
      value: stats.overduePayments,
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
          <Select
            value={slicePeriod === undefined ? 'all' : String(slicePeriod)}
            onValueChange={(v) =>
              setSlicePeriod(v === 'all' ? undefined : Number(v))
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todo o período</SelectItem>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isFetching || isExporting}
          >
            {isExporting
              ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              : <Download className="h-4 w-4 mr-2" />
            }
            {isExporting ? 'Exportando…' : 'Exportar Relatório'}
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
                  <YAxis
                    tickFormatter={(value) => formatCurrency(value)}
                    domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.1)]}
                    padding={{ top: 0 }}
                    tickCount={8}
                    width={120}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(String(value))}
                    contentStyle={{
                      backgroundColor: "hsl(240 10% 3.9%)",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    iconSize={14}
                    wrapperStyle={{
                      top: '105%',
                      right: 0,
                      transform: 'translate(0, -105%)',
                      fontWeight: 400,
                      color: '#fff'
                    }}
                  />
                  <Bar
                    dataKey="paid"
                    className="paid"
                    name="Pagamentos Recebidos"
                    radius={[4, 4, 0, 0]}
                    fill="hsl(142.1 70.2% 45.3%)"
                  />
                  <Bar
                    dataKey="receivable"
                    className="receiv"
                    name="Total a Receber"
                    fill="hsl(0 62.8% 30.6%)"
                    radius={[4, 4, 0, 0]}
                  />
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
            {collection && stats && (
              <>
                {/* Total de Pacientes */}
                <FunnelRow
                  label="Total de pacientes"
                  value={stats.totalPatients}
                  pct={100}
                />

                {/* Pacientes com parcelas a vencer (e sem vencidas) */}
                <FunnelRow
                  label="Pré-vencidos"
                  value={collection.preOverduePatients}
                  pct={(collection.preOverduePatients / (stats.totalPatients || 1)) * 100}
                />

                {/* Total de Pacientes com parcelas vencidas */}
                <FunnelRow
                  label="Vencidos"
                  value={collection.overduePatients}
                  pct={(collection.overduePatients / (stats.totalPatients || 1)) * 100}
                />

                {/* Detalhe: Subcategoria dos Vencidos que estão em cobrança */}
                <FunnelRow
                  label="└ Em cobrança ativa"
                  value={collection.overdueMinDaysPlus}
                  pct={(collection.overdueMinDaysPlus / (collection.overduePatients || 1)) * 100}
                />

                {/* Detalhe: Subcategoria dos Vencidos que NÃO estão em cobrança */}
                <FunnelRow
                  label="└ Apenas vencidos"
                  value={collection.overduePatients - collection.overdueMinDaysPlus}
                  pct={((collection.overduePatients - collection.overdueMinDaysPlus) / (collection.overduePatients || 1)) * 100}
                  danger
                />

                {/* Pacientes que não têm nenhuma pendência */}
                <FunnelRow
                  label="Em dia"
                  value={collection.noBilling}
                  pct={(collection.noBilling / (stats.totalPatients || 1)) * 100}
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
            onClick={() => router.push("/clinica/ligacoes")}
            variant={notification?.pendingCalls ? "urgent" : "default"}
            badge={notification?.pendingCalls ? `${notification.pendingCalls}` : undefined}
          />
          <QuickActionCard
            title="Meus Pacientes"
            description="Ver lista de pacientes"
            icon={Users}
            onClick={() => router.push("/clinica/pacientes")}
          />
          <QuickActionCard
            title="Configurações da Clínica"
            description="Ajustar parâmetros de cobrança e notificações"
            icon={Settings}
            onClick={() => router.push("/clinica/configuracoes")}
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
                            Pagamento de <strong>{p.amount}</strong> recebido de{" "}
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
                            Vencimento de <strong>{p.amount}</strong> para{" "}
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
