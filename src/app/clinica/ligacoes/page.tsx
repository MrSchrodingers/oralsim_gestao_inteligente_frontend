"use client"

import { useState, useMemo } from "react"
import {
  Phone,
  PhoneCall,
  MoreHorizontal,
  User,
  DollarSign,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  PhoneOutgoing,
  MessageSquare,
  Download,
  RefreshCw,
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
import { useToast } from "@/src/common/components/ui/use-toast"
import { HeartRateTableLoading } from "@/src/common/components/ui/heart-rate-table-loading"
import { formatCurrency, formatDateTime, formatPhone } from "@/src/common/utils/formatters"
import { getPriorityBadge, getStepBadge } from "@/src/common/components/helpers/GetBadge"
import { CallCompletionDialog } from "@/src/common/components/calls/CallCompletionDialog"
import { useFetchPendingCalls, usePendingCallsSummary, useUpdatePendingCall } from "@/src/modules/notification/hooks/usePendingCall"
import { StatsCardsSkeleton } from "@/src/common/components/calls/StatsCardsSkeleton"
import { PendingCallsSkeleton } from "@/src/common/components/calls/PendingCallsSkeleton"
import { useRouter } from "next/navigation"
import { useFetchInstallments } from "@/src/common/hooks/useInstallment"

export default function PendingCallsPage() {
  const router = useRouter()
  const [stepFilter, setStepFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [isMutating, setIsMutating] = useState(false)
  const { toast } = useToast()

  const handleCopyPhone = (phoneNumber: string) => {
    navigator.clipboard.writeText(phoneNumber.replace(/\D/g, ""))
    toast({
      title: "Número copiado para área de trasnferência",
      description: formatPhone(phoneNumber),
    })
  }

  const {
    data: pendingCallsData,
    isLoading: isLoadingCalls,
    isFetching: isFetchingCalls,
    isError: isErrorCalls,
    refetch
  } = useFetchPendingCalls({ page, page_size: pageSize })

  const { data: summary, isLoading: isLoadingSummary, isError: isErrorSummary } = usePendingCallsSummary()

  const { mutateAsync: updatePendingCall } = useUpdatePendingCall()

  const isInitialLoading = isLoadingCalls || isLoadingSummary
  const isRefetching = !isLoadingCalls && isFetchingCalls
  const hasError = isErrorCalls || isErrorSummary
  const pendingCalls = useMemo(() => pendingCallsData?.results ?? [], [pendingCallsData])

  const contractsIds = pendingCalls.map(call => call.contract.id) ?? []
  const { data: installmentsData } = useFetchInstallments(contractsIds.length > 0 ? { contract_id: contractsIds.join(",") } : undefined)
  const installments = installmentsData?.results ?? []

  const filteredCalls = useMemo(() => {
    let calls = pendingCalls
    if (stepFilter !== "all") {
      calls = calls.filter((c) => c.current_step === +stepFilter)
    }
    if (priorityFilter !== "all") {
      calls = calls.filter((call) => {
        const overdue = +call.contract.overdue_amount
        if (priorityFilter === "high") return call.attempts >= 2 || overdue > 1000
        if (priorityFilter === "medium")
          return (call.attempts >= 1 && call.attempts < 2) || (overdue > 500 && overdue <= 1000)
        return call.attempts === 0 && overdue <= 500
      })
    }
    return calls
  }, [pendingCalls, stepFilter, priorityFilter])

  const stats = [
    {
      label: "Total de Ligações",
      value: summary?.total ?? 0,
      icon: <Phone className="h-8 w-8 mt-5 text-muted-foreground" />,
      color: "text-muted-foreground",
    },
    {
      label: "Alta Prioridade",
      value: summary?.high ?? 0,
      icon: <AlertCircle className="h-8 w-8 mt-5 text-red-600" />,
      color: "text-red-600",
    },
    {
      label: "Valor em Atraso",
      value: formatCurrency((summary?.total_overdue ?? 0).toString()),
      icon: <DollarSign className="h-8 w-8 mt-5 text-orange-600" />,
      color: "text-orange-600",
    },
    {
      label: "Média de Tentativas",
      value: summary?.avg_attempts?.toFixed(1) ?? "0",
      icon: <PhoneOutgoing className="h-8 w-8 mt-5 text-blue-600" />,
      color: "text-blue-600",
    },
  ]

  // Ações otimizadas
  const handleCallCompletion = async (callId: string, success: boolean, notes: string) => {
    setIsMutating(true)
    try {
      await updatePendingCall({
        id: callId,
        data: { status: success ? "done" : "failed", result_notes: notes },
      })
      toast({
        title: "Ligação registrada",
        description: success ? "Concluída com sucesso" : "Tentativa registrada",
      })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível registrar a ligação",
        variant: "destructive",
      })
    } finally {
      setIsMutating(false)
    }
  }

  const clearFilters = () => {
    setStepFilter("all")
    setPriorityFilter("all")
    setPage(1)
  }

  // Tratamento de erro
  if (hasError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-6">
              <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
              <h3 className="text-lg font-semibold text-destructive mb-2">Erro ao carregar dados</h3>
              <p className="text-muted-foreground">Não foi possível buscar as ligações pendentes.</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Tentar novamente
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com indicador de loading sutil */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Ligações Pendentes</h1>
            {(isRefetching || isMutating) && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
          <p className="text-muted-foreground">Gerencie as ligações que precisam ser realizadas para os pacientes</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => refetch()} disabled={isFetchingCalls}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetchingCalls ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button variant="outline" disabled>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Cards de estatísticas com skeleton */}
      {isInitialLoading ? (
        <StatsCardsSkeleton />
      ) : (
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${isRefetching ? "opacity-75 transition-opacity" : ""}`}
        >
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  {stat.icon}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tabela de ligações com loading otimizado */}
      <Card>
        <CardHeader className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <PhoneCall className="h-5 w-5" />
            Lista de Ligações Pendentes
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <Select
              value={stepFilter}
              onValueChange={setStepFilter}
              disabled={isInitialLoading || isRefetching || isMutating}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filtrar por etapa" />
              </SelectTrigger>
              <SelectContent>
                    <SelectItem value="all">Todas Etapas</SelectItem>
                    {pendingCalls
                      .map((fC) => fC.current_step)
                      .filter((v, i, a) => a.indexOf(v) === i)
                      .sort((a, b) => a - b)
                      .map((step) => (
                        <SelectItem key={step} value={step.toString()}>
                          Step {step}
                        </SelectItem>
                      ))}
                  </SelectContent>
            </Select>
            <Select
              value={priorityFilter}
              onValueChange={setPriorityFilter}
              disabled={isInitialLoading || isRefetching || isMutating}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Prioridades</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border overflow-hidden">
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

              {/* Loading states diferenciados */}
              {isInitialLoading ? (
                <HeartRateTableLoading colSpan={8} text="Sincronizando ligações pendentes..." size="md" />
              ) : isRefetching ? (
                <PendingCallsSkeleton rows={pageSize} />
              ) : filteredCalls.length === 0 ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <PhoneCall className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Nenhuma ligação pendente</h3>
                      <p className="text-muted-foreground mb-4">
                        Não há ligações pendentes com os filtros selecionados
                      </p>
                      <Button variant="outline" onClick={clearFilters}>
                        Limpar Filtros
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {filteredCalls.map((call) => {
                    const installment = installments
                    .filter(installment => installment.contract_id === call.contract.id)
                    .filter(installment => installment.received === false)
                    .reduce((sum, i) => (sum + Number(i.installment_amount)), 0)

                    console.log(installment)
                    const phone = call.patient.phones?.[0]?.phone_number ?? ""
                    return (
                      <TableRow key={call.id} className={isMutating ? "opacity-60 pointer-events-none" : ""}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {call.patient.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{call.patient.name}</p>
                              <p className="text-sm text-muted-foreground">{formatPhone(call.patient?.phones?.[0]?.phone_number || null)}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-sm">{call.contract.oralsin_contract_id}</p>
                            <p className="text-sm text-muted-foreground">
                              Valor: {formatCurrency(installment)}
                            </p>
                            <p className="text-sm text-red-600 font-medium">
                              Atraso: {formatCurrency(call.contract.overdue_amount)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{getStepBadge(call.current_step)}</TableCell>
                        <TableCell>{getPriorityBadge(call.attempts, String(call.contract.overdue_amount))}</TableCell>
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
                              <Button variant="ghost" size="icon" disabled={isMutating}>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleCopyPhone(phone)}
                              >
                                <Phone className="h-4 w-4 mr-2" />
                                Ligar Agora
                              </DropdownMenuItem>
                              <CallCompletionDialog
                                call={call}
                                onComplete={(success, notes) => handleCallCompletion(call.id, success, notes)}
                              />
                              <DropdownMenuItem
                                onClick={() => {
                                  const raw = call.patient.phones?.[0]?.phone_number || "";
                                  const digits = raw.replace(/\D/g, "");
                                  window.open(`https://wa.me/${digits}`, "_blank");
                                }}
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Enviar WhatsApp
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(`/clinica/pacientes/${call.patient.id}`)
                                }
                              >
                                <User className="h-4 w-4 mr-2" />
                                Ver Paciente
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              )}
            </Table>
          </div>

          {/* Paginação otimizada */}
          {pendingCallsData && pendingCallsData.total_items > 0 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Mostrando {(page - 1) * pageSize + 1} a {Math.min(page * pageSize, pendingCallsData.total_items)} de{" "}
                  {pendingCallsData.total_items} ligações
                </p>
                {isRefetching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
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
                    disabled={isRefetching || isMutating}
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
                    disabled={page <= 1 || isRefetching || isMutating}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= Math.ceil(pendingCallsData.total_items / pageSize) || isRefetching || isMutating}
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
