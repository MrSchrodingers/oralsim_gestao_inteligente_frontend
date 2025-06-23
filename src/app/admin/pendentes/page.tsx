"use client"

import { useState, useMemo } from "react"
import {
  Building2,
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  Eye,
  Check,
  X,
  Clock,
  CreditCard,
  Package,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/src/common/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/common/components/ui/dialog"
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
import { Skeleton } from "@/src/common/components/ui/skeleton"
import type { IPagedResponse } from "@/src/common/interfaces/IPagedResponse"
import type { IPendingClinic } from "@/src/common/interfaces/IPendingClinic"
import type { IOralsinClinic, IOralsinPagedResponse } from "@/src/common/interfaces/IOralsin"
import { formatDate } from "@/src/common/utils/formatters"

const mockPendingClinics: IPagedResponse<IPendingClinic> = {
  results: [
    {
      id: "74dfa454-db54-42d7-a858-16b6e85ebe2a",
      email: "bauru@oralsin.admin.com.br",
      name: "Dr. Matheus Munhoz",
      clinic_name: "Bauru",
      status: "pending",
      created_at: "2025-06-23T11:29:04.005013-03:00",
      updated_at: "2025-06-23T11:29:04.005035-03:00",
      is_paid: false,
      selected_plan: "premium",
    },
    {
      id: "84dfa454-db54-42d7-a858-16b6e85ebe2b",
      email: "saopaulo@oralsin.admin.com.br",
      name: "Dra. Ana Silva",
      clinic_name: "São Paulo Centro",
      status: "pending",
      created_at: "2025-06-22T10:15:30.005013-03:00",
      updated_at: "2025-06-22T10:15:30.005035-03:00",
      is_paid: true,
      selected_plan: "basic",
    },
  ],
  total_items: 2,
  items_on_page: 2,
  page: 1,
  page_size: 50,
  total_pages: 1,
}

const mockClinicDetails: Partial<IOralsinPagedResponse> = {
  current_page: 1,
  data: [
    {
      idClinica: 47,
      nomeClinica: "Bauru",
      razaoSocial: "P. A. T. YANASE ODONTOLOGIA",
      sigla: "BAU",
      estado: "SP",
      idCidade: 4716,
      logradouro: "Rua Engenheiro Saint Martin, 17-45",
      CEP: "17015-351",
      ddd: "14",
      telefone1: "(14) 3012-9449",
      telefone2: null,
      bairro: "Centro",
      cnpj: "26.411.050/0001-55",
      ativo: 1,
      franquia: 1,
      timezone: "America/Sao_Paulo",
      dataSafra: "2017-03-13",
      dataPrimeiroFaturamento: "2017-03-20",
      programaIndicaSin: 1,
      exibeLPOralsin: 1,
      urlLandpage: null,
      urlLPOralsin: "https://www.oralsin.com.br/bauru",
      urlFacebook: "https://www.facebook.com/OralSinBauru",
      urlChatFacebook: "https://m.me/OralSinBauru",
      urlWhatsapp: null,
      emailLead: "bauru@oralsin.com.br",
      nomeCidade: "Bauru",
    },
  ],
  total: 1,
}


const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          Pendente
        </Badge>
      )
    case "approved":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Aprovada
        </Badge>
      )
    case "rejected":
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Rejeitada
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const getPlanBadge = (plan?: string) => {
  if (!plan) return <Badge variant="outline">Não definido</Badge>

  switch (plan) {
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
      return <Badge variant="outline">{plan}</Badge>
  }
}

function ClinicDetailsModal({ clinic }: { clinic: IPendingClinic }) {
  const [isLoading, setIsLoading] = useState(false)
  const [clinicDetails, setClinicDetails] = useState<IOralsinClinic | null>(null)

  const loadClinicDetails = async () => {
    setIsLoading(true)
    try {
      // Simular chamada da API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setClinicDetails(mockClinicDetails?.data?.[0] || null)
    } catch (error) {
      console.error("Erro ao carregar detalhes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={loadClinicDetails}>
          <Eye className="h-4 w-4 mr-2" />
          Ver Detalhes
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Detalhes da Clínica
          </DialogTitle>
          <DialogDescription>Informações completas da clínica {clinic.clinic_name}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : clinicDetails ? (
          <div className="space-y-6">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground">INFORMAÇÕES BÁSICAS</h4>
                <div className="space-y-1">
                  <p>
                    <span className="font-medium">Nome:</span> {clinicDetails.nomeClinica}
                  </p>
                  <p>
                    <span className="font-medium">Razão Social:</span> {clinicDetails.razaoSocial}
                  </p>
                  <p>
                    <span className="font-medium">CNPJ:</span> {clinicDetails.cnpj}
                  </p>
                  <p>
                    <span className="font-medium">Sigla:</span> {clinicDetails.sigla}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground">CONTATO</h4>
                <div className="space-y-1">
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {clinicDetails.telefone1}
                  </p>
                  {clinicDetails.telefone2 && (
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {clinicDetails.telefone2}
                    </p>
                  )}
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {clinicDetails.emailLead}
                  </p>
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">ENDEREÇO</h4>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1" />
                <div>
                  <p>{clinicDetails.logradouro}</p>
                  <p>
                    {clinicDetails.bairro}, {clinicDetails.nomeCidade} - {clinicDetails.estado}
                  </p>
                  <p>CEP: {clinicDetails.CEP}</p>
                </div>
              </div>
            </div>

            {/* Links e Redes Sociais */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">LINKS E REDES SOCIAIS</h4>
              <div className="space-y-1">
                {clinicDetails.urlLPOralsin && (
                  <p>
                    <span className="font-medium">Landing Page:</span>
                    <a
                      href={clinicDetails.urlLPOralsin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-1"
                    >
                      {clinicDetails.urlLPOralsin}
                    </a>
                  </p>
                )}
                {clinicDetails.urlFacebook && (
                  <p>
                    <span className="font-medium">Facebook:</span>
                    <a
                      href={clinicDetails.urlFacebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-1"
                    >
                      {clinicDetails.urlFacebook}
                    </a>
                  </p>
                )}
              </div>
            </div>

            {/* Informações Adicionais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground">CONFIGURAÇÕES</h4>
                <div className="space-y-1">
                  <p>
                    <span className="font-medium">Ativo:</span> {clinicDetails.ativo ? "Sim" : "Não"}
                  </p>
                  <p>
                    <span className="font-medium">Franquia:</span> {clinicDetails.franquia ? "Sim" : "Não"}
                  </p>
                  <p>
                    <span className="font-medium">Timezone:</span> {clinicDetails.timezone}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground">DATAS IMPORTANTES</h4>
                <div className="space-y-1">
                  <p>
                    <span className="font-medium">Data Safra:</span>{" "}
                    {new Date(clinicDetails?.dataSafra || "").toLocaleDateString("pt-BR")}
                  </p>
                  <p>
                    <span className="font-medium">Primeiro Faturamento:</span>{" "}
                    {new Date(clinicDetails?.dataPrimeiroFaturamento || "").toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Não foi possível carregar os detalhes da clínica</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default function ClinicApprovalPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [planFilter, setPlanFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Mock data - substitua pela sua lógica de fetch real
  const [clinicsData, setClinicsData] = useState<IPagedResponse<IPendingClinic>>(mockPendingClinics)

  const filteredClinics = useMemo(() => {
    let filtered = clinicsData.results

    if (statusFilter !== "all") {
      filtered = filtered.filter((clinic) => clinic.status === statusFilter)
    }

    if (planFilter !== "all") {
      filtered = filtered.filter((clinic) => clinic.selected_plan === planFilter)
    }

    return filtered
  }, [clinicsData.results, statusFilter, planFilter])

  const handleApprove = async (clinicId: string) => {
    setIsLoading(true)
    try {
      // Simular chamada da API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setClinicsData((prev) => ({
        ...prev,
        results: prev.results.map((clinic) =>
          clinic.id === clinicId
            ? { ...clinic, status: "approved" as const, updated_at: new Date().toISOString() }
            : clinic,
        ),
      }))

      toast({
        title: "Clínica aprovada com sucesso",
        description: "A clínica foi aprovada e pode começar a usar o sistema.",
      })
    } catch (error) {
      toast({
        title: "Erro ao aprovar clínica",
        description: "Ocorreu um erro ao tentar aprovar a clínica. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async (clinicId: string) => {
    setIsLoading(true)
    try {
      // Simular chamada da API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setClinicsData((prev) => ({
        ...prev,
        results: prev.results.map((clinic) =>
          clinic.id === clinicId
            ? { ...clinic, status: "rejected" as const, updated_at: new Date().toISOString() }
            : clinic,
        ),
      }))

      toast({
        title: "Clínica rejeitada",
        description: "A clínica foi rejeitada e não poderá usar o sistema.",
      })
    } catch (error) {
      toast({
        title: "Erro ao rejeitar clínica",
        description: "Ocorreu um erro ao tentar rejeitar a clínica. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const summary = useMemo(() => {
    const total = clinicsData.results.length
    const pending = clinicsData.results.filter((c) => c.status === "pending").length
    const approved = clinicsData.results.filter((c) => c.status === "approved").length
    const rejected = clinicsData.results.filter((c) => c.status === "rejected").length
    const paid = clinicsData.results.filter((c) => c.is_paid).length

    return { total, pending, approved, rejected, paid }
  }, [clinicsData.results])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Aprovação de Clínicas</h1>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
          <p className="text-muted-foreground">Gerencie as solicitações de cadastro de novas clínicas no sistema</p>
        </div>
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
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{summary.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aprovadas</p>
                <p className="text-2xl font-bold text-green-600">{summary.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejeitadas</p>
                <p className="text-2xl font-bold text-red-600">{summary.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pagas</p>
                <p className="text-2xl font-bold text-blue-600">{summary.paid}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela principal */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Lista de Clínicas
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="approved">Aprovadas</SelectItem>
                  <SelectItem value="rejected">Rejeitadas</SelectItem>
                </SelectContent>
              </Select>
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por plano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os planos</SelectItem>
                  <SelectItem value="basic">Básico</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
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
                  <TableHead>Clínica</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClinics.map((clinic) => (
                  <TableRow key={clinic.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {clinic.clinic_name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{clinic.clinic_name}</p>
                          <p className="text-sm text-muted-foreground">ID: {clinic.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{clinic.name}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate max-w-[200px]">{clinic.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(clinic.status)}</TableCell>
                    <TableCell>{getPlanBadge(clinic.selected_plan)}</TableCell>
                    <TableCell>
                      {clinic.is_paid ? (
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        >
                          <CreditCard className="h-3 w-3 mr-1" />
                          Pago
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Pendente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{formatDate(clinic.created_at)}</span>
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
                          <ClinicDetailsModal clinic={clinic} />
                          {clinic.status === "pending" && (
                            <>
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Check className="h-4 w-4 mr-2 text-green-600" />
                                    Aprovar
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Aprovar Clínica</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja aprovar a clínica "{clinic.clinic_name}"? Esta ação
                                      permitirá que a clínica acesse o sistema.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleApprove(clinic.id)}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      Aprovar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <X className="h-4 w-4 mr-2 text-red-600" />
                                    Rejeitar
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Rejeitar Clínica</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja rejeitar a clínica "{clinic.clinic_name}"? Esta ação
                                      impedirá que a clínica acesse o sistema.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleReject(clinic.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Rejeitar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Paginação */}
          {filteredClinics.length > 0 ? (
            <div className="flex items-center justify-between px-2 py-4">
              <p className="text-sm text-muted-foreground">
                Mostrando {(page - 1) * pageSize + 1} a {Math.min(page * pageSize, filteredClinics.length)} de{" "}
                {filteredClinics.length} clínicas
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

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= Math.ceil(filteredClinics.length / pageSize)}
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma clínica encontrada</h3>
              <p className="text-muted-foreground mb-4">Tente ajustar os filtros ou aguarde novas solicitações</p>
              <Button
                variant="outline"
                onClick={() => {
                  setStatusFilter("all")
                  setPlanFilter("all")
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
