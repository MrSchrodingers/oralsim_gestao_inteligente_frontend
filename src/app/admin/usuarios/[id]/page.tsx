"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Users,
  Building2,
  Phone,
  MapPin,
  Shield,
  UserCheck,
  UserX,
  Package,
  CreditCard,
  TrendingUp,
  Activity,
  Clock,
  Edit,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Copy,
  BarChart3,
  Target,
  PhoneCall,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/common/components/ui/card"
import { Button } from "@/src/common/components/ui/button"
import { Badge } from "@/src/common/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/common/components/ui/avatar"
import { Skeleton } from "@/src/common/components/ui/skeleton"
import { useToast } from "@/src/common/components/ui/use-toast"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/common/components/ui/tabs"

// Interfaces (mesmas da página anterior)
interface UserClinic {
  id: string
  oralsin_clinic_id: number
  name: string
  cnpj: string
  created_at: string
  updated_at: string
  data: {
    id: string
    clinic_id: string
    corporate_name: string
    acronym: string
    address: {
      id: string
      street: string
      number: string
      complement?: string
      neighborhood: string
      city: string
      state: string
      zip_code: string
      created_at: string
      updated_at: string
    }
    active: boolean
    franchise: boolean
    timezone: string
    first_billing_date: string
    created_at: string
    updated_at: string
  }
  phones: Array<{
    id: string
    clinic_id: string
    phone_number: string
    phone_type: string
    created_at: string
    updated_at: string
  }>
}

interface User {
  id: string
  email: string
  name: string
  clinic_name?: string
  is_active: boolean
  role: "admin" | "clinic"
  created_at: string
  updated_at: string
  clinics: UserClinic[]
}

// Interfaces adicionais para dados do single
interface ClinicStats {
  total_patients: number
  active_patients: number
  with_receivable: number
  with_collection: number
  with_notifications: number
  monthly_revenue: number
  plan: {
    name: string
    type: "basic" | "premium" | "enterprise"
    price: number
    billing_cycle: "monthly" | "yearly"
    started_at: string
    expires_at: string
    features: string[]
  }
  subscription_status: "active" | "expired" | "cancelled" | "trial"
  last_login: string
  total_logins: number
}

// Mock data expandido
const mockUser: User = {
  id: "aecab357-9e3a-4543-86ac-36c40d74ef50",
  email: "bauru@oralsin.admin.com.br",
  name: "Dr. Matheus Munhoz",
  clinic_name: null,
  is_active: true,
  role: "clinic",
  created_at: "2025-06-23T11:37:42.696082-03:00",
  updated_at: "2025-06-23T11:37:42.696101-03:00",
  clinics: [
    {
      id: "af1afb8e-61bb-454b-82a1-18c57de9b938",
      oralsin_clinic_id: 47,
      name: "Bauru",
      cnpj: "26.411.050/0001-55",
      created_at: "2025-06-23T11:37:15.981423-03:00",
      updated_at: "2025-06-23T11:37:17.631186-03:00",
      data: {
        id: "bbd2af67-6578-48f7-ac6f-d8ff9b04e3d4",
        clinic_id: "af1afb8e-61bb-454b-82a1-18c57de9b938",
        corporate_name: "P. A. T. YANASE ODONTOLOGIA",
        acronym: "BAU",
        address: {
          id: "1aac667c-5ffb-4def-8697-b48ce3ae53f7",
          street: "Rua Engenheiro Saint Martin",
          number: "17-45",
          complement: null,
          neighborhood: "Centro",
          city: "Bauru",
          state: "SP",
          zip_code: "17015-351",
          created_at: "2025-06-23T11:37:15.992111-03:00",
          updated_at: "2025-06-23T11:37:15.994914-03:00",
        },
        active: true,
        franchise: true,
        timezone: "America/Sao_Paulo",
        first_billing_date: "2017-03-20",
        created_at: "2025-06-23T11:37:16.053768-03:00",
        updated_at: "2025-06-23T11:37:16.053781-03:00",
      },
      phones: [
        {
          id: "9bd1645b-cdf2-478c-9125-0a202f760b99",
          clinic_id: "af1afb8e-61bb-454b-82a1-18c57de9b938",
          phone_number: "(14) 3012-9449",
          phone_type: "primary",
          created_at: "2025-06-23T11:37:16.062291-03:00",
          updated_at: "2025-06-23T11:37:16.062305-03:00",
        },
      ],
    },
  ],
}

const mockClinicStats: ClinicStats = {
  total_patients: 1247,
  active_patients: 892,
  with_receivable: 156,
  with_collection: 43,
  with_notifications: 234,
  monthly_revenue: 45780.5,
  plan: {
    name: "Premium",
    type: "premium",
    price: 299.9,
    billing_cycle: "monthly",
    started_at: "2024-01-15T00:00:00.000Z",
    expires_at: "2025-01-15T00:00:00.000Z",
    features: [
      "Gestão completa de pacientes",
      "Sistema de cobrança automatizada",
      "Relatórios avançados",
      "Suporte prioritário",
      "Integração com WhatsApp",
      "Backup automático",
    ],
  },
  subscription_status: "active",
  last_login: "2025-06-23T09:15:30.000Z",
  total_logins: 1456,
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "N/A"
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr))
}

const formatDateOnly = (dateStr: string) => {
  if (!dateStr) return "N/A"
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateStr))
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

const getRoleBadge = (role: string) => {
  switch (role) {
    case "admin":
      return (
        <Badge variant="default" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
          <Shield className="h-3 w-3 mr-1" />
          Admin
        </Badge>
      )
    case "clinic":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Building2 className="h-3 w-3 mr-1" />
          Clínica
        </Badge>
      )
    default:
      return <Badge variant="outline">{role}</Badge>
  }
}

const getStatusBadge = (isActive: boolean) => {
  return isActive ? (
    <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
      <UserCheck className="h-3 w-3 mr-1" />
      Ativo
    </Badge>
  ) : (
    <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
      <UserX className="h-3 w-3 mr-1" />
      Inativo
    </Badge>
  )
}

const getPlanBadge = (planType: string) => {
  switch (planType) {
    case "basic":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Package className="h-3 w-3 mr-1" />
          Básico
        </Badge>
      )
    case "premium":
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          <Package className="h-3 w-3 mr-1" />
          Premium
        </Badge>
      )
    case "enterprise":
      return (
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
          <Package className="h-3 w-3 mr-1" />
          Enterprise
        </Badge>
      )
    default:
      return <Badge variant="outline">{planType}</Badge>
  }
}

const getSubscriptionBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Ativa
        </Badge>
      )
    case "expired":
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Expirada
        </Badge>
      )
    case "cancelled":
      return (
        <Badge variant="secondary">
          <XCircle className="h-3 w-3 mr-1" />
          Cancelada
        </Badge>
      )
    case "trial":
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          Trial
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const calculateSubscriptionDays = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const now = new Date()

  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const remainingDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  return { totalDays, remainingDays }
}

export default function UserDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [clinicStats, setClinicStats] = useState<ClinicStats | null>(null)

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true)
      try {
        // Simular chamadas das APIs
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setUser(mockUser)
        setClinicStats(mockClinicStats)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do usuário.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [params.id, toast])

  const handleToggleStatus = async () => {
    if (!user) return

    setIsUpdating(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedUser = {
        ...user,
        is_active: !user.is_active,
        updated_at: new Date().toISOString(),
      }

      setUser(updatedUser)

      toast({
        title: user.is_active ? "Usuário desativado" : "Usuário ativado",
        description: `O usuário foi ${user.is_active ? "desativado" : "ativado"} com sucesso.`,
      })
    } catch (error) {
      toast({
        title: "Erro ao alterar status",
        description: "Ocorreu um erro ao tentar alterar o status do usuário.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado para área de transferência",
      description: text,
    })
  }

  const subscriptionInfo = useMemo(() => {
    if (!clinicStats) return null
    return calculateSubscriptionDays(clinicStats.plan.started_at, clinicStats.plan.expires_at)
  }, [clinicStats])

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

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold text-destructive">Usuário não encontrado</h3>
            <p className="text-muted-foreground mt-2">O usuário solicitado não foi encontrado.</p>
            <Button className="mt-4" onClick={() => router.back()}>
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const primaryClinic = user.clinics[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                {user.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          <Button variant="outline" onClick={() => router.push(`/admin/usuarios/${user.id}/editar`)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant={user.is_active ? "outline" : "default"}
                className={
                  user.is_active ? "text-red-600 border-red-200 hover:bg-red-50" : "bg-green-600 hover:bg-green-700"
                }
                disabled={isUpdating}
              >
                {user.is_active ? (
                  <>
                    <UserX className="h-4 w-4 mr-2" />
                    Desativar
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Ativar
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{user.is_active ? "Desativar" : "Ativar"} Usuário</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja {user.is_active ? "desativar" : "ativar"} o usuário "{user.name}"?{" "}
                  {user.is_active
                    ? "Ele não poderá mais acessar o sistema."
                    : "Ele poderá acessar o sistema novamente."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleToggleStatus}
                  className={user.is_active ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                >
                  {user.is_active ? "Desativar" : "Ativar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                <div className="mt-1">{getRoleBadge(user.role)}</div>
              </div>
              {user.role === "admin" ? (
                <Shield className="h-8 w-8 text-muted-foreground" />
              ) : (
                <Building2 className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <div className="mt-1">{getStatusBadge(user.is_active)}</div>
              </div>
              {user.is_active ? (
                <UserCheck className="h-8 w-8 text-muted-foreground" />
              ) : (
                <UserX className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
          </CardContent>
        </Card>

        {clinicStats && (
          <>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Plano</p>
                    <div className="mt-1">{getPlanBadge(clinicStats.plan.type)}</div>
                  </div>
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Assinatura</p>
                    <div className="mt-1">{getSubscriptionBadge(clinicStats.subscription_status)}</div>
                  </div>
                  <CreditCard className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Conteúdo Principal */}
      {user.role === "admin" ? (
        // Layout para Admin
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Informações do Administrador
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
                  <p className="text-sm font-medium">{user.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">E-mail</Label>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{user.email}</p>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(user.email)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Criado em</Label>
                  <p className="text-sm font-medium">{formatDate(user.created_at)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Última atualização</Label>
                  <p className="text-sm font-medium">{formatDate(user.updated_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Login realizado</p>
                    <p className="text-xs text-muted-foreground">Hoje às 09:15</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Usuário criado</p>
                    <p className="text-xs text-muted-foreground">Ontem às 14:30</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Configuração alterada</p>
                    <p className="text-xs text-muted-foreground">2 dias atrás</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Layout para Clínica
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="clinic">Clínica</TabsTrigger>
            <TabsTrigger value="subscription">Assinatura</TabsTrigger>
            <TabsTrigger value="activity">Atividade</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {clinicStats && (
              <>
                {/* Cards de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Pacientes</p>
                          <p className="text-2xl font-bold">{clinicStats.total_patients.toLocaleString()}</p>
                        </div>
                        <Users className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Pacientes Ativos</p>
                          <p className="text-2xl font-bold text-green-600">
                            {clinicStats.active_patients.toLocaleString()}
                          </p>
                        </div>
                        <UserCheck className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Recebíveis</p>
                          <p className="text-2xl font-bold text-blue-600">{clinicStats.with_receivable}</p>
                        </div>
                        <Target className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Cobrança</p>
                          <p className="text-2xl font-bold text-orange-600">{clinicStats.with_collection}</p>
                        </div>
                        <PhoneCall className="h-8 w-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Receita Mensal</p>
                          <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(clinicStats.monthly_revenue)}
                          </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Informações do Plano */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Plano Atual
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-semibold">{clinicStats.plan.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(clinicStats.plan.price)}/
                            {clinicStats.plan.billing_cycle === "monthly" ? "mês" : "ano"}
                          </p>
                        </div>
                        {getPlanBadge(clinicStats.plan.type)}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Tempo de assinatura</span>
                          <span className="font-medium">
                            {subscriptionInfo
                              ? `${Math.floor((Date.now() - new Date(clinicStats.plan.started_at).getTime()) / (1000 * 60 * 60 * 24))} dias`
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Expira em</span>
                          <span className="font-medium">
                            {subscriptionInfo ? `${subscriptionInfo.remainingDays} dias` : "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <p className="text-sm font-medium mb-2">Recursos inclusos:</p>
                        <div className="space-y-1">
                          {clinicStats.plan.features.slice(0, 3).map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              <span>{feature}</span>
                            </div>
                          ))}
                          {clinicStats.plan.features.length > 3 && (
                            <p className="text-xs text-muted-foreground">
                              +{clinicStats.plan.features.length - 3} recursos adicionais
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Atividade da Conta
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Último Login</Label>
                          <p className="text-sm font-medium">{formatDate(clinicStats.last_login)}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Total de Logins</Label>
                          <p className="text-sm font-medium">{clinicStats.total_logins.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Login realizado</p>
                            <p className="text-xs text-muted-foreground">{formatDate(clinicStats.last_login)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Paciente adicionado</p>
                            <p className="text-xs text-muted-foreground">Hoje às 11:30</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Relatório gerado</p>
                            <p className="text-xs text-muted-foreground">Ontem às 16:45</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="clinic" className="space-y-6">
            {primaryClinic && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Informações da Clínica
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
                        <p className="text-sm font-medium">{primaryClinic.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Razão Social</Label>
                        <p className="text-sm font-medium">{primaryClinic.data.corporate_name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">CNPJ</Label>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{primaryClinic.cnpj}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(primaryClinic.cnpj)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Sigla</Label>
                        <p className="text-sm font-medium">{primaryClinic.data.acronym}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">ID OralSin</Label>
                        <p className="text-sm font-medium">{primaryClinic.oralsin_clinic_id}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Franquia</Label>
                        <p className="text-sm font-medium">{primaryClinic.data.franchise ? "Sim" : "Não"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Endereço e Contato
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Endereço</Label>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {primaryClinic.data.address.street}, {primaryClinic.data.address.number}
                        </p>
                        {primaryClinic.data.address.complement && (
                          <p className="text-sm text-muted-foreground">{primaryClinic.data.address.complement}</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {primaryClinic.data.address.neighborhood}, {primaryClinic.data.address.city} -{" "}
                          {primaryClinic.data.address.state}
                        </p>
                        <p className="text-sm text-muted-foreground">CEP: {primaryClinic.data.address.zip_code}</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Telefones</Label>
                      <div className="space-y-2">
                        {primaryClinic.phones.map((phone) => (
                          <div key={phone.id} className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm font-medium">{phone.phone_number}</p>
                            <Badge variant="outline" className="text-xs">
                              {phone.phone_type}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(phone.phone_number)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Timezone</Label>
                      <p className="text-sm font-medium">{primaryClinic.data.timezone}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Primeiro Faturamento</Label>
                      <p className="text-sm font-medium">{formatDateOnly(primaryClinic.data.first_billing_date)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="subscription" className="space-y-6">
            {clinicStats && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Detalhes da Assinatura
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold text-lg">{clinicStats.plan.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(clinicStats.plan.price)} por{" "}
                          {clinicStats.plan.billing_cycle === "monthly" ? "mês" : "ano"}
                        </p>
                      </div>
                      <div className="text-right">
                        {getPlanBadge(clinicStats.plan.type)}
                        <div className="mt-2">{getSubscriptionBadge(clinicStats.subscription_status)}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Iniciado em</Label>
                        <p className="text-sm font-medium">{formatDateOnly(clinicStats.plan.started_at)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Expira em</Label>
                        <p className="text-sm font-medium">{formatDateOnly(clinicStats.plan.expires_at)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Dias restantes</Label>
                        <p className="text-sm font-medium text-orange-600">
                          {subscriptionInfo ? subscriptionInfo.remainingDays : "N/A"} dias
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Tempo total</Label>
                        <p className="text-sm font-medium">
                          {subscriptionInfo
                            ? Math.floor(
                                (Date.now() - new Date(clinicStats.plan.started_at).getTime()) / (1000 * 60 * 60 * 24),
                              )
                            : "N/A"}{" "}
                          dias
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground mb-3 block">Recursos do Plano</Label>
                      <div className="space-y-2">
                        {clinicStats.plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Métricas de Uso
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Pacientes Cadastrados</span>
                          <span className="text-sm font-bold">{clinicStats.total_patients.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">75% do limite do plano</p>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Mensagens Enviadas</span>
                          <span className="text-sm font-bold">2.847</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">45% do limite mensal</p>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Relatórios Gerados</span>
                          <span className="text-sm font-bold">156</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: "30%" }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">30% do limite mensal</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Receita Mensal Estimada</span>
                        <span className="text-lg font-bold text-green-600">
                          {formatCurrency(clinicStats.monthly_revenue)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Baseado nos últimos 30 dias</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Histórico de Atividades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Login realizado com sucesso</p>
                      <p className="text-xs text-muted-foreground">
                        IP: 192.168.1.100 • {formatDate(clinicStats?.last_login || "")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Novo paciente cadastrado</p>
                      <p className="text-xs text-muted-foreground">Maria Silva • Hoje às 11:30</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <div className="h-3 w-3 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Relatório de cobrança gerado</p>
                      <p className="text-xs text-muted-foreground">Relatório mensal • Ontem às 16:45</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <div className="h-3 w-3 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Configuração de notificação alterada</p>
                      <p className="text-xs text-muted-foreground">WhatsApp habilitado • 2 dias atrás</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Tentativa de login falhada</p>
                      <p className="text-xs text-muted-foreground">IP: 203.45.67.89 • 3 dias atrás</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Pagamento processado</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(clinicStats?.plan.price || 0)} • 5 dias atrás
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
