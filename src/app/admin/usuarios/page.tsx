"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Users,
  Shield,
  Building2,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Loader2,
  Search,
  Eye,
  Edit,
  Mail,
  Phone,
  RefreshCcw,
  RefreshCw,
} from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/common/components/ui/card"
import { Button } from "@/src/common/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/common/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/common/components/ui/dropdownMenu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/common/components/ui/select"
import { Input } from "@/src/common/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/common/components/ui/avatar"
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
import { useToast } from "@/src/common/components/ui/use-toast"
import { getActiveStatusBadge, getRoleBadge } from "@/src/common/components/helpers/GetBadge"
import { formatDate } from "@/src/common/utils/formatters"
import type { IUser, IUserFullData } from "@/src/common/interfaces/IUser"
import { useFetchUsers, useFetchUsersData, useUpdateUser } from "@/src/common/hooks/useUser"

export default function UsersPage() {
  const router = useRouter()
  const { toast } = useToast()

  /* ----------------------------- filtros e estado ----------------------------- */
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  useEffect(() => setPage(1), [roleFilter, statusFilter, searchTerm, pageSize])

  /* ---------------------------- chamada à API ---------------------------- */
  const queryParams = useMemo(
    () => ({
      page,
      page_size: pageSize,
      search: searchTerm || undefined,
      role: roleFilter !== "all" ? roleFilter : undefined,
      is_active:
        statusFilter === "all"
          ? undefined
          : statusFilter === "active"
            ? true
            : false,
    }),
    [page, pageSize, searchTerm, roleFilter, statusFilter],
  )

  const {
    data: usersPage,
    isLoading,
    isFetching,
    refetch
  } = useFetchUsersData(queryParams)

  const users = usersPage?.results ?? []
  const totalItems = usersPage?.total_items ?? 0
  const totalPages = Math.ceil(totalItems / pageSize)

  /* ------------------------ resumo estatístico local ------------------------- */
  const summary = useMemo(() => {
    const admins = users.filter((u) => u.role === "admin").length
    const clinics = users.filter((u) => u.role === "clinic").length
    const active = users.filter((u) => u.is_active).length
    const inactive = users.filter((u) => !u.is_active).length
    return { total: users.length, admins, clinics, active, inactive }
  }, [users])

  /* ------------------------- toggle status mutation -------------------------- */
  const updateUserMutation = useUpdateUser()

  const handleToggleStatus = (user: IUser) => {
    updateUserMutation.mutate(
      {
        id: user.id,
        data: { is_active: !user.is_active },
      },
      {
        onSuccess: () => {
          toast({
            title: user.is_active ? "Usuário desativado" : "Usuário ativado",
            description: `O usuário foi ${user.is_active ? "desativado" : "ativado"} com sucesso.`,
          })
        },
        onError: () =>
          toast({
            title: "Erro ao alterar status",
            description: "Ocorreu um erro ao tentar alterar o status do usuário.",
            variant: "destructive",
          }),
      },
    )
  }

  /* -------------------------------------------------------------------------- */

  return (
    <div className="space-y-6">
      {/* --------------------------------------------------------------------- */}
      {/*  Cabeçalho                                                            */}
      {/* --------------------------------------------------------------------- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Usuários do Sistema</h1>
            {(isLoading || isFetching) && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
          <p className="text-muted-foreground">
            Gerencie todos os usuários administradores e clínicas do sistema
          </p>
        </div>
          
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button onClick={() => router.push("/admin/usuarios/novo")}>
            <Users className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/*  Cartões de estatísticas                                              */}
      {/* --------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Users} label="Total" value={summary.total} />
        <StatCard icon={Shield} label="Admins" value={summary.admins} color="text-purple-600" />
        <StatCard icon={Building2} label="Clínicas" value={summary.clinics} color="text-blue-600" />
        <StatCard icon={UserCheck} label="Ativos" value={summary.active} color="text-green-600" />
        <StatCard icon={UserX} label="Inativos" value={summary.inactive} color="text-red-600" />
      </div>

      {/* --------------------------------------------------------------------- */}
      {/*  Tabela principal                                                     */}
      {/* --------------------------------------------------------------------- */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Lista de Usuários
            </CardTitle>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="admin">Administradores</SelectItem>
                  <SelectItem value="clinic">Clínicas</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
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
                  <TableHead>Usuário</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Clínica(s)</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!isLoading && users.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-6">
                      Nenhum usuário encontrado
                    </td>
                  </tr>
                )}

                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <UserInfo user={user} />
                    </TableCell>

                    <TableCell>{getRoleBadge(user.role)}</TableCell>

                    <TableCell>
                      <ClinicInfo clinics={user.clinics ?? []} />
                    </TableCell>

                    <TableCell>
                      <ContactInfo user={user} />
                    </TableCell>

                    <TableCell>{getActiveStatusBadge(user.is_active)}</TableCell>

                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(user.created_at)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <RowActions
                        user={user}
                        onToggleStatus={() => handleToggleStatus(user)}
                        loading={updateUserMutation.isPending}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/*  Paginação                                                        */}
          {/* ----------------------------------------------------------------- */}
          {totalItems > 0 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(size) => setPageSize(size)}
              showingStart={(page - 1) * pageSize + 1}
              showingEnd={Math.min(page * pageSize, totalItems)}
              totalItems={totalItems}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/* =============================================================================
   Sub-componentes auxiliares
============================================================================= */

/* ---------- Cartão de estatística ---------- */
interface StatCardProps {
  icon: React.ElementType
  label: string
  value: number
  color?: string
}
function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className={`text-2xl font-bold ${color ?? ""}`}>{value}</p>
          </div>
          <Icon className={`h-8 w-8 ${color ?? "text-muted-foreground"}`} />
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------- Usuário + Avatar ---------- */
function UserInfo({ user }: { user: IUser }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10">
        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
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
        <p className="font-medium">{user.name}</p>
        <p className="text-sm text-muted-foreground">ID: {user.id.slice(0, 8)}...</p>
      </div>
    </div>
  )
}

/* ---------- Clínicas associadas ---------- */
function ClinicInfo({ clinics }: { clinics: IUserFullData["clinics"] }) {
  if (!clinics || clinics.length === 0)
    return <span className="text-sm text-muted-foreground">-</span>

  return (
    <div className="space-y-1">
      {clinics.slice(0, 2).map((clinic) => (
        <div key={clinic.id} className="flex items-center gap-2">
          <Building2 className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{clinic.name}</span>
        </div>
      ))}
      {clinics.length > 2 && (
        <p className="text-xs text-muted-foreground">+{clinics.length - 2} mais</p>
      )}
    </div>
  )
}

/* ---------- Contato ---------- */
function ContactInfo({ user }: { user: IUserFullData }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-sm">
        <Mail className="h-4 w-4 text-muted-foreground" />
        <span className="truncate max-w-[200px]">{user.email}</span>
      </div>

      {user.clinics?.length && user.clinics[0].phones?.length ? (
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span >{user.clinics[0].phones[0].phone_number}</span>
        </div>
      ) : null}
    </div>
  )
}

/* ---------- Ações da linha ---------- */
interface RowActionsProps {
  user: IUser
  onToggleStatus: () => void
  loading: boolean
}
function RowActions({ user, onToggleStatus, loading }: RowActionsProps) {
  const router = useRouter()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={loading}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => router.push(`/admin/usuarios/${user.id}`)} className="cursor-pointer">
          <Eye className="h-4 w-4 mr-2" />
          Ver Detalhes
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
              {user.is_active ? (
                <>
                  <UserX className="h-4 w-4 mr-2 text-red-600" />
                  Desativar
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4 mr-2 text-green-600" />
                  Ativar
                </>
              )}
            </DropdownMenuItem>
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
                onClick={onToggleStatus}
                className={
                  user.is_active ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                }
              >
                {user.is_active ? "Desativar" : "Ativar"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* ---------- Paginação ---------- */
interface PaginationProps {
  page: number
  totalPages: number
  pageSize: number
  showingStart: number
  showingEnd: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}
function Pagination({
  page,
  totalPages,
  pageSize,
  showingStart,
  showingEnd,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between px-2 py-4">
      <p className="text-sm text-muted-foreground">
        Mostrando {showingStart} a {showingEnd} de {totalItems} usuários
      </p>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">Itens por página:</p>
          <Select value={pageSize.toString()} onValueChange={(v) => onPageSizeChange(Number(v))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 25, 50].map((s) => (
                <SelectItem key={s} value={s.toString()}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = Math.max(1, Math.min(totalPages - 4, page - 2)) + i
              if (pageNumber > totalPages) return null
              return (
                <Button
                  key={pageNumber}
                  variant={pageNumber === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNumber)}
                  className="w-8 h-8 p-0"
                >
                  {pageNumber}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Próxima
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

