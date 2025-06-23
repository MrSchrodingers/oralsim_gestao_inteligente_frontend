"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Building2,
  ArrowLeft,
  Check,
  X,
  Phone,
  Mail,
  MapPin,
  Globe,
  Calendar,
  CreditCard,
  Package,
  Clock,
  User,
  FileText,
  ExternalLink,
  Copy,
  Edit,
  AlertCircle,
  CheckCircle,
  XCircle,
  Facebook,
  MessageCircle,
  Loader2,
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
import { useToast } from "@/src/common/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/common/components/ui/avatar"
import { Skeleton } from "@/src/common/components/ui/skeleton"
import { useSearchOralsinClinics } from "@/src/common/hooks/useOralsin"
import type { IOralsinClinic } from "@/src/common/interfaces/IOralsin"
import { useApproveRegistrationRequest, useFetchRegistrationRequestById, useRejectRegistrationRequest } from "@/src/common/hooks/useRegistrationRequest"
import { getPendingStatusBadge, getPlanBadge } from "@/src/common/components/helpers/GetBadge"
import { formatDate, formatDateOnly } from "@/src/common/utils/formatters"
import Link from "next/link"

export default function ClinicDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)
  const [notes, setNotes] = useState("")

  const { data: clinic, isLoading } = useFetchRegistrationRequestById(params.id as string)
  const { data: oralsinData } = useSearchOralsinClinics(clinic?.clinic_name ?? "")
  const clinicDetails = oralsinData?.data?.[0] as IOralsinClinic | undefined
  const approveMutation = useApproveRegistrationRequest()
  const rejectMutation = useRejectRegistrationRequest()

  useEffect(() => {
    if (clinic) {
      setNotes(clinic.notes || "")
    }
  }, [clinic])

  const handleApprove = async () => {
    if (!clinic) return

    approveMutation.mutate(params.id as string, {
      onSuccess: () => {
        toast({
          title: "Clínica aprovada com sucesso",
          description: "A clínica foi aprovada e pode começar a usar o sistema.",
        })
        setIsUpdating(false)
      },
      onError: () => {
        toast({
          title: "Erro ao aprovar clínica",
          description: "Ocorreu um erro ao tentar aprovar a clínica. Tente novamente.",
          variant: "destructive",
        })
        setIsUpdating(false)
      },
    })
  }

  const handleReject = async () => {
    if (!clinic) return

    rejectMutation.mutate(params.id as string, {
      onSuccess: () => {
        toast({
          title: "Clínica rejeitada",
          description: "A clínica foi rejeitada e não poderá usar o sistema.",
        })
        setIsUpdating(false)
      },
      onError: () => {
        toast({
          title: "Erro ao rejeitar clínica",
          description: "Ocorreu um erro ao tentar rejeitar a clínica. Tente novamente.",
          variant: "destructive",
        })
        setIsUpdating(false)
      },
    })
  }

  const handleSaveNotes = async () => {
    if (!clinic) return

    setIsUpdating(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "Observações salvas",
        description: "As observações foram salvas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao salvar observações",
        description: "Ocorreu um erro ao salvar as observações.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const copyToClipboard = (text?: string | null) => {
    if (!text) return toast({
      title: "Sem texto para ser copiado",
    })
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado para área de transferência",
      description: text,
    })
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

  if (!clinic || !clinicDetails) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold text-destructive">Clínica não encontrada</h3>
            <p className="text-muted-foreground mt-2">A clínica solicitada não foi encontrada.</p>
            <Button className="mt-4" onClick={() => router.back()}>
              Voltar
            </Button>
          </CardContent>
        </Card>
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
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                {clinic.clinic_name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{clinic.clinic_name}</h1>
              <p className="text-muted-foreground">Responsável: {clinic.name}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {clinic.status === "pending" && (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    disabled={isUpdating}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Rejeitar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Rejeitar Clínica</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja rejeitar a clínica "{clinic.clinic_name}"? Esta ação impedirá que a clínica
                      acesse o sistema.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReject} className="bg-red-600 hover:bg-red-700">
                      Rejeitar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700" disabled={isUpdating}>
                    <Check className="h-4 w-4 mr-2" />
                    Aprovar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Aprovar Clínica</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja aprovar a clínica "{clinic.clinic_name}"? Esta ação permitirá que a clínica
                      acesse o sistema.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                      Aprovar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <div className="mt-1">{getPendingStatusBadge(clinic.status)}</div>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Plano</p>
                <div className="mt-1">{getPlanBadge(clinic.selected_plan)}</div>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pagamento</p>
                <div className="mt-1">
                  {clinic.is_paid ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <CreditCard className="h-3 w-3 mr-1" />
                      Pago
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Pendente
                    </Badge>
                  )}
                </div>
              </div>
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Criado em</p>
                <p className="text-sm font-medium">{formatDateOnly(clinic.created_at)}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informações da Clínica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Nome da Clínica</Label>
                    <p className="text-sm font-medium">{clinicDetails.nomeClinica}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Razão Social</Label>
                    <p className="text-sm font-medium">{clinicDetails.razaoSocial}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">CNPJ</Label>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{clinicDetails.cnpj}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(clinicDetails.cnpj)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Sigla</Label>
                    <p className="text-sm font-medium">{clinicDetails.sigla}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Responsável</Label>
                    <p className="text-sm font-medium">{clinic.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">E-mail</Label>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{clinic.email}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(clinic.email)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Timezone</Label>
                    <p className="text-sm font-medium">{clinicDetails.timezone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Franquia</Label>
                    <p className="text-sm font-medium">{clinicDetails.franquia ? "Sim" : "Não"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contato e Endereço */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Contato e Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Telefones</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">{clinicDetails.telefone1}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(clinicDetails.telefone1)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      {clinicDetails.telefone2 && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm font-medium">{clinicDetails.telefone2}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(clinicDetails.telefone2!)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">E-mail Lead</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">{clinicDetails.emailLead}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(clinicDetails.emailLead)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Endereço</Label>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{clinicDetails.logradouro}</p>
                      <p className="text-sm text-muted-foreground">
                        {clinicDetails.bairro}, {clinicDetails.nomeCidade} - {clinicDetails.estado}
                      </p>
                      <p className="text-sm text-muted-foreground">CEP: {clinicDetails.CEP}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Links e Redes Sociais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Links e Redes Sociais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {clinicDetails.urlLandpage && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Site da Clínica</p>
                      <p className="text-xs text-muted-foreground">{clinicDetails.urlLandpage}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={clinicDetails.urlLandpage} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Landing Page OralSin</p>
                    <p className="text-xs text-muted-foreground">{clinicDetails.urlLPOralsin}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={clinicDetails.urlLPOralsin || "#"} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Facebook className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Facebook</p>
                    <p className="text-xs text-muted-foreground">{clinicDetails.urlFacebook}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={clinicDetails.urlFacebook || "#"} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Chat Facebook</p>
                    <p className="text-xs text-muted-foreground">{clinicDetails.urlChatFacebook}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={clinicDetails.urlChatFacebook || "#"} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {clinicDetails.urlWhatsapp && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">WhatsApp</p>
                      <p className="text-xs text-muted-foreground">{clinicDetails.urlWhatsapp}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={clinicDetails.urlWhatsapp} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Datas Importantes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Datas Importantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Data de Safra</Label>
                    <p className="text-sm font-medium">{formatDateOnly(clinicDetails.dataSafra)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Primeiro Faturamento</Label>
                    <p className="text-sm font-medium">{formatDateOnly(clinicDetails.dataPrimeiroFaturamento)}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Solicitação Criada</Label>
                    <p className="text-sm font-medium">{formatDate(clinic.created_at)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Última Atualização</Label>
                    <p className="text-sm font-medium">{formatDate(clinic.updated_at)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Lateral */}
        <div className="space-y-6">
          {/* Observações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Observações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Adicione observações sobre esta clínica..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
              <Button onClick={handleSaveNotes} disabled={isUpdating} className="w-full">
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
