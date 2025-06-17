"use client"

import { useState } from "react"
import {
  Building2,
  MapPin,
  Phone,
  User,
  CreditCard,
  Clock,
  Edit,
  Plus,
  Trash2,
  Check,
  X,
  Calendar,
  Globe,
  Shield,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/common/components/ui/card"
import { Button } from "@/src/common/components/ui/button"
import { Badge } from "@/src/common/components/ui/badge"
import { Input } from "@/src/common/components/ui/input"
import { Label } from "@/src/common/components/ui/label"
import { Switch } from "@/src/common/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/common/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/common/components/ui/tabs"
import { Separator } from "@/src/common/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/common/components/ui/avatar"

// Mock data baseado nos dados fornecidos
const clinicData = {
  id: "56d08c50-bc7f-4b5d-98ca-2214b825d7af",
  clinic_id: "5c91f4bf-fdc5-45a0-b0c9-814e7acb0b2d",
  corporate_name: "P. A. T. YANASE ODONTOLOGIA",
  acronym: "BAU",
  address: {
    id: "c1547481-4f5e-44fd-aaa7-605889315734",
    street: "Rua Engenheiro Saint Martin",
    number: "17-45",
    complement: null,
    neighborhood: "Centro",
    city: "Bauru",
    state: "SP",
    zip_code: "17015-351",
  },
  active: true,
  franchise: true,
  timezone: "America/Sao_Paulo",
  first_billing_date: "2017-03-20",
}

const userData = {
  id: "8bf53e82-4518-4077-b4a4-00fbab26d9b8",
  email: "bauru@oralsin.admin.com.br",
  name: "Bauru",
  clinic_name: null,
  is_active: true,
  role: "clinic",
  clinics: [
    {
      id: "5c91f4bf-fdc5-45a0-b0c9-814e7acb0b2d",
      oralsin_clinic_id: 47,
      name: "Bauru",
      cnpj: "26.411.050/0001-55",
    },
  ],
}

const phoneData = [
  {
    id: "2c399621-61d8-4183-bc47-4849e934624d",
    clinic_id: "5c91f4bf-fdc5-45a0-b0c9-814e7acb0b2d",
    phone_number: "(14) 3012-9449",
    phone_type: "primary",
  },
]

const billingSettings = {
  clinic_id: "5c91f4bf-fdc5-45a0-b0c9-814e7acb0b2d",
  min_days_overdue: 90,
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "N/A"
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateStr))
}

const formatCNPJ = (cnpj: string) => {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
}

const formatZipCode = (zipCode: string) => {
  return zipCode.replace(/^(\d{5})(\d{3})/, "$1-$2")
}

export default function ConfiguracoesPage() {
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    clinic: { ...clinicData },
    user: { ...userData },
    billing: { ...billingSettings },
  })

  const handleEdit = (section: string) => {
    setIsEditing(section)
  }

  const handleSave = (section: string) => {
    // Aqui você implementaria a lógica de salvamento
    console.log(`Salvando seção: ${section}`, formData)
    setIsEditing(null)
  }

  const handleCancel = () => {
    setIsEditing(null)
    // Resetar dados para o estado original
    setFormData({
      clinic: { ...clinicData },
      user: { ...userData },
      billing: { ...billingSettings },
    })
  }

  const updateFormData = (section: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const updateNestedFormData = (section: string, nestedField: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [nestedField]: {
          ...(prev[section as keyof typeof prev] as any)[nestedField],
          [field]: value,
        },
      },
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          </div>
          <p className="text-muted-foreground">Gerencie as configurações da clínica e do usuário</p>
        </div>
      </div>

      <Tabs defaultValue="clinic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="clinic" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Clínica
          </TabsTrigger>
          <TabsTrigger value="user" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Usuário
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Cobrança
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clinic" className="space-y-6">
          {/* Informações Gerais da Clínica */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Informações Gerais
                </CardTitle>
                <div className="flex items-center gap-2">
                  {isEditing === "clinic-general" ? (
                    <>
                      <Button size="sm" onClick={() => handleSave("clinic-general")}>
                        <Check className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleEdit("clinic-general")}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="corporate_name">Razão Social</Label>
                    {isEditing === "clinic-general" ? (
                      <Input
                        id="corporate_name"
                        value={formData.clinic.corporate_name}
                        onChange={(e) => updateFormData("clinic", "corporate_name", e.target.value)}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">{formData.clinic.corporate_name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="acronym">Sigla</Label>
                    {isEditing === "clinic-general" ? (
                      <Input
                        id="acronym"
                        value={formData.clinic.acronym}
                        onChange={(e) => updateFormData("clinic", "acronym", e.target.value)}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">{formData.clinic.acronym}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <p className="text-sm font-medium mt-1">{formatCNPJ(userData.clinics[0].cnpj)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="timezone">Fuso Horário</Label>
                    {isEditing === "clinic-general" ? (
                      <Select
                        value={formData.clinic.timezone}
                        onValueChange={(value) => updateFormData("clinic", "timezone", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Sao_Paulo">América/São Paulo</SelectItem>
                          <SelectItem value="America/Manaus">América/Manaus</SelectItem>
                          <SelectItem value="America/Rio_Branco">América/Rio Branco</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">{formData.clinic.timezone}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="first_billing_date">Primeira Data de Cobrança</Label>
                    {isEditing === "clinic-general" ? (
                      <Input
                        id="first_billing_date"
                        type="date"
                        value={formData.clinic.first_billing_date}
                        onChange={(e) => updateFormData("clinic", "first_billing_date", e.target.value)}
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">{formatDate(formData.clinic.first_billing_date)}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="active">Status da Clínica</Label>
                      <p className="text-xs text-muted-foreground">Ativar ou desativar a clínica</p>
                    </div>
                    {isEditing === "clinic-general" ? (
                      <Switch
                        id="active"
                        checked={formData.clinic.active}
                        onCheckedChange={(checked) => updateFormData("clinic", "active", checked)}
                      />
                    ) : (
                      <Badge variant={formData.clinic.active ? "default" : "secondary"}>
                        {formData.clinic.active ? "Ativa" : "Inativa"}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="franchise">Franquia</Label>
                      <p className="text-xs text-muted-foreground">Indica se é uma franquia</p>
                    </div>
                    {isEditing === "clinic-general" ? (
                      <Switch
                        id="franchise"
                        checked={formData.clinic.franchise}
                        onCheckedChange={(checked) => updateFormData("clinic", "franchise", checked)}
                      />
                    ) : (
                      <Badge variant={formData.clinic.franchise ? "default" : "secondary"}>
                        {formData.clinic.franchise ? "Sim" : "Não"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Endereço
                </CardTitle>
                <div className="flex items-center gap-2">
                  {isEditing === "clinic-address" ? (
                    <>
                      <Button size="sm" onClick={() => handleSave("clinic-address")}>
                        <Check className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleEdit("clinic-address")}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="street">Rua</Label>
                    {isEditing === "clinic-address" ? (
                      <Input
                        id="street"
                        value={formData.clinic.address.street}
                        onChange={(e) => updateNestedFormData("clinic", "address", "street", e.target.value)}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">{formData.clinic.address.street}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="number">Número</Label>
                    {isEditing === "clinic-address" ? (
                      <Input
                        id="number"
                        value={formData.clinic.address.number}
                        onChange={(e) => updateNestedFormData("clinic", "address", "number", e.target.value)}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">{formData.clinic.address.number}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="complement">Complemento</Label>
                    {isEditing === "clinic-address" ? (
                      <Input
                        id="complement"
                        value={formData.clinic.address.complement || ""}
                        onChange={(e) => updateNestedFormData("clinic", "address", "complement", e.target.value)}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">{formData.clinic.address.complement || "N/A"}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="neighborhood">Bairro</Label>
                    {isEditing === "clinic-address" ? (
                      <Input
                        id="neighborhood"
                        value={formData.clinic.address.neighborhood}
                        onChange={(e) => updateNestedFormData("clinic", "address", "neighborhood", e.target.value)}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">{formData.clinic.address.neighborhood}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    {isEditing === "clinic-address" ? (
                      <Input
                        id="city"
                        value={formData.clinic.address.city}
                        onChange={(e) => updateNestedFormData("clinic", "address", "city", e.target.value)}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">{formData.clinic.address.city}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="state">Estado</Label>
                    {isEditing === "clinic-address" ? (
                      <Select
                        value={formData.clinic.address.state}
                        onValueChange={(value) => updateNestedFormData("clinic", "address", "state", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SP">São Paulo</SelectItem>
                          <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                          <SelectItem value="MG">Minas Gerais</SelectItem>
                          {/* Adicionar outros estados */}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm font-medium mt-1">{formData.clinic.address.state}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="zip_code">CEP</Label>
                    {isEditing === "clinic-address" ? (
                      <Input
                        id="zip_code"
                        value={formData.clinic.address.zip_code}
                        onChange={(e) => updateNestedFormData("clinic", "address", "zip_code", e.target.value)}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">{formatZipCode(formData.clinic.address.zip_code)}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Telefones */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Telefones
                </CardTitle>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {phoneData.map((phone) => (
                  <div key={phone.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{phone.phone_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {phone.phone_type === "primary" ? "Principal" : "Secundário"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações do Usuário
                </CardTitle>
                <div className="flex items-center gap-2">
                  {isEditing === "user-info" ? (
                    <>
                      <Button size="sm" onClick={() => handleSave("user-info")}>
                        <Check className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleEdit("user-info")}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                    {formData.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{formData.user.name}</h3>
                  <p className="text-muted-foreground">{formData.user.email}</p>
                  <Badge variant={formData.user.is_active ? "default" : "secondary"}>
                    {formData.user.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="user_name">Nome</Label>
                    {isEditing === "user-info" ? (
                      <Input
                        id="user_name"
                        value={formData.user.name}
                        onChange={(e) => updateFormData("user", "name", e.target.value)}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">{formData.user.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="user_email">E-mail</Label>
                    {isEditing === "user-info" ? (
                      <Input
                        id="user_email"
                        type="email"
                        value={formData.user.email}
                        onChange={(e) => updateFormData("user", "email", e.target.value)}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">{formData.user.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="user_role">Função</Label>
                    <p className="text-sm font-medium mt-1 capitalize">{formData.user.role === "clinic" ? "Clínica" : "Admin"}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="user_active">Status do Usuário</Label>
                      <p className="text-xs text-muted-foreground">Ativar ou desativar o usuário</p>
                    </div>
                    {isEditing === "user-info" ? (
                      <Switch
                        id="user_active"
                        checked={formData.user.is_active}
                        onCheckedChange={(checked) => updateFormData("user", "is_active", checked)}
                      />
                    ) : (
                      <Badge variant={formData.user.is_active ? "default" : "secondary"}>
                        {formData.user.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Configurações de Cobrança
                </CardTitle>
                <div className="flex items-center gap-2">
                  {isEditing === "billing-settings" ? (
                    <>
                      <Button size="sm" onClick={() => handleSave("billing-settings")}>
                        <Check className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleEdit("billing-settings")}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="min_days_overdue">Dias Mínimos em Atraso</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Número mínimo de dias em atraso para iniciar o processo de cobrança
                  </p>
                  {isEditing === "billing-settings" ? (
                    <Input
                      id="min_days_overdue"
                      type="number"
                      value={formData.billing.min_days_overdue}
                      onChange={(e) => updateFormData("billing", "min_days_overdue", Number.parseInt(e.target.value))}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">{formData.billing.min_days_overdue} dias</p>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Outras Configurações de Cobrança</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Cobrança Automática</p>
                        <p className="text-sm text-muted-foreground">Enviar cobranças automaticamente</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Notificações por E-mail</p>
                        <p className="text-sm text-muted-foreground">Receber notificações de cobrança</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Relatórios Mensais</p>
                        <p className="text-sm text-muted-foreground">Gerar relatórios automaticamente</p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Integração WhatsApp/ SMS</p>
                        <p className="text-sm text-muted-foreground">Enviar mensagens via WhatsApp/ SMS</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Alterar Senha</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="current_password">Senha Atual</Label>
                      <Input id="current_password" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="new_password">Nova Senha</Label>
                      <Input id="new_password" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="confirm_password">Confirmar Nova Senha</Label>
                      <Input id="confirm_password" type="password" />
                    </div>
                    <Button>Alterar Senha</Button>
                  </div>
                </div>

                <Separator />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
