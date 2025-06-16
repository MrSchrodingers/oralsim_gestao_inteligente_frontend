"use client";

import { useRouter } from "next/navigation";
import {
  Users, FileText, Settings, CreditCard, TrendingUp, AlertCircle, RefreshCw,
  Phone, MessageSquare, Clock, DollarSign, Target, Activity, Bell, ChevronRight,
  BarChart3, Zap, CheckCircle, AlertTriangle, TrendingDown, Download, Eye,
  PhoneCall, PieChart
} from "lucide-react";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/src/common/components/ui/card";
import { Progress } from "@/src/common/components/ui/progress";
import { Badge } from "@/src/common/components/ui/badge";
import { Button } from "@/src/common/components/ui/button";
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/src/common/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/src/common/components/ui/select";
import { Skeleton } from "@/src/common/components/ui/skeleton";
import { PageTransition } from "@/src/common/components/motion/page-transition";
import { AnimatedCard }
  from "@/src/common/components/motion/animated-card";
import {
  StaggeredList, StaggeredItem
} from "@/src/common/components/motion/staggered-list";
import { useCurrentUser } from "@/src/common/hooks/useUser";
import { useClinicStore } from "@/src/common/stores/useClinicStore";
import { useFetchDashboardSummary }
  from "@/src/common/hooks/useDashboard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
         ResponsiveContainer, Bar, BarChart, Legend } from "recharts";

/* ---------- Skeleton ---------- */
function DashboardLoadingSkeleton() { /* ...idem... */ }

/* ---------- Helper components (MetricCard, QuickActionCard, ActivityItem) ---------- */
/* ...idem (apenas removi para reduzir) ... */

/* ---------- New helper: KPI grid builder ---------- */
const kpis = (summary: IDashboardSummary) => {
  const { stats, notification } = summary;
  const patientsInFlow = Object.values(notification?.byStep ?? {}).reduce(
    (a, b) => a + b, 0);

  return [
    {
      title: "Total de Recebíveis",
      value: stats.totalReceivables,
      change: "+12% vs mês anterior",
      changeType: "positive",
      icon: DollarSign
    },
    {
      title: "Recebido este Mês",
      value: stats.paidThisMonth,
      change: "+18% vs mês anterior",
      changeType: "positive",
      icon: CreditCard
    },
    {
      title: "Taxa de Cobrança",
      value: `${stats.collectionRate}%`,
      change: stats.collectionRate > 60 ? "Acima da meta" : "Abaixo da meta",
      changeType: stats.collectionRate > 60 ? "positive" : "negative",
      icon: Target
    },
    {
      title: "Pagamentos em Atraso",
      value: stats.overduePayments,
      change: `${Math.round(
        (stats.overdueContracts / stats.totalContracts) * 100
      )}% dos contratos`,
      changeType: "negative",
      icon: AlertTriangle
    },
    {
      title: "Dias Médios em Atraso",
      value: stats.averageDaysOverdue.toFixed(0),
      icon: Clock
    },
    {
      title: "Pacientes no Fluxo",
      value: patientsInFlow.toString(),
      icon: Users
    },
    {
      title: "Notificações Pendentes",
      value: (notification?.pendingSchedules ?? 0).toString(),
      icon: Bell,
      changeType: "neutral"
    },
    {
      title: "Contratos Ativos",
      value: stats.totalContracts.toString(),
      icon: FileText
    }
  ];
};

/* ---------- Main Page ---------- */
export default function DashboardPage() {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const { selectedClinicId, setSelectedClinicId } = useClinicStore();

  const clinicIdForQuery =
    selectedClinicId || currentUser?.clinics?.[0]?.id;

  const { data: dashboard, isLoading, isError, error, refetch } =
    useFetchDashboardSummary(clinicIdForQuery);

  if (isLoading) return <DashboardLoadingSkeleton />;

  if (isError || !dashboard) {
    return (
      <PageTransition>
        <div className="p-6">
          <AnimatedCard className="border-destructive/50 bg-destructive/10 text-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" /> Erro ao carregar o
                dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Não foi possível buscar os dados. Por favor, tente novamente.
              </p>
              <p className="text-xs mt-2">
                Detalhe: {(error as any)?.message}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" onClick={() => refetch()}>
                Tentar Novamente
              </Button>
            </CardFooter>
          </AnimatedCard>
        </div>
      </PageTransition>
    );
  }

  /* ---------- build derived values ---------- */
  const { stats, recentPayments, pendingPayments, notification, collection } =
    dashboard;
  const chartData = dashboard.monthlyReceivables ?? []; // opcional

  return (
    <PageTransition>
      <div className="p-1 md:p-6 space-y-8">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Visão Geral
            </h1>
            <p className="text-muted-foreground mt-1">
              Olá, {currentUser?.name}! Aqui está o resumo da sua operação.
            </p>
          </div>
          <div className="flex w-full lg:w-auto items-center gap-3">
            {currentUser && currentUser.clinics.length > 1 && (
              <Select
                onValueChange={setSelectedClinicId}
                defaultValue={clinicIdForQuery}
              >
                <SelectTrigger className="w-full lg:w-[280px]">
                  <SelectValue placeholder="Selecione uma clínica" />
                </SelectTrigger>
                <SelectContent>
                  {currentUser.clinics.map((clinic) => (
                    <SelectItem key={clinic.id} value={clinic.id}>
                      {clinic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Exportar Relatório
            </Button>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {kpis(dashboard).map((kpi) => (
            <MetricCard key={kpi.title} {...kpi} />
          ))}
        </div>

        {/* RECEBÍVEIS CHART */}
        <AnimatedCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" /> Recebíveis x Pagamentos (12 meses)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {chartData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="paid" name="Pagos" />
                  <Line type="monotone" dataKey="receivable" name="Recebíveis Acumul." />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground">Sem histórico suficiente.</p>
            )}
          </CardContent>
        </AnimatedCard>

        {/* FUNIL & HEAT-MAP */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Funil */}
          <AnimatedCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" /> Funil de Cobrança
              </CardTitle>
              <CardDescription>
                Distribuição dos pacientes por estágio.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {collection && (
                <>
                  <FunnelRow
                    label="Total pacientes"
                    value={stats.totalPatients}
                    pct={100}
                  />
                  <FunnelRow
                    label="Pré-vencidos"
                    value={collection.preOverduePatients}
                    pct={(collection.preOverduePatients / stats.totalPatients) * 100}
                  />
                  <FunnelRow
                    label="Vencidos"
                    value={collection.overduePatients}
                    pct={(collection.overduePatients / stats.totalPatients) * 100}
                  />
                  <FunnelRow
                    label="Em cobrança (Pipeboard)"
                    value={collection.withPipeboard}
                    pct={
                      (collection.withPipeboard / collection.overduePatients) *
                      100
                    }
                  />
                  <FunnelRow
                    label="Sem cobrança"
                    value={collection.withoutPipeboard}
                    pct={
                      (collection.withoutPipeboard / collection.overduePatients) *
                      100
                    }
                    danger
                  />
                </>
              )}
            </CardContent>
          </AnimatedCard>

          {/* Heat-map canais × steps */}
          <AnimatedCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" /> Fluxo por Canal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <HeatMapByStep data={notification?.byStep ?? {}} />
            </CardContent>
          </AnimatedCard>
        </div>

        {/* QUICK ACTIONS & ATIVIDADE */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="space-y-6">
            <QuickActionCard
              title="Chamadas Pendentes"
              description={`${notification?.pendingCalls ?? 0} chamadas aguardando ação`}
              icon={PhoneCall}
              onClick={() => router.push("/chamadas")}
              variant={notification?.pendingCalls ? "urgent" : "default"}
            />
            <QuickActionCard
              title="Disparar Fluxo Agora"
              description="Força o passo 0 para todos os atletas"
              icon={Zap}
              onClick={() => router.push("/fluxo/forcar")}
              variant="success"
            />
            <QuickActionCard
              title="Configurações da Clínica"
              description="Ajustar parâmetros de cobrança e fluxo"
              icon={Settings}
              onClick={() => router.push("/configuracoes")}
            />
          </div>

          {/* Atividade Recente */}
          <AnimatedCard className="xl:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" /> Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="payments">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="payments">Pagamentos</TabsTrigger>
                  <TabsTrigger value="pending">Próximos Venc.</TabsTrigger>
                  <TabsTrigger value="notifs">Notificações</TabsTrigger>
                </TabsList>

                {/* Pagamentos */}
                <TabsContent
                  value="payments"
                  className="space-y-2 mt-4 max-h-80 overflow-y-auto"
                >
                  {recentPayments?.length ? (
                    recentPayments.map((p) => (
                      <ActivityItem
                        key={p.id}
                        type="payment"
                        message={
                          <>
                            Pagamento de <b>{p.amount}</b> recebido de{" "}
                            <span className="font-semibold">{p.patient}</span>
                          </>
                        }
                        time={p.date}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Sem pagamentos recentes.
                    </p>
                  )}
                </TabsContent>

                {/* Pendências */}
                <TabsContent
                  value="pending"
                  className="space-y-2 mt-4 max-h-80 overflow-y-auto"
                >
                  {pendingPayments?.length ? (
                    pendingPayments.map((p) => (
                      <ActivityItem
                        key={p.id}
                        type="alert"
                        priority="normal"
                        message={
                          <>
                            Vencimento de <b>{p.amount}</b> para{" "}
                            <span className="font-semibold">{p.patient}</span>
                          </>
                        }
                        time={`Vence em ${p.date}`}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Sem pagamentos pendentes.
                    </p>
                  )}
                </TabsContent>

                {/* Histórico de notificações */}
                <TabsContent
                  value="notifs"
                  className="space-y-2 mt-4 max-h-80 overflow-y-auto"
                >
                  {/* Supondo que você traga as últimas 50 notificações */}
                  {dashboard.lastNotifications?.length ? (
                    dashboard.lastNotifications.map((n) => (
                      <ActivityItem
                        key={n.id}
                        type="system"
                        message={
                          <>
                            Notificação <b>{n.channel.toUpperCase()}</b> para{" "}
                            <span className="font-semibold">
                              {n.patient}
                            </span>
                          </>
                        }
                        time={n.sent_at}
                        priority={n.success ? "low" : "high"}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Nenhuma notificação recente.
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </AnimatedCard>
        </div>
      </div>
    </PageTransition>
  );
}

/* ---------- Aux components (FunnelRow, HeatMapByStep) ---------- */
function FunnelRow({
  label,
  value,
  pct,
  danger
}: {
  label: string;
  value: number;
  pct: number;
  danger?: boolean;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className={danger ? "text-destructive font-semibold" : "font-semibold"}>
          {value} ({pct.toFixed(1)}%)
        </span>
      </div>
      <Progress
        value={pct}
        className={danger ? "bg-destructive/20" : ""}
      />
    </div>
  );
}

/* mini-grid heat-map (simplificado) */
function HeatMapByStep({ data }: { data: Record<string, number> }) {
  const steps = Object.keys(data).sort((a, b) => Number(a) - Number(b));
  if (!steps.length)
    return (
      <p className="text-center text-muted-foreground py-8">
        Sem pacientes no funil.
      </p>
    );

  return (
    <div className="grid grid-cols-5 gap-2">
      {steps.map((s) => {
        const count = data[s];
        const intensity =
          count > 30
            ? "bg-primary"
            : count > 10
            ? "bg-primary/70"
            : "bg-primary/40";
        return (
          <div
            key={s}
            className={`relative rounded-md p-4 aspect-square ${intensity}`}
          >
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
              {s}
            </span>
            <span className="absolute bottom-1 right-1 text-xs text-white">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
