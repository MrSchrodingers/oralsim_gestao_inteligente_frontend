"use client"

import { useState, useMemo } from "react"
import {
  MessageSquare,
  Mail,
  Smartphone,
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  Workflow,
  PhoneCall,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/common/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/common/components/ui/dialog"

// Mock data baseado no snippet fornecido
const messagesData = {
  results: [
    {
      id: "5b286d04-9058-4c63-9b41-5f89d05c4ff4",
      type: "sms",
      content:
        "Prezado(a) {{ nome }}, seu pagamento de {{ valor }} vence em {{ vencimento }}. Por favor, verifique e efetue o pagamento. Em caso de dúvidas, ligue para {{ telefone }}.",
      step: 0,
      clinic_id: null,
      is_default: true,
      created_at: "2025-06-17T08:40:40.316634-03:00",
      updated_at: "2025-06-17T08:40:40.320590-03:00",
    },
    {
      id: "eeb76a19-92af-441c-93e8-1a47be3baeb9",
      type: "email",
      content:
        "<p>Prezado(a) <strong>{{ nome }}</strong>,</p><p>Este é um lembrete de que seu pagamento no valor de <strong>{{ valor }}</strong> vence em <strong>{{ vencimento }}</strong>.</p><p>Por favor, providencie o pagamento o quanto antes ou entre em contato pelo telefone <strong>{{ telefone }}</strong> para mais informações.</p><p>Atenciosamente,<br/>Equipe de Cobrança</p>",
      step: 0,
      clinic_id: null,
      is_default: true,
      created_at: "2025-06-17T08:40:40.316634-03:00",
      updated_at: "2025-06-17T08:40:40.327397-03:00",
    },
    {
      id: "fb175886-a2fd-4a66-bd52-7c2ad82a14c6",
      type: "whatsapp",
      content:
        "Olá {{ nome }}! 😊\nSeu pagamento de {{ valor }} vence em {{ vencimento }}. Se precisar de ajuda, ligue para {{ telefone }}. Obrigado!",
      step: 0,
      clinic_id: null,
      is_default: true,
      created_at: "2025-06-17T08:40:40.316634-03:00",
      updated_at: "2025-06-17T08:40:40.329873-03:00",
    },
    // Adicionar mais mensagens aqui...
  ],
  total_items: 45,
  page: 1,
  page_size: 50,
  total_pages: 1,
  items_on_page: 45,
}

const flowStepConfig = {
  results: [
    {
      id: "6f7d0f09-0d94-4a98-9c0d-5463a4b71138",
      step_number: 0,
      channels: ["whatsapp"],
      active: true,
      description: "Semana 0: WhatsApp",
      cooldown_days: 7,
      created_at: "2025-06-17T08:40:31.333842-03:00",
      updated_at: "2025-06-17T08:40:31.333861-03:00",
    },
    {
      id: "eea98323-0045-4c89-a578-d8e868275bbb",
      step_number: 1,
      channels: ["whatsapp", "sms"],
      active: true,
      description: "Semana 1: WhatsApp + SMS",
      cooldown_days: 7,
      created_at: "2025-06-17T08:40:31.337084-03:00",
      updated_at: "2025-06-17T08:40:31.337098-03:00",
    },
    {
      id: "0766f4ea-5404-41b6-b050-afd783576510",
      step_number: 2,
      channels: ["whatsapp"],
      active: true,
      description: "Semana 2: WhatsApp",
      cooldown_days: 7,
      created_at: "2025-06-17T08:40:31.341205-03:00",
      updated_at: "2025-06-17T08:40:31.341220-03:00",
    },
    {
      id: "c839da85-7d35-4232-8f37-6cc1379f5a4e",
      step_number: 3,
      channels: ["email"],
      active: true,
      description: "Semana 3: E-mail",
      cooldown_days: 7,
      created_at: "2025-06-17T08:40:31.347243-03:00",
      updated_at: "2025-06-17T08:40:31.347258-03:00",
    },
    {
      id: "4d55ff74-e805-48cb-a0e4-7870173bc506",
      step_number: 4,
      channels: ["whatsapp"],
      active: true,
      description: "Semana 4: WhatsApp",
      cooldown_days: 7,
      created_at: "2025-06-17T08:40:31.349803-03:00",
      updated_at: "2025-06-17T08:40:31.349817-03:00",
    },
    {
      id: "6e6b5734-bb9e-42bd-abac-c6cb7e63a661",
      step_number: 5,
      channels: ["phonecall"],
      active: true,
      description: "Semana 5: Ligação",
      cooldown_days: 7,
      created_at: "2025-06-17T08:40:31.352358-03:00",
      updated_at: "2025-06-17T08:40:31.352373-03:00",
    },
    {
      id: "47ce5b15-288f-489a-bf8a-5da38b09524e",
      step_number: 6,
      channels: ["whatsapp", "sms"],
      active: true,
      description: "Semana 6: WhatsApp + SMS",
      cooldown_days: 7,
      created_at: "2025-06-17T08:40:31.359961-03:00",
      updated_at: "2025-06-17T08:40:31.359976-03:00",
    },
    {
      id: "884e37f5-0109-4cd7-8d06-a30774ff831e",
      step_number: 7,
      channels: ["whatsapp"],
      active: true,
      description: "Semana 7: WhatsApp",
      cooldown_days: 7,
      created_at: "2025-06-17T08:40:31.362274-03:00",
      updated_at: "2025-06-17T08:40:31.362285-03:00",
    },
    {
      id: "7f3f665d-6c60-481b-9999-fca1f9f2e3c5",
      step_number: 8,
      channels: ["whatsapp"],
      active: true,
      description: "Semana 8: WhatsApp",
      cooldown_days: 7,
      created_at: "2025-06-17T08:40:31.364283-03:00",
      updated_at: "2025-06-17T08:40:31.364295-03:00",
    },
    {
      id: "ef82d602-ca2c-4f8b-acc4-7560bbb215a6",
      step_number: 9,
      channels: ["phonecall"],
      active: true,
      description: "Semana 9: Ligação",
      cooldown_days: 7,
      created_at: "2025-06-17T08:40:31.366200-03:00",
      updated_at: "2025-06-17T08:40:31.366210-03:00",
    },
  ],
}

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case "whatsapp":
      return <Smartphone className="h-4 w-4 text-green-600" />
    case "sms":
      return <MessageSquare className="h-4 w-4 text-blue-600" />
    case "email":
      return <Mail className="h-4 w-4 text-purple-600" />
    case "phonecall":
      return <PhoneCall className="h-4 w-4 text-orange-600" />
    default:
      return <MessageSquare className="h-4 w-4" />
  }
}

const getChannelBadge = (channel: string) => {
  const configs = {
    whatsapp: { label: "WhatsApp", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
    sms: { label: "SMS", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
    email: { label: "E-mail", className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
    phonecall: { label: "Ligação", className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
  }

  const config = configs[channel as keyof typeof configs] || { label: channel, className: "bg-gray-100 text-gray-800" }

  return (
    <Badge variant="secondary" className={config.className}>
      {getChannelIcon(channel)}
      <span className="ml-1">{config.label}</span>
    </Badge>
  )
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

const extractVariables = (content: string) => {
  const matches = content.match(/\{\{\s*\w+\s*\}\}/g)
  return matches ? [...new Set(matches)] : []
}

const MessagePreview = ({ message }: { message: any }) => {
  const variables = extractVariables(message.content)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getChannelIcon(message.type)}
            Visualizar Mensagem - Step {message.step}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tipo</label>
              <div className="mt-1">{getChannelBadge(message.type)}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Step</label>
              <p className="mt-1 font-medium">Etapa {message.step}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Variáveis Disponíveis</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {variables.map((variable, index) => (
                <Badge key={index} variant="outline">
                  {variable}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Conteúdo da Mensagem</label>
            <div className="mt-2 p-4 bg-muted rounded-lg">
              {message.type === "email" ? (
                <div dangerouslySetInnerHTML={{ __html: message.content }} />
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">Criado em:</span> {formatDate(message.created_at)}
            </div>
            <div>
              <span className="font-medium">Atualizado em:</span> {formatDate(message.updated_at)}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const FlowChart = () => {
  const stepMessages = useMemo(() => {
    const messagesByStep = new Map()
    messagesData.results.forEach((message) => {
      if (!messagesByStep.has(message.step)) {
        messagesByStep.set(message.step, [])
      }
      messagesByStep.get(message.step).push(message)
    })
    return messagesByStep
  }, [])

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Fluxo de Notificações</h3>
        <p className="text-muted-foreground">Visualize como as mensagens são enviadas em cada etapa do processo</p>
      </div>

      <div className="space-y-4">
        {flowStepConfig.results.map((step, index) => {
          const messages = stepMessages.get(step.step_number) || []

          return (
            <Card key={step.id} className={`${step.active ? "border-primary/20" : "border-muted opacity-60"}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        step.active ? "bg-primary" : "bg-muted-foreground"
                      }`}
                    >
                      {step.step_number}
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{step.description}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {step.cooldown_days} dias
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {step.channels.map((channel, channelIndex) => (
                        <div key={channelIndex}>{getChannelBadge(channel)}</div>
                      ))}
                    </div>

                    {messages.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-muted-foreground">
                          Mensagens nesta etapa ({messages.length})
                        </h5>
                        <div className="grid gap-2">
                          {messages.map((message: any) => (
                            <div
                              key={message.id}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                {getChannelIcon(message.type)}
                                <div>
                                  <p className="text-sm font-medium">
                                    {message.type === "whatsapp"
                                      ? "WhatsApp"
                                      : message.type === "sms"
                                        ? "SMS"
                                        : message.type === "email"
                                          ? "E-mail"
                                          : message.type === "phonecall"
                                            ? "Ligação"
                                            : message.type}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{message.content.substring(0, 50)}...</p>
                                </div>
                              </div>
                              <MessagePreview message={message} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {index < flowStepConfig.results.length - 1 && (
                  <div className="flex justify-center mt-4">
                    <div className="w-px h-8 bg-border"></div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default function MessagesPage() {
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [stepFilter, setStepFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filteredMessages = useMemo(() => {
    return messagesData.results.filter((message) => {
      const matchesType = typeFilter === "all" || message.type === typeFilter
      const matchesStep = stepFilter === "all" || message.step.toString() === stepFilter
      const matchesSearch = searchTerm === "" || message.content.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesType && matchesStep && matchesSearch
    })
  }, [typeFilter, stepFilter, searchTerm])

  const paginatedMessages = useMemo(() => {
    const startIndex = (page - 1) * pageSize
    return filteredMessages.slice(startIndex, startIndex + pageSize)
  }, [filteredMessages, page, pageSize])

  const totalPages = Math.ceil(filteredMessages.length / pageSize)

  const messageStats = useMemo(() => {
    const stats = {
      total: messagesData.results.length,
      whatsapp: messagesData.results.filter((m) => m.type === "whatsapp").length,
      sms: messagesData.results.filter((m) => m.type === "sms").length,
      email: messagesData.results.filter((m) => m.type === "email").length,
      phonecall: messagesData.results.filter((m) => m.type === "phonecall").length,
    }
    return stats
  }, [])

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    // Aqui você pode adicionar um toast de sucesso
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Mensagens</h1>
          </div>
          <p className="text-muted-foreground">Gerencie todas as mensagens do sistema de cobrança e notificações</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline">
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
                <p className="text-sm font-medium text-muted-foreground">Total de Mensagens</p>
                <p className="text-2xl font-bold">{messageStats.total}</p>
              </div>
              <MessageSquare className="h-8 w-8 mt-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">WhatsApp</p>
                <p className="text-2xl font-bold text-green-600">{messageStats.whatsapp}</p>
              </div>
              <Smartphone className="h-8 w-8 mt-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">SMS</p>
                <p className="text-2xl font-bold text-blue-600">{messageStats.sms}</p>
              </div>
              <MessageSquare className="h-8 w-8 mt-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">E-mail</p>
                <p className="text-2xl font-bold text-purple-600">{messageStats.email}</p>
              </div>
              <Mail className="h-8 w-8 mt-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Mensagens
          </TabsTrigger>
          <TabsTrigger value="flowchart" className="flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            Fluxograma
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Lista de Mensagens
                </CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar mensagens..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-64"
                    />
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os tipos</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="phonecall">Ligação</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={stepFilter} onValueChange={setStepFilter}>
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue placeholder="Step" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {Array.from(new Set(messagesData.results.map((m) => m.step)))
                        .sort()
                        .map((step) => (
                          <SelectItem key={step} value={step.toString()}>
                            Step {step}
                          </SelectItem>
                        ))}
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
                      <TableHead>Tipo</TableHead>
                      <TableHead>Step</TableHead>
                      <TableHead>Conteúdo</TableHead>
                      <TableHead>Variáveis</TableHead>
                      <TableHead>Última Atualização</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedMessages.map((message) => {
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
                                ? message.content.replace(/<[^>]*>/g, "").substring(0, 100)
                                : message.content.substring(0, 100)}
                              {message.content.length > 100 && "..."}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {variables.slice(0, 3).map((variable, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {variable}
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
                            <span className="text-sm text-muted-foreground">{formatDate(message.updated_at)}</span>
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
              {filteredMessages.length > 0 && (
                <div className="flex items-center justify-between px-2 py-4">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      Mostrando {(page - 1) * pageSize + 1} a {Math.min(page * pageSize, filteredMessages.length)} de{" "}
                      {filteredMessages.length} mensagens
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

                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = i + 1
                          return (
                            <Button
                              key={pageNum}
                              variant={pageNum === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setPage(pageNum)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNum}
                            </Button>
                          )
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page >= totalPages}
                      >
                        Próxima
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {filteredMessages.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma mensagem encontrada</h3>
                  <p className="text-muted-foreground mb-4">Tente ajustar os filtros ou termos de busca</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTypeFilter("all")
                      setStepFilter("all")
                      setSearchTerm("")
                    }}
                  >
                    Limpar Filtros
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

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
