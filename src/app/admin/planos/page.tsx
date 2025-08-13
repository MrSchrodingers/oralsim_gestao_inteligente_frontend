"use client"

import { useState, useMemo } from "react"
import { Package, MoreHorizontal, Eye, Edit, Users, DollarSign, TrendingUp,ChevronLeft, ChevronRight, Loader2, Plus, Archive, ArchiveRestore } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/src/common/components/ui/card"
import { Button } from "@/src/common/components/ui/button"
import { Badge } from "@/src/common/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/common/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/common/components/ui/dropdownMenu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/common/components/ui/select"
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
import { useRouter } from "next/navigation"
import { useToast } from "@/src/common/components/ui/use-toast"

interface StripePlan {
  id: string
  name: string
  description: string
  amount: number
  currency: string
  interval: 'month' | 'year'
  interval_count: number
  active: boolean
  created: number
  updated: number
  subscribers_count: number
  revenue_monthly: number
  trial_period_days?: number
  features: string[]
}

interface PlansMetrics {
  total_plans: number
  active_plans: number
  inactive_plans: number
  total_subscribers: number
  monthly_revenue: number
  annual_revenue: number
}

// Mock data - Em produção, isso viria de uma API
const mockPlans: StripePlan[] = [
  {
    id: "price_1234567890",
    name: "Plano Básico",
    description: "Ideal para clínicas pequenas com até 100 pacientes",
    amount: 9900, // R$ 99,00 em centavos
    currency: "brl",
    interval: "month",
    interval_count: 1,
    active: true,
    created: Date.now() - 86400000 * 30,
    updated: Date.now() - 86400000 * 5,
    subscribers_count: 45,
    revenue_monthly: 445500,
    trial_period_days: 14,
    features: ["Até 100 pacientes", "Relatórios básicos", "Suporte por email"]
  },
  {
    id: "price_0987654321",
    name: "Plano Premium",
    description: "Para clínicas médias com recursos avançados",
    amount: 19900, // R$ 199,00 em centavos
    currency: "brl",
    interval: "month",
    interval_count: 1,
    active: true,
    created: Date.now() - 86400000 * 60,
    updated: Date.now() - 86400000 * 2,
    subscribers_count: 28,
    revenue_monthly: 557200,
    trial_period_days: 14,
    features: ["Até 500 pacientes", "Relatórios avançados", "Suporte prioritário", "Integrações"]
  },
  {
    id: "price_1122334455",
    name: "Plano Enterprise",
    description: "Solução completa para grandes clínicas e redes",
    amount: 39900, // R$ 399,00 em centavos
    currency: "brl",
    interval: "month",
    interval_count: 1,
    active: true,
    created: Date.now() - 86400000 * 90,
    updated: Date.now() - 86400000 * 1,
    subscribers_count: 12,
    revenue_monthly: 478800,
    trial_period_days: 30,
    features: ["Pacientes ilimitados", "Relatórios personalizados", "Suporte 24/7", "API completa", "White label"]
  },
  {
    id: "price_5566778899",
    name: "Plano Anual Básico",
    description: "Plano básico com desconto anual",
    amount: 99000, // R$ 990,00 em centavos (10 meses pelo preço de 12)
    currency: "brl",
    interval: "year",
    interval_count: 1,
    active: true,
    created: Date.now() - 86400000 * 45,
    updated: Date.now() - 86400000 * 10,
    subscribers_count: 23,
    revenue_monthly: 189750, // Calculado mensalmente
    features: ["Até 100 pacientes", "Relatórios básicos", "Suporte por email", "2 meses grátis"]
  },
  {
    id: "price_9988776655",
    name: "Plano Descontinuado",
    description: "Plano antigo que não está mais disponível",
    amount: 14900,
    currency: "brl",
    interval: "month",
    interval_count: 1,
    active: false,
    created: Date.now() - 86400000 * 180,
    updated: Date.now() - 86400000 * 90,
    subscribers_count: 8,
    revenue_monthly: 119200,
    features: ["Recursos limitados", "Suporte básico"]
  }
]

const mockMetrics: PlansMetrics = {
  total_plans: 5,
  active_plans: 4,
  inactive_plans: 1,
  total_subscribers: 116,
  monthly_revenue: 1790450,
  annual_revenue: 21485400
}

export default function PlansPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [intervalFilter, setIntervalFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isLoading, setIsLoading] = useState(false)

  const filteredPlans = useMemo(() => {
    let filtered = mockPlans

    if (statusFilter !== "all") {
      filtered = filtered.filter((plan) => 
        statusFilter === "active" ? plan.active : !plan.active
      )
    }

    if (intervalFilter !== "all") {
      filtered = filtered.filter((plan) => plan.interval === intervalFilter)
    }

    return filtered
  }, [statusFilter, intervalFilter])

  const paginatedPlans = useMemo(() => {
    const startIndex = (page - 1) * pageSize
    return filteredPlans.slice(startIndex, startIndex + pageSize)
  }, [filteredPlans, page, pageSize])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount / 100)
  }

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(timestamp))
  }

  const getStatusBadge = (active: boolean) => {
    if (active) {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          Ativo
        </Badge>
      )
    }
    return (
      <Badge variant="secondary">
        Inativo
      </Badge>
    )
  }

  const getIntervalBadge = (interval: string) => {
    const text = interval === 'month' ? 'Mensal' : 'Anual'
    const variant = interval === 'month' ? 'default' : 'outline'
    
    return (
      <Badge variant={variant} className={interval === 'year' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}>
        {text}
      </Badge>
    )
  }

  const handleToggleStatus = async (planId: string, currentStatus: boolean) => {
    setIsLoading(true)
    try {
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: currentStatus ? "Plano desativado" : "Plano ativado",
        description: `O plano foi ${currentStatus ? 'desativado' : 'ativado'} com sucesso.`,
      })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status do plano.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Planos</h1>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
          <p className="text-muted-foreground">
            Gerencie todos os planos do Stripe e acompanhe métricas de assinantes
          </p>
        </div>
        <Button onClick={() => router.push('/admin/planos/novo')}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Plano
        </Button>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between"> 
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Planos</p>
                <p className="text-2xl font-bold">{mockMetrics.total_plans}</p>
              </div>
              <Package className="h-8 w-8 mt-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Planos Ativos</p>
                <p className="text-2xl font-bold text-green-600">{mockMetrics.active_plans}</p>
              </div>
              <Package className="h-8 w-8 mt-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Assinantes</p>
                <p className="text-2xl font-bold text-blue-600">{mockMetrics.total_subscribers}</p>
              </div>
              <Users className="h-8 w-8 mt-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receita Mensal</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(mockMetrics.monthly_revenue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 mt-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receita Anual</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(mockMetrics.annual_revenue)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 mt-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Planos */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Lista de Planos
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
              </Select>
              <Select value={intervalFilter} onValueChange={setIntervalFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os períodos</SelectItem>
                  <SelectItem value="month">Mensais</SelectItem>
                  <SelectItem value="year">Anuais</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plano</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assinantes</TableHead>
                  <TableHead>Receita Mensal</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{plan.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {plan.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {formatCurrency(plan.amount)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getIntervalBadge(plan.interval)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(plan.active)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{plan.subscribers_count}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-green-600">
                        {formatCurrency(plan.revenue_monthly)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(plan.created)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={isLoading}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => router.push(`/admin/planos/${plan.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => router.push(`/admin/planos/${plan.id}/editar`)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                {plan.active ? (
                                  <>
                                    <Archive className="h-4 w-4 mr-2 text-red-600" />
                                    Desativar
                                  </>
                                ) : (
                                  <>
                                    <ArchiveRestore className="h-4 w-4 mr-2 text-green-600" />
                                    Ativar
                                  </>
                                )}
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {plan.active ? 'Desativar' : 'Ativar'} Plano
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja {plan.active ? 'desativar' : 'ativar'} o plano &quot;{plan.name}&quot;?
                                  {plan.active && ' Novos assinantes não poderão mais se inscrever neste plano.'}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleToggleStatus(plan.id, plan.active)}
                                  className={plan.active ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                                >
                                  {plan.active ? 'Desativar' : 'Ativar'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Paginação */}
          {filteredPlans.length > 0 ? (
            <div className="flex items-center justify-between px-2 py-4">
              <p className="text-sm text-muted-foreground">
                Mostrando {(page - 1) * pageSize + 1} a {Math.min(page * pageSize, filteredPlans.length)} de{" "}
                {filteredPlans.length} planos
              </p>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Itens por página:</p>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => {
                      setPageSize(Number(value))
                      setPage(1)
                    }}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage(page - 1)} 
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= Math.ceil(filteredPlans.length / pageSize)}
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum plano encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Tente ajustar os filtros ou crie um novo plano
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setStatusFilter("all")
                  setIntervalFilter("all")
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
