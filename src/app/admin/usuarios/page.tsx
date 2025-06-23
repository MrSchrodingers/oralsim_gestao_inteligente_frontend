"use client"

import { useState, useMemo } from "react"
import {
  Users,
  MoreHorizontal,
  Phone,
  Mail,
  Eye,
  Edit,
  UserCheck,
  UserX,
  Shield,
  Building2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
} from "lucide-react"
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
import { useRouter } from "next/navigation"

// Interfaces
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

interface UsersResponse {
  results: User[]
  total: number
}

// Mock data
const mockUsers: UsersResponse = {
  results: [
    {
      id: "c0ab4705-6e2f-4ce9-b635-7a8fd10b6d9e",
      email: "matheus@admin.com",
      name: "Super Admin Seed",
      clinic_name: null,
      is_active: true,
      role: "admin",
      created_at: "2025-06-23T11:14:39.002242-03:00",
      updated_at: "2025-06-23T11:14:39.002261-03:00",
      clinics: [],
    },
    {
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
    },
    {
      id: "bbb4705-6e2f-4ce9-b635-7a8fd10b6d9f",
      email: "saopaulo@oralsin.admin.com.br",
      name: "Dra. Ana Silva",
      clinic_name: null,
      is_active: false,
      role: "clinic",
      created_at: "2025-06-22T10:15:30.002242-03:00",
      updated_at: "2025-06-22T10:15:30.002261-03:00",
      clinics: [
        {
          id: "bf1afb8e-61bb-454b-82a1-18c57de9b939",
          oralsin_clinic_id: 48,
          name: "São Paulo Centro",
          cnpj: "12.345.678/0001-90",
          created_at: "2025-06-22T10:15:30.981423-03:00",
          updated_at: "2025-06-22T10:15:30.631186-03:00",
          data: {
            id: "cbd2af67-6578-48f7-ac6f-d8ff9b04e3d5",
            clinic_id: "bf1afb8e-61bb-454b-82a1-18c57de9b939",
            corporate_name: "SILVA ODONTOLOGIA LTDA",
            acronym: "SPC",
            address: {
              id: "2aac667c-5ffb-4def-8697-b48ce3ae53f8",
              street: "Avenida Paulista",
              number: "1000",
              complement: "Sala 501",
              neighborhood: "Bela Vista",
              city: "São Paulo",
              state: "SP",
              zip_code: "01310-100",
              created_at: "2025-06-22T10:15:30.992111-03:00",
              updated_at: "2025-06-22T10:15:30.994914-03:00",
            },
            active: false,
            franchise: false,
            timezone: "America/Sao_Paulo",
            first_billing_date: "2025-01-15",
            created_at: "2025-06-22T10:15:30.053768-03:00",
            updated_at: "2025-06-22T10:15:30.053781-03:00",
          },
          phones: [
            {
              id: "abd1645b-cdf2-478c-9125-0a202f760b9a",
              clinic_id: "bf1afb8e-61bb-454b-82a1-18c57de9b939",
              phone_number: "(11) 3456-7890",
              phone_type: "primary",
              created_at: "2025-06-22T10:15:30.062291-03:00",
              updated_at: "2025-06-22T10:15:30.062305-03:00",
            },
          ],
        },
      ],
    },
  ],
  total: 3,
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

export default function UsersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  const [usersData, setUsersData] = useState<UsersResponse>(mockUsers)

  const filteredUsers = useMemo(() => {
    let filtered = usersData.results

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    if (statusFilter !== "all") {
      const isActive = statusFilter === "active"
      filtered = filtered.filter((user) => user.is_active === isActive)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.clinics.some((clinic) => clinic.name.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    return filtered
  }, [usersData.results, roleFilter, statusFilter, searchTerm])

  const paginatedUsers = useMemo(() => {
    const startIndex = (page - 1) * pageSize
    return filteredUsers.slice(startIndex, startIndex + pageSize)
  }, [filteredUsers, page, pageSize])

  const totalPages = Math.ceil(filteredUsers.length / pageSize)

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setUsersData((prev) => ({
        ...prev,
        results: prev.results.map((user) =>
          user.id === userId ? { ...user, is_active: !currentStatus, updated_at: new Date().toISOString() } : user,
        ),
      }))

      toast({
        title: currentStatus ? "Usuário desativado" : "Usuário ativado",
        description: `O usuário foi ${currentStatus ? "desativado" : "ativado"} com sucesso.`,
      })
    } catch (error) {
      toast({
        title: "Erro ao alterar status",
        description: "Ocorreu um erro ao tentar alterar o status do usuário.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const summary = useMemo(() => {
    const total = usersData.results.length
    const admins = usersData.results.filter((u) => u.role === "admin").length
    const clinics = usersData.results.filter((u) => u.role === "clinic").length
    const active = usersData.results.filter((u) => u.is_active).length
    const inactive = usersData.results.filter((u) => !u.is_active).length

    return { total, admins, clinics, active, inactive }
  }, [usersData.results])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Usuários do Sistema</h1>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
          <p className="text-muted-foreground">Gerencie todos os usuários administradores e clínicas do sistema</p>
        </div>
        <Button onClick={() => router.push("/admin/usuarios/novo")}>
          <Users className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{summary.total}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold text-purple-600">{summary.admins}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clínicas</p>
                <p className="text-2xl font-bold text-blue-600">{summary.clinics}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ativos</p>
                <p className="text-2xl font-bold text-green-600">{summary.active}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inativos</p>
                <p className="text-2xl font-bold text-red-600">{summary.inactive}</p>
              </div>
              <UserX className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela principal */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Lista de Usuários
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {user.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {user.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      {user.clinics.length > 0 ? (
                        <div className="space-y-1">
                          {user.clinics.slice(0, 2).map((clinic) => (
                            <div key={clinic.id} className="flex items-center gap-2">
                              <Building2 className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{clinic.name}</span>
                            </div>
                          ))}
                          {user.clinics.length > 2 && (
                            <p className="text-xs text-muted-foreground">+{user.clinics.length - 2} mais</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate max-w-[200px]">{user.email}</span>
                        </div>
                        {user.clinics.length > 0 && user.clinics[0].phones.length > 0 && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{user.clinics[0].phones[0].phone_number}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(user.is_active)}</TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{formatDate(user.created_at)}</span>
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
                          <DropdownMenuItem onClick={() => router.push(`/admin/usuarios/${user.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/admin/usuarios/${user.id}/editar`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
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
                                  Tem certeza que deseja {user.is_active ? "desativar" : "ativar"} o usuário "
                                  {user.name}"?{" "}
                                  {user.is_active
                                    ? "Ele não poderá mais acessar o sistema."
                                    : "Ele poderá acessar o sistema novamente."}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleToggleStatus(user.id, user.is_active)}
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Paginação */}
          {filteredUsers.length > 0 ? (
            <div className="flex items-center justify-between px-2 py-4">
              <p className="text-sm text-muted-foreground">
                Mostrando {(page - 1) * pageSize + 1} a {Math.min(page * pageSize, filteredUsers.length)} de{" "}
                {filteredUsers.length} usuários
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
                  <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page <= 1}>
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
                          onClick={() => setPage(pageNumber)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNumber}
                        </Button>
                      )
                    })}
                  </div>

                  <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
                    Próxima
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum usuário encontrado</h3>
              <p className="text-muted-foreground mb-4">Tente ajustar os filtros ou termos de busca</p>
              <Button
                variant="outline"
                onClick={() => {
                  setRoleFilter("all")
                  setStatusFilter("all")
                  setSearchTerm("")
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
