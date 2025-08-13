"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useState, useRef } from "react"
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
  CheckCircle,
  AlertTriangle,
  Download,
  PhoneCall,
  PieChart,
  TrendingUp,
  Calendar,
  Loader2,
  Banknote,
  ShieldCheck,
  Inbox,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/common/components/ui/card"
import { Button } from "@/src/common/components/ui/button"
import { Badge } from "@/src/common/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/common/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/common/components/ui/select"
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
import { getChannel } from "@/src/common/components/helpers/GetBadge"
import type { IDashboardSummary, INotificationActivity, IPaymentSummary } from "@/src/common/interfaces/IDashboardSummary"

export default function DashboardPage() {
  // ── Hooks SEM retorno condicional no meio
  const [slicePeriod, setSlicePeriod] = useState<number | undefined>(undefined)
  const [isExporting, setIsExporting] = useState(false)
  const router = useRouter()
  const exportRef = useRef<HTMLDivElement>(null)

  const { data: currentUser } = useCurrentUser()
  const { data: dashboard, isLoading, isError, refetch, isFetching } =
    useFetchDashboardSummary(currentUser?.clinics?.[0]?.id, slicePeriod)

  // Fallbacks estáveis para evitar crash enquanto carrega
  const d: IDashboardSummary = dashboard ?? ({} as IDashboardSummary)

  const stats = d.stats ?? {
    totalReceivables: "0",
    paidThisMonth: "0",
    collectionRate: 0,
    overduePayments: "0",
    averageDaysOverdue: 0,
    totalContracts: 0,
    totalPatients: 0,
  }

  // Novos shapes com fallback para "collection" legado
  const amicable = d.amicable ?? {
    totalCases: d.collection?.totalCases ?? 0,
    withPipeboard: d.collection?.withPipeboard ?? 0,
    withoutPipeboard: d.collection?.withoutPipeboard ?? 0,
    overdueMinDaysPlus: d.collection?.overdueMinDaysPlus ?? 0,
    overdueInAmicable: d.collection?.overdueInAmicable ?? 0,
    receivablesWithDebt: d.collection?.receivablesWithDebt ?? 0,
    recoveredCA: d.collection?.recoveredCA ?? 0,
    recoveredCAAmount: d.collection?.recoveredCAAmount ?? 0,
  }

  const receivables = d.receivables ?? {
    receivablesTotalCount: d.collection?.receivablesTotalCount ?? 0,
    overduePatients: d.collection?.overduePatients ?? 0,
    preOverduePatients: d.collection?.preOverduePatients ?? 0,
    noBilling: d.collection?.noBilling ?? 0,
    recoveredGR: d.collection?.recoveredGR ?? 0,
    recoveredGRAmount: d.collection?.recoveredGRAmount ?? 0,
  }

  const recentPayments = d.recentPayments ?? []
  const pendingPayments = d.pendingPayments ?? []
  const notification = d.notification ?? { byStep: {}, pendingSchedules: 0, sentNotifications: 0, pendingCalls: 0 }
  const monthlyReceivables = d.monthlyReceivables ?? []
  const lastNotifications = d.lastNotifications ?? []

  const notifsInFlow = Object.values(notification?.byStep ?? {}).reduce((a, b) => a + (b as number), 0)

  const kpis = [
    { title: "Total de Recebíveis", value: stats.totalReceivables, icon: DollarSign, description: "Valor total a receber de todos os contratos" },
    { title: "Recebido este Mês", value: stats.paidThisMonth, icon: CreditCard, description: "Pagamentos confirmados no mês atual" },
    { title: "Taxa de Cobrança", value: `${Number(stats.collectionRate ?? 0).toFixed(1)}%`, icon: Target, description: "Eficiência do processo de cobrança" },
    { title: "Pagamentos em Atraso", value: stats.overduePayments, icon: AlertTriangle, description: "Valores vencidos e não pagos" },
    { title: "Dias Médios em Atraso", value: `${Number(stats.averageDaysOverdue ?? 0).toFixed(0)} dias`, icon: Clock, description: "Tempo médio de atraso nos pagamentos" },
    { title: "Gestão de Recebíveis (ativos)", value: notifsInFlow.toString(), icon: Bell, description: "Pacientes ativos no processo de notificações" },
    { title: "Cobrança Amigável (casos)", value: Number(amicable?.totalCases ?? 0).toString(), icon: Banknote, description: "Casos ativos no processo de cobrança amigável" },
    { title: "Contratos Ativos", value: Number(stats.totalContracts ?? 0).toString(), icon: FileText, description: "Total de contratos em vigência" },
  ]

  const smartKPIs = [
    { title: "Parcelas a Receber", value: Number(receivables?.receivablesTotalCount ?? 0).toLocaleString("pt-BR"), icon: Inbox, description: "Quantidade total de parcelas pendentes + vencidas" },
    { title: "Ativos Debt", value: Number(amicable?.receivablesWithDebt ?? 0).toLocaleString("pt-BR"), icon: ShieldCheck, description: "Parcelas com CollectionCase aberto" },
    { title: "Vencidos em Cobrança Amigável", value: Number(amicable?.overdueInAmicable ?? 0).toLocaleString("pt-BR"), icon: AlertTriangle, description: "Parcelas vencidas nos contratos em Cobrança Amigável" },
    { title: "Recuperados Cobrança Amigável", value: Number(amicable?.recoveredCA ?? 0).toLocaleString("pt-BR"), icon: Banknote, description: `Soma: ${formatCurrency(amicable?.recoveredCAAmount ?? 0)}` },
    { title: "Recuperados Gestão de Recebíveis", value: Number(receivables?.recoveredGR ?? 0).toLocaleString("pt-BR"), icon: TrendingUp, description: `Soma: ${formatCurrency(receivables?.recoveredGRAmount ?? 0)}` },
  ]

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const local: Record<string,string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)!; local[k] = localStorage.getItem(k)!;
      }
      const session: Record<string,string> = {};
      for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i)!; session[k] = sessionStorage.getItem(k)!;
      }
  
      const res = await fetch("/api/export/pdf", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include", // garante cookies no req
        body: JSON.stringify({
          url: window.location.href,
          storage: { local, session },
          width: Math.max(document.documentElement.clientWidth, window.innerWidth || 1440),
          dpr: Math.min(3, window.devicePixelRatio || 2),
        }),
      });
      if (!res.ok) throw new Error(`Falha no export: ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement("a"), {
        href: url,
        download: `dashboard_${new Date().toISOString().slice(0,10)}.pdf`,
      });
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };
  
  
  
  
  


  // Agora os returns condicionais acontecem **depois** de todos os hooks
  if (isLoading || !currentUser) return <DashboardLoadingSkeleton />

  if (isError) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Erro ao carregar o painel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">Não foi possível buscar os dados. Por favor, tente novamente.</p>
          <Button variant="destructive" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div id="export-root" className="space-y-8" ref={exportRef}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Painel Geral</h1>
          <p className="text-lg text-muted-foreground">Olá, {currentUser?.name}! Aqui está o resumo da sua operação.</p>
        </div>

        <div className="flex flex-col sm:flex-row w-full lg:w-auto items-stretch sm:items-center gap-3">
          <Select
            value={slicePeriod === undefined ? "all" : String(slicePeriod)}
            onValueChange={(v) => setSlicePeriod(v === "all" ? undefined : Number(v))}
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
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
            Atualizar
          </Button>

          <Button variant="outline" onClick={handleExport} disabled={isFetching || isExporting}>
            {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            {isExporting ? "Exportando…" : "Exportar Relatório"}
          </Button>
        </div>
      </div>

      {/* KPI Grid principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <MetricCard {...kpi} />
          </motion.div>
        ))}
      </div>

      {/* KPIs Inteligentes (novos campos) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Indicadores de Inteligência de Cobrança
          </CardTitle>
          <CardDescription>Métricas detalhadas de CA e GR</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {smartKPIs.map((kpi, idx) => (
                <motion.div
                  key={kpi.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <MetricCard {...kpi} />
                </motion.div>
              ))}
            </div>
        </CardContent>
      </Card>

      {/* Chart: últimos 12 meses */}
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
                      top: "105%",
                      right: 0,
                      transform: "translate(0, -105%)",
                      fontWeight: 400,
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="paid" name="Pagamentos Recebidos" radius={[4, 4, 0, 0]} fill="hsl(142.1 70.2% 45.3%)" />
                  <Bar dataKey="receivable" name="Total a Receber" fill="hsl(0 62.8% 30.6%)" radius={[4, 4, 0, 0]} />
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

      {/* Analytics: Funil e Etapas */}
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
            <>
              <FunnelRow label="Total de pacientes" value={stats.totalPatients} pct={100} />

              <FunnelRow
                label="Pré-vencidos"
                value={receivables?.preOverduePatients ?? 0}
                pct={((receivables?.preOverduePatients ?? 0) / (stats.totalPatients || 1)) * 100}
              />

              <FunnelRow
                label="Vencidos"
                value={receivables?.overduePatients ?? 0}
                pct={((receivables?.overduePatients ?? 0) / (stats.totalPatients || 1)) * 100}
              />

              <FunnelRow
                label="└ Em cobrança ativa (CA)"
                value={amicable?.overdueMinDaysPlus ?? 0}
                pct={((amicable?.overdueMinDaysPlus ?? 0) / ((receivables?.overduePatients ?? 1))) * 100}
              />

              <FunnelRow
                label="└ Apenas vencidos"
                value={(receivables?.overduePatients ?? 0) - (amicable?.overdueMinDaysPlus ?? 0)}
                pct={
                  (((receivables?.overduePatients ?? 0) - (amicable?.overdueMinDaysPlus ?? 0)) /
                    ((receivables?.overduePatients ?? 1))) *
                  100
                }
                danger
              />

              <FunnelRow
                label="Em dia"
                value={receivables?.noBilling ?? 0}
                pct={((receivables?.noBilling ?? 0) / (stats.totalPatients || 1)) * 100}
              />
            </>
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
                      className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto border"
                      style={{
                        backgroundColor: `rgba(16, 185, 129, ${Math.max(0.12, Number(count) / 20 / 10)})`,
                      }}
                    >
                      <span className="text-sm font-bold text-primary">{step}</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    >
                      {count as number}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Etapa {step}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações e Atividade */}
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
                    recentPayments.map((p: IPaymentSummary) => (
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
                    pendingPayments.map((p: IPaymentSummary) => (
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
                    lastNotifications.map((n: INotificationActivity) => (
                      <ActivityItem
                        key={n.id}
                        type="system"
                        message={
                          <>
                            Notificação de {getChannel(n.channel)} para{" "}
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
