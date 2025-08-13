"use client"

import { useCallback, useMemo, useState } from "react"
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Bell,
  BellOff,
  CreditCard,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  PhoneCall,
  MoreHorizontal,
  Download,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Milestone,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/common/components/ui/card"
import { Button } from "@/src/common/components/ui/button"
import { Badge } from "@/src/common/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/common/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/common/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/src/common/components/ui/avatar"
import { Separator } from "@/src/common/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/common/components/ui/dropdownMenu"
import { useParams } from "next/navigation"
import { useFetchPatientById } from "@/src/common/hooks/usePatient"
import { useFetchContracts } from "@/src/common/hooks/useContract"
import { useFetchInstallments } from "@/src/common/hooks/useInstallment"
import { useFetchCollectionCases } from "@/src/modules/cordialBilling/hooks/useCollectionCase"
import { useFetchContactSchedules } from "@/src/modules/notification/hooks/useContactSchedule"
import { useFetchFlowStepConfigs } from "@/src/modules/notification/hooks/useFlowStepConfig"
import { formatCurrency, formatDate, formatDateTime, formatDuration, formatPhone } from "@/src/common/utils/formatters"
import {
  getChannelBadge,
  getContactTypeBadge,
  getContactTypeIcon,
  getFeedbackStatusBadge,
  getFlowBadge,
  getPaymentStatusBadge,
  getSuccessBadge,
  getTriggerBadge
} from "@/src/common/components/helpers/GetBadge"
import {
  PatientInfoSkeleton,
  ContractInfoSkeleton,
  InstallmentsSkeleton,
  PatientHeaderSkeleton,
  StatusCardsSkeleton,
} from "@/src/common/components/patients/skeletons"
import { Input } from "@/src/common/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/common/components/ui/select"
import { useFetchContactHistory } from "@/src/modules/notification/hooks/useContactHistory"
import { useFetchMessages } from "@/src/modules/notification/hooks/useMessage"
import { MessagePreview } from "@/src/common/components/messages/MessagePreview"
import { getDealStageNameById } from "@/src/common/utils/dealStagesMapper"
import { dealStatusMapper, syncStatusMapper } from "@/src/common/utils/statusMappers"
import type { IMessage } from "@/src/modules/notification/interfaces/IMessage"

export default function PatientDetailsPage() {
  // 1. Estado da UI
  const [activeTab, setActiveTab] = useState("overview");
  const [contactHistoryFilter, setContactHistoryFilter] = useState("all");
  const [contactHistorySearch, setContactHistorySearch] = useState("");

  // 2. Roteamento e Parâmetros
  const { id } = useParams<{ id: string }>();

  // 3. Busca de Dados (Data Fetching Layer)
  const { data: patient, refetch: refetchPatient, isFetching: isFetchingPatient } = useFetchPatientById(id);
  const { data: contractsData, refetch: refetchContracts, isFetching: isFetchingContracts } = useFetchContracts({ patient_id: id, page_size: 1 });
  const contract = useMemo(() => contractsData?.results?.[0], [contractsData]);
  const { data: installmentsData, refetch: refetchInstallments, isFetching: isFetchingInstallments } = useFetchInstallments(contract ? { contract_id: contract.id } : undefined);
  const { data: collectionCaseData, refetch: refetchCollectionCases, isFetching: isFetchingCollectionCases } = useFetchCollectionCases({ patient_id: id, page_size: 1 });
  
  const scheduleParams = useMemo(() => ({ patient_id: id, page_size: 1 }), [id]);
  const { data: scheduleData, refetch: refetchSchedules, isFetching: isFetchingSchedules } = useFetchContactSchedules(scheduleParams);
  
  const { data: flowStepsData } = useFetchFlowStepConfigs();
  const { data: contactHistoryData, refetch: refetchHistory, isFetching: isFetchingHistory } = useFetchContactHistory({ patient_id: id, page_size: 20 });

  const contactHistories = useMemo(() => contactHistoryData?.results ?? [], [contactHistoryData]);
  const messageIds = useMemo(() =>
    Array.from(new Set(contactHistories.map(({ message_id }) => message_id).filter(Boolean))),
    [contactHistories]
  );
  
  const { data: messagesData } = useFetchMessages(
    { id__in: messageIds.join(","), page_size: messageIds.length || 1 },
    { enabled: messageIds.length > 0 }
  );

  // 5. Dados Derivados e Transformados (Memoized Derived State)
  const installments = useMemo(() => installmentsData?.results ?? [], [installmentsData]);
  const collectionCase = useMemo(() => collectionCaseData?.results?.[0], [collectionCaseData]);
  const currentStep = useMemo(() => scheduleData?.results?.[0]?.current_step ?? 0, [scheduleData]);
  const flowSteps = useMemo(() => flowStepsData?.results ?? [], [flowStepsData]);

  const messageById = useMemo(() =>
    Object.fromEntries((messagesData?.results ?? []).map((m: IMessage) => [m.id, m])),
    [messagesData]
  );
  
  const patientInitials = useMemo(() =>
    patient?.name
      ? patient.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)
      : "",
    [patient?.name]
  );

  const installmentSummary = useMemo(() => {
    const total = installments.length;
    const paid = installments.filter(i => i.received).length;
    const overdue = installments.filter(i => !i.received && new Date(i.due_date) < new Date()).length;
    const totalAmount = installments.reduce((sum, i) => sum + Number(i.installment_amount), 0);
    const totalOverdueAmount = installments
      .filter(i => !i.received)
      .reduce((sum, i) => sum + Number(i.installment_amount), 0);
    return { total, paid, overdue, totalAmount, totalOverdueAmount };
  }, [installments]);

  const filteredContactHistory = useMemo(() =>
    contactHistories.filter(contact => {
      const filterLower = contactHistoryFilter.toLowerCase();
      const searchLower = contactHistorySearch.toLowerCase();
      const matchesFilter = filterLower === "all" || contact.contact_type.toLowerCase() === filterLower;
      const matchesSearch =
        searchLower === "" ||
        contact.contact_type.toLowerCase().includes(searchLower) ||
        (contact.observation && contact.observation.toLowerCase().includes(searchLower));
      return matchesFilter && matchesSearch;
    }),
    [contactHistories, contactHistoryFilter, contactHistorySearch]
  );

  // Dados derivados específicos do CollectionCase
  const collectionCaseDetails = useMemo(() => {
    if (!collectionCase) return null;
    console.log(collectionCase)
    const currentStage = getDealStageNameById(collectionCase.stage_id);
    const lastStage = collectionCase.last_stage_id ? getDealStageNameById(collectionCase.last_stage_id) : null;
    const syncStatus = syncStatusMapper[collectionCase.deal_sync_status] || syncStatusMapper.default;
    const dealStatus = dealStatusMapper[collectionCase.status] || dealStatusMapper.default;

    return {
      currentStage,
      lastStage,
      syncStatus: { ...syncStatus, Icon: syncStatus.icon },
      dealStatus: { ...dealStatus, Icon: dealStatus.icon },
      isRegisteredInPipedrive: !!collectionCase.deal_id,
    };
  }, [collectionCase]);

  // 6. Handlers e Estado Agregado
  const isRefreshing = useMemo(() => (
    isFetchingPatient || isFetchingContracts || isFetchingInstallments ||
    isFetchingCollectionCases || isFetchingSchedules || isFetchingHistory
  ), [
    isFetchingPatient, isFetchingContracts, isFetchingInstallments,
    isFetchingCollectionCases, isFetchingSchedules, isFetchingHistory,
  ]);

  const handleRefresh = useCallback(() => {
    Promise.allSettled([
      refetchPatient(),
      refetchContracts(),
      refetchInstallments(),
      refetchCollectionCases(),
      refetchSchedules(),
      refetchHistory(),
    ]);
  }, [
    refetchPatient, refetchContracts, refetchInstallments,
    refetchCollectionCases, refetchSchedules, refetchHistory,
  ]);


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          {patient ? (
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                  {patientInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{patient?.name}</h1>
                <p className="text-muted-foreground">
                  ID: {patient?.oralsin_patient_id} • CPF: {patient?.cpf}
                </p>
              </div>
            </div>
          ) : (
            <PatientHeaderSkeleton />
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <Download className="h-4 w-4 mr-2" />
                Exportar Dados
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Status Cards */}
      {patient && contract && installments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Parcelas</p>
                  <p className="text-2xl font-bold">{installmentSummary.total}</p>
                </div>
                <FileText className="h-8 w-8 mt-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Parcelas Pagas</p>
                  <p className="text-2xl font-bold text-green-600">{installmentSummary.paid}</p>
                </div>
                <CheckCircle className="h-8 w-8 mt-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Em Atraso</p>
                  <p className="text-2xl font-bold text-red-600">{installmentSummary.overdue}</p>
                </div>
                <AlertCircle className="h-8 w-8 mt-5 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                  <p className="text-2xl font-bold">{formatCurrency(String(installmentSummary.totalAmount))}</p>
                </div>
                <DollarSign className="h-8 w-8 mt-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <StatusCardsSkeleton />
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="installments">Parcelas</TabsTrigger>
          <TabsTrigger value="contracts">Contratos</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="flow">Fluxo</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient Info */}
            {patient ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informações do Paciente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{patient?.email}</p>
                      </div>
                    </div>

                    {patient?.phones.map((phone) => (
                      <div key={phone.id} className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Telefone ({phone.phone_type})</p>
                          <p className="text-sm text-muted-foreground">{formatPhone(phone.phone_number)}</p>
                        </div>
                      </div>
                    ))}

                    {patient?.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Endereço</p>
                          <p className="text-sm text-muted-foreground">
                            {patient?.address.street}, {patient?.address.number}
                            {patient?.address.complement && ` - ${patient?.address.complement}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {patient?.address.neighborhood}, {patient?.address.city} - {patient?.address.state}
                          </p>
                          <p className="text-sm text-muted-foreground">CEP: {patient?.address.zip_code}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      {contract?.do_notifications ? (
                        <Bell className="h-4 w-4 text-green-600" />
                      ) : (
                        <BellOff className="h-4 w-4 text-red-600" />
                      )}
                      <div>
                        <p className="text-sm font-medium">Notificações</p>
                        <p className="text-sm text-muted-foreground">
                          {contract?.do_notifications ? "Habilitadas" : "Desabilitadas"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Fluxo Atual</p>
                    {getFlowBadge(patient?.flow_type)}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <PatientInfoSkeleton />
            )}

            {/* Collection Case */}
            {collectionCase && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PhoneCall className="h-5 w-5" />
                    Caso de Cobrança
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Deal ID</p>
                      <p className="text-lg font-semibold">{collectionCase?.deal_id ? collectionCase?.deal_id : "Pendente"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Valor</p>
                      <p className="text-lg font-semibold">{formatCurrency(String(collectionCase?.amount))}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge variant={collectionCase?.status === "open" ? "destructive" : "default"} className="mt-1">
                      {collectionCase?.status === "open" ? "Aberto" : "Fechado"}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Aberto em</p>
                    <p className="text-sm">{formatDateTime(collectionCase?.opened_at)}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Sincronização</p>
                    <Badge variant="outline" className="mt-1">
                      {collectionCase?.deal_sync_status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="installments" className="space-y-6">
          {installments.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Parcelas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Parcela</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Método de Pagamento</TableHead>
                        <TableHead>Atual</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {installments.map((installment) => (
                        <TableRow key={installment?.id}>
                          <TableCell className="font-medium">#{installment?.installment_number}</TableCell>
                          <TableCell>{formatDate(installment?.due_date)}</TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(installment?.installment_amount)}
                          </TableCell>
                          <TableCell>
                            {getPaymentStatusBadge(installment?.installment_status, installment?.received)}
                          </TableCell>
                          <TableCell>{installment?.payment_method?.name}</TableCell>
                          <TableCell>{installment?.is_current && <Badge variant="outline">Atual</Badge>}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <InstallmentsSkeleton />
          )}
        </TabsContent>

        <TabsContent value="contracts" className="space-y-6">
          {contract ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Contratos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">ID do Contrato</p>
                      <p className="text-lg font-semibold">{contract?.oralsin_contract_id}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mt-1"
                      >
                        {contract?.status}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Versão</p>
                      <p className="text-sm">{contract?.contract_version}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Parcelas Restantes</p>
                      <p className="text-lg font-semibold">{contract?.remaining_installments}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                      <p className="text-lg font-semibold">{formatCurrency(installmentSummary.totalAmount)}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Valor em Atraso</p>
                      <p className="text-lg font-semibold text-red-600">{formatCurrency(installmentSummary.totalOverdueAmount)}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Método de Pagamento</p>
                      <p className="text-sm">{contract?.payment_method?.name}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Primeira Cobrança</p>
                      <p className="text-sm">{formatDate(contract?.first_billing_date)}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Configurações</p>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      {contract?.do_notifications ? (
                        <Bell className="h-4 w-4 text-green-600" />
                      ) : (
                        <BellOff className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm">
                        Notificações {contract?.do_notifications ? "Habilitadas" : "Desabilitadas"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {contract?.do_billings ? (
                        <CreditCard className="h-4 w-4 text-green-600" />
                      ) : (
                        <CreditCard className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm">Cobrança {contract?.do_billings ? "Habilitada" : "Desabilitada"}</span>
                    </div>
                  </div>
                </div>

                {contract?.negotiation_notes && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Observações de Negociação</p>
                      <p className="text-sm mt-1">{contract?.negotiation_notes}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <ContractInfoSkeleton />
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Histórico de Contatos
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por tipo de contato ou observação..."
                      value={contactHistorySearch}
                      onChange={(e) => setContactHistorySearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={contactHistoryFilter} onValueChange={setContactHistoryFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phonecall">Ligação</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {filteredContactHistory.length > 0 ? (
                <div className="space-y-4">
                  {filteredContactHistory.map((contact) => {
                    const linkedMessage = contact.message_id
                      ? messageById[contact.message_id]
                      : undefined

                    return (
                      <div key={contact.id} className="border rounded-lg p-4 space-y-3">
                        {/* Cabeçalho do contato */}
                        <div className="flex items-start justify-between">
                          {/* Lado esquerdo: ícone + badges do tipo */}
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 p-2 rounded-full bg-muted">
                              {getContactTypeIcon(contact.contact_type)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                {getContactTypeBadge(contact.contact_type)}
                                {getTriggerBadge(contact.notification_trigger)}
                              </div>
                              <p className="text-sm font-medium">{formatDateTime(contact.sent_at)}</p>
                            </div>
                          </div>

                          {/* Lado direito: preview + badges de status */}
                          <div className="flex items-center gap-2">
                            {linkedMessage && <MessagePreview message={linkedMessage} />}
                            {getSuccessBadge(contact.success)}
                            {contact.feedback_status && getFeedbackStatusBadge(contact.feedback_status)}
                          </div>
                        </div>

                        {/* Metadados adicionais */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          {contact.duration_ms && (
                            <div>
                              <span className="font-medium text-muted-foreground">Duração:</span>
                              <span className="ml-2">{formatDuration(contact.duration_ms)}</span>
                            </div>
                          )}
                          {contact.message_id && (
                            <div>
                              <span className="font-medium text-muted-foreground">ID da Mensagem:</span>
                              <span className="ml-2 font-mono text-xs">{contact.message_id}</span>
                            </div>
                          )}
                          {contact.schedule_id && (
                            <div>
                              <span className="font-medium text-muted-foreground">Agendamento:</span>
                              <span className="ml-2 font-mono text-xs">{contact.schedule_id}</span>
                            </div>
                          )}
                        </div>

                        {contact.observation && (
                          <div className="pt-2 border-t">
                            <p className="text-sm">
                              <span className="font-medium text-muted-foreground">Observação:</span>
                              <span className="ml-2">{contact.observation}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum contato encontrado</h3>
                  <p className="text-muted-foreground">
                    {contactHistorySearch || contactHistoryFilter !== "all"
                      ? "Tente ajustar os filtros de busca."
                      : "O histórico de contatos aparecerá aqui quando houver interações registradas."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Fluxo de Cobrança
              </CardTitle>
            </CardHeader>
            <CardContent>
              {patient?.flow_type === "notification_billing" ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Milestone className="h-5 w-5 text-blue-600" />
                    <p className="text-sm font-medium">
                      Paciente está no passo <span className="font-bold">{currentStep}</span> do fluxo de notificações
                    </p>
                  </div>

                  <div className="relative">
                    {/* Timeline items */}
                    <div className="space-y-8">
                      {flowSteps.map((step) => {
                        console.log(currentStep)
                        const isCurrentStep = step.step_number === currentStep
                        const isPastStep = step.step_number < currentStep

                        return (
                          <div key={step.id} className="relative flex items-start gap-4">
                            {/* Círculo indicador */}
                            <div
                              className={`relative z-10 flex h-12 w-12 mt-8 shrink-0 items-center justify-center rounded-full border-2 ${isCurrentStep
                                  ? "border-blue-600 bg-blue-50 dark:bg-blue-950 dark:border-blue-500"
                                  : isPastStep
                                    ? "border-green-600 bg-green-50 dark:bg-green-950 dark:border-green-500"
                                    : "border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700"
                                }`}
                            >
                              {isPastStep ? (
                                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-500" />
                              ) : isCurrentStep ? (
                                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                              ) : (
                                <Calendar className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                              )}
                            </div>

                            {/* Conteúdo */}
                            <div
                              className={`flex-1 rounded-lg border p-4 shadow-sm ${isCurrentStep
                                  ? "border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-900"
                                  : isPastStep
                                    ? "border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-900"
                                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                }`}
                            >
                              <div className="mb-1 flex items-center justify-between">
                                <h4
                                  className={`font-medium ${isCurrentStep
                                      ? "text-blue-800 dark:text-blue-300"
                                      : isPastStep
                                        ? "text-green-800 dark:text-green-300"
                                        : "text-gray-900 dark:text-gray-100"
                                    }`}
                                >
                                  {step.description}
                                </h4>
                                {isCurrentStep && <Badge className="bg-blue-500">Atual</Badge>}
                              </div>

                              <div className="mt-2 flex flex-wrap gap-2">
                                {step.channels.map((channel) => (
                                  <div
                                    key={channel}
                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium`}
                                  >
                                    {getChannelBadge(channel)}
                                  </div>
                                ))}
                              </div>

                              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                {isPastStep
                                  ? "Concluído"
                                  : isCurrentStep
                                    ? "Em andamento"
                                    : `Agendado para ${step.cooldown_days} dias após o passo anterior`}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ) : patient?.flow_type === "cordial_billing" ? (
                <div className="space-y-6">
      <div className="flex items-center gap-2">
        <PhoneCall className="h-5 w-5 text-orange-600" />
        <p className="text-sm font-medium">Paciente está em fluxo de Cobrança Amigável</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status do Pipedrive */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              {collectionCaseDetails?.isRegisteredInPipedrive ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              )}
              Status no Pipedrive
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Cadastro</p>
                <div className="flex items-center gap-2">
                  {collectionCaseDetails?.isRegisteredInPipedrive ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-400">
                        Cadastrado (Deal #{collectionCase?.deal_id})
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-700 dark:text-amber-400">Não cadastrado</span>
                    </>
                  )}
                </div>
              </div>

              {collectionCaseDetails?.isRegisteredInPipedrive && (
                <>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Status de Sincronização</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={collectionCaseDetails?.syncStatus.color}>{collectionCaseDetails?.syncStatus.label}</Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Status do Negócio</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={collectionCaseDetails?.dealStatus.color}>{collectionCaseDetails?.dealStatus.label}</Badge>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Informações do Caso */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-orange-600" />
              Informações do Caso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Valor</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(collectionCase?.amount)}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Data de Abertura</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{formatDate(collectionCase?.opened_at)}</span>
              </div>
            </div>

            {collectionCaseDetails?.currentStage && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Estágio Atual</p>
                <Badge variant="outline" className="text-xs">
                  {collectionCaseDetails?.currentStage}
                </Badge>
              </div>
            )}

            {collectionCaseDetails?.lastStage && collectionCaseDetails?.lastStage !== collectionCaseDetails?.currentStage && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Último Estágio</p>
                <Badge variant="secondary" className="text-xs">
                  {collectionCaseDetails?.lastStage}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Information */}
      {collectionCaseDetails?.currentStage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Etapa Atual: {collectionCaseDetails?.currentStage}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
            {collectionCaseDetails?.lastStage && collectionCaseDetails?.lastStage !== collectionCaseDetails?.currentStage && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Última etapa registrada:</span>
                <Badge variant="default">{collectionCaseDetails?.lastStage}</Badge>
              </div>
            )}
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">ID do Caso: {collectionCase?.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
              ) : (
                <div className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Sem fluxo de cobrança ativo</h3>
                  <p className="text-muted-foreground mb-4">
                    Este paciente não está em nenhum fluxo de cobrança no momento.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
