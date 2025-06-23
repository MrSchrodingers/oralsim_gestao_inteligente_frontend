"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Package,
  ArrowLeft,
  Users,
  DollarSign,
  Clock,
  Edit,
  Archive,
  ArchiveRestore,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Copy,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/common/components/ui/card"
import { Button } from "@/src/common/components/ui/button"
import { Badge } from "@/src/common/components/ui/badge"
import { Textarea } from "@/src/common/components/ui/textarea"
import { Label } from "@/src/common/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/common/components/ui/alert-dialog"
import { Skeleton } from "@/src/common/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/common/components/ui/table"
import { useToast } from "@/src/common/components/ui/use-toast"

interface StripePlan {
  id: string
  name: string
  description: string
  amount: number
  currency: string
  interval: "month" | "year"
  interval_count: number
  active: boolean
  created: number
  updated: number
  subscribers_count: number
  revenue_monthly: number
  revenue_total: number
  trial_period_days?: number
  features: string[]
  metadata: Record<string, string>
}

interface PlanSubscriber {
  id: string
  customer_name: string
  customer_email: string
  status: "active" | "canceled" | "past_due" | "trialing"
  current_period_start: number
  current_period_end: number
  created: number
  trial_end?: number
}

interface PlanMetrics {
  subscribers_growth: number
  revenue_growth: number
  churn_rate: number
  conversion_rate: number
  avg_lifetime_value: number
}

// Mock data
const mockPlan: StripePlan = {
  id: "price_1234567890",
  name: "Plano Premium",
  description: "Para clínicas médias com recursos avançados e suporte prioritário",
  amount: 19900,
  currency: "brl",
  interval: "month",
  interval_count: 1,
  active: true,
  created: Date.now() - 86400000 * 60,
  updated: Date.now() - 86400000 * 2,
  subscribers_count: 28,
  revenue_monthly: 557200,
  revenue_total: 3343200,
  trial_period_days: 14,
  features: [
    "Até 500 pacientes",
    "Relatórios avançados",
    "Suporte prioritário",
    "Integrações com terceiros",
    "Backup automático",
    "API completa",
  ],
  metadata: {
    category: "premium",
    target_audience: "medium_clinics",
    max_patients: "500",
  },
}

const mockSubscribers: PlanSubscriber[] = [
  {
    id: "sub_1",
    customer_name: "Clínica São Paulo",
    customer_email: "contato@clinicasp.com.br",
    status: "active",
    current_period_start: Date.now() - 86400000 * 15,
    current_period_end: Date.now() + 86400000 * 15,
    created: Date.now() - 86400000 * 45,
  },
  {
    id: "sub_2",
    customer_name: "Clínica Rio de Janeiro",
    customer_email: "admin@clinicarj.com.br",
    status: "trialing",
    current_period_start: Date.now() - 86400000 * 5,
    current_period_end: Date.now() + 86400000 * 25,
    created: Date.now() - 86400000 * 5,
    trial_end: Date.now() + 86400000 * 9,
  },
  {
    id: "sub_3",
    customer_name: "Clínica Belo Horizonte",
    customer_email: "contato@clinicabh.com.br",
    status: "past_due",
    current_period_start: Date.now() - 86400000 * 35,
    current_period_end: Date.now() - 86400000 * 5,
    created: Date.now() - 86400000 * 120,
  },
]

const mockMetrics: PlanMetrics = {
  subscribers_growth: 12.5,
  revenue_growth: 8.3,
  churn_rate: 3.2,
  conversion_rate: 68.5,
  avg_lifetime_value: 2380.5,
}

export default function PlanDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [notes, setNotes] = useState("")

  useEffect(() => {
    // Simular carregamento
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount / 100)
  }

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp))
  }

  const formatDateOnly = (timestamp: number) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(timestamp))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Ativo
          </Badge>
        )
      case "trialing":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <Clock className="h-3 w-3 mr-1" />
            Teste
          </Badge>
        )
      case "past_due":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Em atraso
          </Badge>
        )
      case "canceled":
        return (
          <Badge variant="secondary">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelado
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado para área de transferência",
      description: text,
    })
  }

  const handleToggleStatus = async () => {
    setIsUpdating(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: mockPlan.active ? "Plano desativado" : "Plano ativado",
        description: `O plano foi ${mockPlan.active ? "desativado" : "ativado"} com sucesso.`,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status do plano.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{mockPlan.name}</h1>
              <p className="text-muted-foreground">{mockPlan.description}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/planos/${params.id}/editar`)}
            disabled={isUpdating}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant={mockPlan.active ? "outline" : "default"}
                className={
                  mockPlan.active ? "text-red-600 border-red-200 hover:bg-red-50" : "bg-green-600 hover:bg-green-700"
                }
                disabled={isUpdating}
              >
                {mockPlan.active ? (
                  <>
                    <Archive className="h-4 w-4 mr-2" />
                    Desativar
                  </>
                ) : (
                  <>
                    <ArchiveRestore className="h-4 w-4 mr-2" />
                    Ativar
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{mockPlan.active ? "Desativar" : "Ativar"} Plano</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja {mockPlan.active ? "desativar" : "ativar"} o plano "{mockPlan.name}"?
                  {mockPlan.active && " Novos assinantes não poderão mais se inscrever neste plano."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleToggleStatus}
                  className={mockPlan.active ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                >
                  {mockPlan.active ? "Desativar" : "Ativar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assinantes</p>
                <p className="text-2xl font-bold">{mockPlan.subscribers_count}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+{mockMetrics.subscribers_growth}%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receita Mensal</p>
                <p className="text-2xl font-bold">{formatCurrency(mockPlan.revenue_monthly)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+{mockMetrics.revenue_growth}%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Churn</p>
                <p className="text-2xl font-bold">{mockMetrics.churn_rate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3 text-red-600" />
                  <span className="text-xs text-muted-foreground">mensal</span>
                </div>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversão</p>
                <p className="text-2xl font-bold">{mockMetrics.conversion_rate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-muted-foreground">trial → pago</span>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">LTV Médio</p>
                <p className="text-2xl font-bold">{formatCurrency(mockMetrics.avg_lifetime_value * 100)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-muted-foreground">por cliente</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações do Plano */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Informações do Plano
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">ID do Plano</Label>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium font-mono">{mockPlan.id}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(mockPlan.id)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Preço</Label>
                    <p className="text-sm font-medium">{formatCurrency(mockPlan.amount)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Período</Label>
                    <p className="text-sm font-medium">{mockPlan.interval === "month" ? "Mensal" : "Anual"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Período de Teste</Label>
                    <p className="text-sm font-medium">
                      {mockPlan.trial_period_days ? `${mockPlan.trial_period_days} dias` : "Não disponível"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <div className="mt-1">
                      <Badge
                        className={
                          mockPlan.active
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }
                      >
                        {mockPlan.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Receita Total</Label>
                    <p className="text-sm font-medium">{formatCurrency(mockPlan.revenue_total)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Criado em</Label>
                    <p className="text-sm font-medium">{formatDateOnly(mockPlan.created)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Última Atualização</Label>
                    <p className="text-sm font-medium">{formatDateOnly(mockPlan.updated)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recursos do Plano */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Recursos Inclusos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mockPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lista de Assinantes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Assinantes Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Período Atual</TableHead>
                      <TableHead>Assinante desde</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSubscribers.map((subscriber) => (
                      <TableRow key={subscriber.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{subscriber.customer_name}</p>
                            <p className="text-sm text-muted-foreground">{subscriber.customer_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(subscriber.status)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{formatDateOnly(subscriber.current_period_start)}</p>
                            <p className="text-muted-foreground">até {formatDateOnly(subscriber.current_period_end)}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{formatDateOnly(subscriber.created)}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver Todos os Assinantes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Lateral */}
        <div className="space-y-6">
          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver no Stripe Dashboard
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Copy className="h-4 w-4 mr-2" />
                Duplicar Plano
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Gerenciar Assinantes
              </Button>
            </CardContent>
          </Card>

          {/* Observações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Observações Internas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Adicione observações sobre este plano..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
              <Button className="w-full" disabled={isUpdating}>
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                Salvar Observações
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
