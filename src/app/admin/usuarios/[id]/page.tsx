"use client"

import { useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Shield,
  Building2,
  UserCheck,
  UserX,
  Package,
  CreditCard,
  Activity,
  AlertCircle,
  Loader2,
  Copy,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/common/components/ui/card"
import { Button } from "@/src/common/components/ui/button"
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

import {
  getActiveStatusBadge,
  getPlanBadge,
  getRoleBadge,
  getSubscriptionBadge,
} from "@/src/common/components/helpers/GetBadge"
import { calculateSubscriptionDays, formatDate } from "@/src/common/utils/formatters"

import type { IUserFullData } from "@/src/common/interfaces/IUser"
import { useFetchUserById, useUpdateUser } from "@/src/common/hooks/useUser"
import { useFetchClinicsSummary } from "@/src/common/hooks/useClinic"
import ClinicTabs from "@/src/common/components/users/ClinicTabs"

/* ------------------------------------------------------------------ */
/*  Mocks apenas para plano / métricas                               */
/* ------------------------------------------------------------------ */
const planMock = {
  name: "Premium",
  type: "premium" as const,
  price: 299.9,
  billing_cycle: "monthly" as const,
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
}

export default function UserDetailsPage() {
  const { id: userId } = useParams()
  const router = useRouter()
  const { toast } = useToast()

  /* ---------------------------- dados ----------------------------------- */
  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useFetchUserById(userId as string)

  const primaryClinicId = user?.clinics?.[0]?.id
  const {
    data: clinicStats,
    isLoading: clinicLoading,
  } = useFetchClinicsSummary(primaryClinicId ?? "")

  /* ------------------------- mutação status ----------------------------- */
  const updateStatus = useUpdateUser()

  const handleToggleStatus = () => {
    if (!user) return
    updateStatus.mutate(
      { id: user.id, data: { is_active: !user.is_active } },
      {
        onSuccess: () =>
          toast({
            title: user.is_active ? "Usuário desativado" : "Usuário ativado",
            description: `O usuário foi ${user.is_active ? "desativado" : "ativado"} com sucesso.`,
          }),
        onError: () =>
          toast({
            title: "Erro ao alterar status",
            description: "Não foi possível alterar o status.",
            variant: "destructive",
          }),
      },
    )
  }

  /* --------------------------- utils ------------------------------------ */
  const copy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({ title: "Copiado", description: text })
  }

  const subscriptionInfo = useMemo(
    () => calculateSubscriptionDays(planMock.started_at, planMock.expires_at),
    [],
  )

  const loading = userLoading || clinicLoading
  if (loading) return <SkeletonUI />
  if (userError || !user) return <NotFound onBack={router.back} />

  /* --------------------------- render ----------------------------------- */
  return (
    <div className="space-y-6">
      <Header
        user={user}
        onBack={router.back}
        onToggleStatus={handleToggleStatus}
        loading={updateStatus.isPending}
      />

      <StatusCards user={user} clinicStats={clinicStats} />

      {user.role === "admin" ? (
        <AdminContent user={user} copy={copy} />
      ) : (
        <ClinicTabs
          user={user}
          clinicStats={clinicStats}
          plan={planMock}
          subscriptionInfo={subscriptionInfo}
          copy={copy}
        />
      )}
    </div>
  )
}

/* =============================================================================
   ==============  COMPONENTES AUXILIARES  =====================================
============================================================================= */

const SkeletonUI = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-4">
      <Skeleton className="h-10 w-10" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Skeleton className="h-64 w-full lg:col-span-2" />
      <Skeleton className="h-64 w-full" />
    </div>
  </div>
)

const NotFound = ({ onBack }: { onBack: () => void }) => (
  <div className="flex items-center justify-center h-full">
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold text-destructive">Usuário não encontrado</h3>
        <p className="text-muted-foreground mt-2">O usuário solicitado não foi encontrado.</p>
        <Button className="mt-4" onClick={onBack}>
          Voltar
        </Button>
      </CardContent>
    </Card>
  </div>
)

/* ------------------------------ HEADER ---------------------------------- */
interface HeaderProps {
  user: IUserFullData
  onBack: () => void
  onToggleStatus: () => void
  loading: boolean
}
const Header = ({ user, onBack, onToggleStatus, loading }: HeaderProps) => (
  <div className="flex flex-col lg:flex-row justify-between gap-4">
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" onClick={onBack}>
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <Avatar className="h-12 w-12">
        <AvatarImage src="/placeholder.svg" />
        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
        {(() => {
                            const cleaned = user.name.replace(/-/g, "").trim();
                            const words   = cleaned.split(/\s+/);

                            // Somente um nome → pega as 3 primeiras letras
                            if (words.length === 1) {
                              return cleaned.slice(0, 3).toUpperCase();
                            }

                            // Vários nomes → pega a primeira letra de cada um (máx. 3)
                            return words
                              .map(w => w[0])
                              .join("")
                              .slice(0, 3)
                              .toUpperCase();
        })()}
        </AvatarFallback>
      </Avatar>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>
    </div>

    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={user.is_active ? "outline" : "default"}
          className={
            user.is_active
              ? "text-red-600 border-red-200 hover:bg-red-50"
              : "bg-green-600 hover:bg-green-700"
          }
          disabled={loading}
        >
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {user.is_active ? (
            <>
              <UserX className="h-4 w-4 mr-2" /> Desativar
            </>
          ) : (
            <>
              <UserCheck className="h-4 w-4 mr-2" /> Ativar
            </>
          )}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{user.is_active ? "Desativar" : "Ativar"} Usuário</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja {user.is_active ? "desativar" : "ativar"} o usuário "{user.name}"?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onToggleStatus}
            className={user.is_active ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
          >
            {user.is_active ? "Desativar" : "Ativar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
)

/* --------------------------- STATUS CARDS ------------------------------ */
const StatusCards = ({ user, clinicStats }: { user: IUserFullData; clinicStats?: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <StatCard label="Tipo" icon={user.role === "admin" ? Shield : Building2} badge={getRoleBadge(user.role)} />
    <StatCard
      label="Status"
      icon={user.is_active ? UserCheck : UserX}
      badge={getActiveStatusBadge(user.is_active)}
    />
    {clinicStats && clinicStats?.plan && clinicStats?.plan?.type (
      <>
        <StatCard label="Plano" icon={Package} badge={getPlanBadge(clinicStats.plan.type)} />
        <StatCard
          label="Assinatura"
          icon={CreditCard}
          badge={getSubscriptionBadge(clinicStats.subscription_status)}
        />
      </>
    )}
  </div>
)

const StatCard = ({
  label,
  icon: Icon,
  badge,
}: {
  label: string
  icon: React.ElementType
  badge: React.ReactNode
}) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className="mt-1">{badge}</div>
        </div>
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
    </CardContent>
  </Card>
)

/* --------------------- ADMIN CONTENT ----------------------------------- */
const AdminContent = ({
  user,
  copy,
}: {
  user: IUserFullData
  copy: (v: string) => void
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" /> Informações do Administrador
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <InfoGrid
          rows={[
            { label: "Nome", value: user.name },
            { label: "E-mail", value: user.email, copy: () => copy(user.email) },
            { label: "Criado em", value: formatDate(user.created_at) },
            { label: "Última atualização", value: formatDate(user.updated_at) },
          ]}
        />
      </CardContent>
    </Card>
  </div>
)

const InfoGrid = ({
  rows,
}: {
  rows: { label: string; value: React.ReactNode; copy?: () => void }[]
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {rows.map((r) => (
      <div key={r.label}>
        <Label className="text-sm font-medium text-muted-foreground">{r.label}</Label>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{r.value}</span>
          {r.copy && (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={r.copy}>
              <Copy className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    ))}
  </div>
)

const TimeLine = ({
  items,
}: {
  items: { color: string; title: string; time: string }[]
}) => (
  <div className="space-y-4">
    {items.map((e, i) => (
      <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
        <div className={`h-2 w-2 ${e.color} rounded-full`} />
        <div className="flex-1">
          <p className="text-sm font-medium">{e.title}</p>
          <p className="text-xs text-muted-foreground">{e.time}</p>
        </div>
      </div>
    ))}
  </div>
)
