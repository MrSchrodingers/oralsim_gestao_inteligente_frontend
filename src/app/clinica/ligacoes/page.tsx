"use client"

import { useState, useMemo } from "react"
import {
  Phone,
  PhoneCall,
  MoreHorizontal,
  User,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Target,
  PhoneOutgoing,
  MessageSquare,
  Download,
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
import { Avatar, AvatarFallback } from "@/src/common/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/common/components/ui/dialog"
import { Textarea } from "@/src/common/components/ui/textarea"
import { Label } from "@/src/common/components/ui/label"
import { Separator } from "@/src/common/components/ui/separator"
import { useToast } from "@/src/common/components/ui/use-toast"

// Mock data baseado na estrutura fornecida
const mockPendingCalls = {
  results: [
    {
      id: "5e32f317-28e3-41ed-af2e-7dcb5ed26bd3",
      patient_id: "cb7878f3-2364-4127-adaf-4d5f16f36906",
      contract_id: "6e63a5d2-c032-49ac-b1b0-7f47a5a2c9e2",
      clinic_id: "f61ae6d2-3940-4143-be69-3820a038445b",
      schedule_id: "154944ee-a00f-4cf7-ab10-caf5ff6dfab6",
      current_step: 2,
      scheduled_at: "2025-06-20T09:04:11.884239-03:00",
      last_attempt_at: null,
      attempts: 0,
      status: "pending",
      result_notes: null,
      // Dados relacionados (normalmente viriam de joins ou consultas separadas)
      patient: {
        name: "Maria Silva Santos",
        cpf: "123.456.789-00",
        email: "maria.silva@email.com",
        phone: "(11) 99999-9999",
      },
      contract: {
        oralsin_contract_id: "CTR-2024-001",
        final_contract_value: "2500.00",
        overdue_amount: "450.00",
        remaining_installments: 8,
      },
    },
    {
      id: "0d7cf43d-1396-49db-a64a-f59878cc7411",
      patient_id: "2b4c13f3-f53b-4fe3-94bc-f2491b86d97f",
      contract_id: "76bc7094-04a0-4e7e-b58d-46e378c3435b",
      clinic_id: "f61ae6d2-3940-4143-be69-3820a038445b",
      schedule_id: "d0582a34-678d-4e0a-95ef-4f9c8a5e6d15",
      current_step: 13,
      scheduled_at: "2025-06-20T09:04:11.974993-03:00",
      last_attempt_at: "2025-06-19T14:30:00.000000-03:00",
      attempts: 2,
      status: "pending",
      result_notes: null,
      patient: {
        name: "João Carlos Oliveira",
        cpf: "987.654.321-00",
        email: "joao.carlos@email.com",
        phone: "(11) 88888-8888",
      },
      contract: {
        oralsin_contract_id: "CTR-2024-002",
        final_contract_value: "3200.00",
        overdue_amount: "800.00",
        remaining_installments: 12,
      },
    },
    {
      id: "273f1e1f-a153-465b-b853-c01a7566f22e",
      patient_id: "3013e31f-c831-41d8-a85f-432698a539a3",
      contract_id: "4e4e755b-ab71-44ac-9466-d577398a551f",
      clinic_id: "f61ae6d2-3940-4143-be69-3820a038445b",
      schedule_id: "b5929bb6-5e07-4209-b91b-35785903ea40",
      current_step: 2,
      scheduled_at: "2025-06-20T09:04:12.205374-03:00",
      last_attempt_at: null,
      attempts: 0,
      status: "pending",
      result_notes: null,
      patient: {
        name: "Ana Paula Costa",
        cpf: "456.789.123-00",
        email: "ana.paula@email.com",
        phone: "(11) 77777-7777",
      },
      contract: {
        oralsin_contract_id: "CTR-2024-003",
        final_contract_value: "1800.00",
        overdue_amount: "300.00",
        remaining_installments: 5,
      },
    },
    {
      id: "5ee7cee7-480c-420a-afae-2130175f9665",
      patient_id: "4b303402-d8ba-4fec-af06-bdc69206f9a5",
      contract_id: "b4b71504-76ad-42a9-927c-cb5c28dce65a",
      clinic_id: "f61ae6d2-3940-4143-be69-3820a038445b",
      schedule_id: "379e506f-31cc-42ac-83d9-74c870b62674",
      current_step: 2,
      scheduled_at: "2025-06-20T09:04:12.312999-03:00",
      last_attempt_at: null,
      attempts: 0,
      status: "pending",
      result_notes: null,
      patient: {
        name: "Roberto Ferreira Lima",
        cpf: "789.123.456-00",
        email: "roberto.ferreira@email.com",
        phone: "(11) 66666-6666",
      },
      contract: {
        oralsin_contract_id: "CTR-2024-004",
        final_contract_value: "4200.00",
        overdue_amount: "1200.00",
        remaining_installments: 15,
      },
    },
  ],
  total_items: 4,
  page: 1,
  page_size: 5,
  total_pages: 1,
  items_on_page: 4,
}

const formatCurrency = (value: string) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number.parseFloat(value))
}

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return "N/A"
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr))
}

const formatPhone = (phone: string) => {
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
}

const getStepBadge = (step: number) => {
  const colors = [
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  ]

  return <Badge className={colors[step % colors.length]}>Etapa {step}</Badge>
}

const getPriorityBadge = (attempts: number, overdueAmount: string) => {
  const overdue = Number.parseFloat(overdueAmount)

  if (attempts >= 2 || overdue > 1000) {
    return (
      <Badge variant="destructive">
        <AlertCircle className="h-3 w-3 mr-1" />
        Alta
      </Badge>
    )
  } else if (attempts >= 1 || overdue > 500) {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
        <Clock className="h-3 w-3 mr-1" />
        Média
      </Badge>
    )
  } else {
    return (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        <Target className="h-3 w-3 mr-1" />
        Normal
      </Badge>
    )
  }
}

function CallCompletionDialog({
  call,
  onComplete,
}: { call: any; onComplete: (success: boolean, notes: string) => void }) {
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [open, setOpen] = useState(false)

  const handleSubmit = async (success: boolean) => {
    setIsSubmitting(true)
    try {
      // Simular chamada da API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onComplete(success, notes)
      setOpen(false)
      setNotes("")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <PhoneCall className="h-4 w-4 mr-2" />
          Marcar como Feita
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Ligação</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {call.patient.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{call.patient.name}</p>
                <p className="text-sm text-muted-foreground">{call.patient.phone}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações da ligação</Label>
            <Textarea
              id="notes"
              placeholder="Descreva o resultado da ligação..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button onClick={() => handleSubmit(true)} disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Ligação Realizada
            </Button>
            <Button variant="outline" onClick={() => handleSubmit(false)} disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <AlertCircle className="h-4 w-4 mr-2" />
              )}
              Não Atendeu
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function PendingCallsPage() {
  const [stepFilter, setStepFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Simular dados filtrados
  const filteredCalls = useMemo(() => {
    let filtered = mockPendingCalls.results

    if (stepFilter !== "all") {
      filtered = filtered.filter((call) => call.current_step === Number.parseInt(stepFilter))
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((call) => {
        const overdue = Number.parseFloat(call.contract.overdue_amount)
        if (priorityFilter === "high") {
          return call.attempts >= 2 || overdue > 1000
        } else if (priorityFilter === "medium") {
          return (call.attempts >= 1 && call.attempts < 2) || (overdue > 500 && overdue <= 1000)
        } else {
          return call.attempts === 0 && overdue <= 500
        }
      })
    }

    return filtered
  }, [stepFilter, priorityFilter])

  const handleCallCompletion = async (callId: string, success: boolean, notes: string) => {
    setIsLoading(true)
    try {
      // Simular chamada da API
      const response = await fetch(`/api/calls/${callId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success, notes }),
      })

      if (response.ok) {
        toast({
          title: "Ligação registrada",
          description: success ? "Ligação marcada como realizada com sucesso" : "Tentativa registrada",
        })
        // Aqui você recarregaria os dados
      } else {
        throw new Error("Erro ao registrar ligação")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível registrar a ligação",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const makeCall = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\D/g, "")}`
  }

  // Estatísticas
  const totalCalls = mockPendingCalls.total_items
  const highPriority = filteredCalls.filter(
    (call) => call.attempts >= 2 || Number.parseFloat(call.contract.overdue_amount) > 1000,
  ).length
  const totalOverdue = filteredCalls.reduce((sum, call) => sum + Number.parseFloat(call.contract.overdue_amount), 0)
  const avgAttempts =
    filteredCalls.length > 0
      ? (filteredCalls.reduce((sum, call) => sum + call.attempts, 0) / filteredCalls.length).toFixed(1)
      : "0"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Ligações Pendentes</h1>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
          <p className="text-muted-foreground">Gerencie as ligações que precisam ser realizadas para os pacientes</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" disabled>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Ligações</p>
                <p className="text-2xl font-bold">{totalCalls}</p>
              </div>
              <Phone className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Alta Prioridade</p>
                <p className="text-2xl font-bold text-red-600">{highPriority}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor em Atraso</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalOverdue.toString())}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Média de Tentativas</p>
                <p className="text-2xl font-bold text-blue-600">{avgAttempts}</p>
              </div>
              <PhoneOutgoing className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de ligações */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <PhoneCall className="h-5 w-5" />
              Lista de Ligações Pendentes
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <Select value={stepFilter} onValueChange={setStepFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filtrar por etapa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as etapas</SelectItem>
                  <SelectItem value="2">Etapa 2</SelectItem>
                  <SelectItem value="13">Etapa 13</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
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
                  <TableHead>Paciente</TableHead>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Etapa</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Tentativas</TableHead>
                  <TableHead>Agendado para</TableHead>
                  <TableHead>Última Tentativa</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCalls.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {call.patient.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{call.patient.name}</p>
                          <p className="text-sm text-muted-foreground">{call.patient.phone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{call.contract.oralsin_contract_id}</p>
                        <p className="text-sm text-muted-foreground">
                          Valor: {formatCurrency(call.contract.final_contract_value)}
                        </p>
                        <p className="text-sm text-red-600 font-medium">
                          Atraso: {formatCurrency(call.contract.overdue_amount)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{getStepBadge(call.current_step)}</TableCell>
                    <TableCell>{getPriorityBadge(call.attempts, call.contract.overdue_amount)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{call.attempts}x</Badge>
                        {call.attempts > 0 && <PhoneOutgoing className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{formatDateTime(call.scheduled_at)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {call.last_attempt_at ? formatDateTime(call.last_attempt_at) : "Nunca"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => makeCall(call.patient.phone)}>
                            <Phone className="h-4 w-4 mr-2" />
                            Ligar Agora
                          </DropdownMenuItem>
                          <CallCompletionDialog
                            call={call}
                            onComplete={(success, notes) => handleCallCompletion(call.id, success, notes)}
                          />
                          <DropdownMenuItem disabled>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Enviar WhatsApp
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem disabled>
                            <User className="h-4 w-4 mr-2" />
                            Ver Paciente
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled>
                            <FileText className="h-4 w-4 mr-2" />
                            Ver Contrato
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Paginação */}
          {filteredCalls.length > 0 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Mostrando {(page - 1) * pageSize + 1} a {Math.min(page * pageSize, filteredCalls.length)} de{" "}
                  {filteredCalls.length} ligações
                </p>
              </div>

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
                    disabled={page >= Math.ceil(filteredCalls.length / pageSize)}
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {filteredCalls.length === 0 && (
            <div className="text-center py-12">
              <PhoneCall className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma ligação pendente</h3>
              <p className="text-muted-foreground mb-4">Não há ligações pendentes com os filtros selecionados</p>
              <Button
                variant="outline"
                onClick={() => {
                  setStepFilter("all")
                  setPriorityFilter("all")
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
