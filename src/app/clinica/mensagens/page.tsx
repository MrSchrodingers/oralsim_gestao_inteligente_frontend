"use client"

import { useState, useMemo } from "react"
import {
  MessageSquare,
  Mail,
  Smartphone,
  MoreHorizontal,
  Copy,
  Download,
  ChevronLeft,
  ChevronRight,
  Workflow,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/common/components/ui/tabs"
import { useFetchMessages, useMessagesSummary } from "@/src/modules/notification/hooks/useMessage"
import { useFetchFlowStepConfigs } from "@/src/modules/notification/hooks/useFlowStepConfig"
import type { IMessage } from "@/src/modules/notification/interfaces/IMessage"
import { extractVariables } from "@/src/common/utils/extractVariables"
import { getChannelBadge } from "@/src/common/components/helpers/GetBadge"
import { formatDate } from "@/src/common/utils/formatters"
import { MessagePreview } from "@/src/common/components/messages/MessagePreview"
import { FlowChart } from "@/src/common/components/messages/FlowChart"

export default function MessagesPage() {
  const [typeFilter, setTypeFilter] = useState<"all" | "whatsapp" | "sms" | "email" | "phonecall">("all")
  const [stepFilter, setStepFilter] = useState<string>("all")
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(5)

  const queryParams = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p: Record<string, any> = { page, page_size: pageSize }
    if (typeFilter !== "all") p.type = typeFilter
    if (stepFilter !== "all") p.step = Number(stepFilter)
    return p
  }, [page, pageSize, typeFilter, stepFilter])

  const { data: messagesData, isFetching, refetch } = useFetchMessages(queryParams)
  const { data: summary } = useMessagesSummary()
  const { data: flowStepData } = useFetchFlowStepConfigs()

  const messages: IMessage[] = messagesData?.results ?? []
  const totalItems = messagesData?.total_items ?? 0
  const totalPages = messagesData?.total_pages ?? Math.ceil((summary?.total ?? 0) / pageSize)

  const copyMessage = (content: string) => navigator.clipboard.writeText(content)

  const handleTypeChange = (value: string) => {
    setTypeFilter(value as "all" | "whatsapp" | "sms" | "email" | "phonecall")
    setPage(1)
  }
  const handleStepChange = (value: string) => {
    setStepFilter(value)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mensagens</h1>
          <p className="text-muted-foreground">
            Gerencie todas as mensagens do sistema de cobrança e notificações
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button variant="outline" disabled>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total de Mensagens</p>
              <p className="text-2xl font-bold">{summary?.total}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">WhatsApp</p>
              <p className="text-2xl font-bold text-green-600">{summary?.whatsapp}</p>
            </div>
            <Smartphone className="h-8 w-8 text-green-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">SMS</p>
              <p className="text-2xl font-bold text-blue-600">{summary?.sms}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">E-mail</p>
              <p className="text-2xl font-bold text-purple-600">{summary?.email}</p>
            </div>
            <Mail className="h-8 w-8 text-purple-600" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Mensagens
          </TabsTrigger>
          <TabsTrigger value="flowchart" className="flex items-center gap-2">
            <Workflow className="h-4 w-4" /> Fluxograma
          </TabsTrigger>
        </TabsList>

        {/* Lista de Mensagens */}
        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" /> Lista de Mensagens
              </CardTitle>
              <div className="flex gap-2 w-full lg:w-auto">
                <Select value={typeFilter} onValueChange={handleTypeChange}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="email">E-mail</SelectItem>
                    <SelectItem value="phonecall">Ligação</SelectItem>
                    <SelectItem value="letter">Carta Amigável</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={stepFilter} onValueChange={handleStepChange}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Step" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas Etapas</SelectItem>
                    {flowStepData?.results
                      .map((fs) => fs.step_number)
                      .filter((v, i, a) => a.indexOf(v) === i)
                      .sort((a, b) => a - b)
                      .map((step) => (
                        <SelectItem key={step} value={step.toString()}>
                          Etapa {step}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent>
              {/* Tabela */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Etapa</TableHead>
                      <TableHead>Conteúdo</TableHead>
                      <TableHead>Variáveis</TableHead>
                      <TableHead>Última Atualização</TableHead>
                      <TableHead className="w-[50px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map((message) => {
                      const variables = extractVariables(message.content)
                      return (
                        <TableRow key={message.id}>
                          <TableCell>{getChannelBadge(message.type)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">Etapa {message.step}</Badge>
                          </TableCell>
                          <TableCell className="max-w-md">
                            <div className="truncate">
                              {message.type === "email"
                                ? message.content.replace(/<[^>]*>/g, "").slice(0, 100)
                                : message.content.slice(0, 100)}
                              {message.content.length > 100 && "..."}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {variables.slice(0, 3).map((v, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {v}
                                </Badge>
                              ))}
                              {variables.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{variables.length - 3}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(message.updated_at)}
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
                                <DropdownMenuItem asChild>
                                  <MessagePreview message={message} />
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => copyMessage(message.content)}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copiar Conteúdo
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação */}
              {totalItems > 0 ? (
                <div className="flex items-center justify-between px-2 py-4">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {(page - 1) * pageSize + 1} a{" "}
                    {(page - 1) * pageSize + messages.length} de {totalItems} mensagens
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">Itens por página:</p>
                      <Select
                        value={pageSize.toString()}
                        onValueChange={(v) => {
                          setPageSize(Number(v))
                          setPage(1)
                        }}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[5, 10, 25, 50].map((n) => (
                            <SelectItem key={n} value={n.toString()}>
                              {n}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      disabled={page <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" /> Anterior
                    </Button>

                    {/* botões de página */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .slice(
                          Math.max(0, page - 3),
                          Math.min(totalPages, page + 2)
                        )
                        .map((i) => (
                          <Button
                            key={i}
                            variant={i === page ? "default" : "outline"}
                            size="sm"
                            className="w-8 h-8 p-0"
                            onClick={() => setPage(i)}
                          >
                            {i}
                          </Button>
                        ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                      disabled={page >= totalPages}
                    >
                      Próxima <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma mensagem encontrada</h3>
                  <p className="text-muted-foreground mb-4">
                    Tente ajustar os filtros ou termos de busca
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTypeFilter("all")
                      setStepFilter("all")
                    }}
                  >
                    Limpar Filtros
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fluxograma */}
        <TabsContent value="flowchart" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <FlowChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
