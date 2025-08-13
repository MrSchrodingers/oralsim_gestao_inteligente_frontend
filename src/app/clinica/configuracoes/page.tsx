"use client"

import { useEffect, useState } from "react"
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
import { Avatar, AvatarFallback } from "@/src/common/components/ui/avatar"
import { useCurrentUser, useUpdateUser } from "@/src/common/hooks/useUser"
import { useUpdateClinicData } from "@/src/common/hooks/useClinicData"
import { useUpdateAddress } from "@/src/common/hooks/useAddress"
import { useFetchBillingSettings, useUpdateBillingSettings } from "@/src/modules/cordialBilling/hooks/useBillingSettings"
import { useQueryClient } from "@tanstack/react-query"
import { formatCNPJ } from "@/src/common/utils/formatCNPJ"
import { useFetchClinicPhones } from "@/src/common/hooks/useClinicPhone"
import { formatDate } from "@/src/common/utils/formatters"
import { formatZipCode } from "@/src/common/utils/formatZipCode"
import type { IClinicData } from "@/src/common/interfaces/IClinicData"
import type { IUser } from "@/src/common/interfaces/IUser"
import type { IBillingSettings } from "@/src/modules/cordialBilling/interfaces/IBillingSettings"

type FormData = {
  user: IUser;
  clinic: IClinicData;
  billing: IBillingSettings;
};

export default function ConfiguracoesPage() {
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: currentUser } = useCurrentUser()
  const clinic = currentUser?.clinics?.[0]
  const { data: billing } = useFetchBillingSettings(clinic?.id ?? '')
  const { data: clinicPhones } = useFetchClinicPhones({ clinic_id: clinic?.id })

  const clinicPhonesData = clinicPhones?.results


  const [formData, setFormData] = useState<FormData>({
    clinic: (clinic?.data as IClinicData) ?? ({} as IClinicData),
    user: currentUser ?? ({} as IUser),
    billing: billing ?? ({} as IBillingSettings),
  });

  useEffect(() => {
    if (currentUser && clinic && billing) {
      setFormData({
        clinic: { ...(clinic.data as IClinicData) },
        user: { ...currentUser },
        billing: { ...billing },
      })
    }
  }, [currentUser, clinic, billing])

  const { mutateAsync: updateClinicData } = useUpdateClinicData()
  const { mutateAsync: updateAddress } = useUpdateAddress()
  const { mutateAsync: updateUser } = useUpdateUser()
  const { mutateAsync: updateBilling } = useUpdateBillingSettings()

  const handleEdit = (section: string) => {
    setIsEditing(section)
  }

  const handleSave = async (section: string) => {
    if (!formData) return

    if (section === 'clinic-general') {
      await updateClinicData({
        id: formData.clinic.id,
        data: {
          clinic_id: formData.clinic.clinic_id,
          corporate_name: formData.clinic.corporate_name,
          acronym: formData.clinic.acronym,
          active: formData.clinic.active,
          franchise: formData.clinic.franchise,
          timezone: formData.clinic.timezone,
          first_billing_date: formData.clinic.first_billing_date,
          address_id: formData.clinic.address?.id,
        },
      })
    } else if (section === 'clinic-address' && formData.clinic.address?.id) {
      await updateAddress({
        id: formData.clinic?.address.id,
        data: {
          street: formData.clinic?.address?.street,
          number: formData.clinic?.address?.number,
          complement: formData.clinic?.address?.complement,
          neighborhood: formData.clinic?.address?.neighborhood,
          city: formData.clinic?.address?.city,
          state: formData.clinic?.address?.state,
          zip_code: formData.clinic?.address?.zip_code,
        },
      })
    } else if (section === 'user-info') {
      await updateUser({
        id: formData.user.id,
        data: {
          email: formData.user.email,
          name: formData.user.name,
          clinic_name: formData.user.clinic_name,
          role: formData.user.role,
        },
      })
    } else if (section === 'billing-settings') {
      await updateBilling({
        clinicId: formData.billing.clinic_id,
        data: {
          clinic_id: formData.billing.clinic_id,
          min_days_overdue: formData.billing.min_days_overdue,
        },
      })
    }

    await queryClient.invalidateQueries({ queryKey: ['users', 'me'] })
  }

  const handleCancel = () => {
    setIsEditing(null)
    if (currentUser && clinic && billing) {
      setFormData({
        clinic: { ...(clinic.data as IClinicData) },
        user: { ...currentUser },
        billing: { ...billing },
      })
    }
  }

  function updateFormData<
    S extends keyof FormData,
    F extends keyof FormData[S]
  >(section: S, field: F, value: FormData[S][F]) {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      } as FormData[S],
    }));
  }

  function updateNestedFormData<
    S extends keyof FormData,
    N extends keyof FormData[S],
    NN extends NonNullable<FormData[S][N]>,
    F extends keyof NN
  >(
    section: S,
    nestedField: N,
    field: F,
    value: NN[F]
  ) {
    setFormData(prev => {
      const sectionObj = prev[section];
      const nestedObj = (sectionObj[nestedField] ?? {}) as NN;

      return {
        ...prev,
        [section]: {
          ...sectionObj,
          [nestedField]: {
            ...nestedObj,
            [field]: value,
          } as FormData[S][N],
        } as FormData[S],
      };
    });
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
                    <Button size="sm" variant="outline" onClick={() => handleEdit("clinic-general")} disabled>
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
                        value={formData.clinic.corporate_name || ""}
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
                        value={formData.clinic.acronym || ""}
                        disabled
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">{formData.clinic.acronym}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <p className="text-sm font-medium mt-1">{formatCNPJ(clinic?.cnpj)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="timezone">Fuso Horário</Label>
                    {isEditing === "clinic-general" ? (
                      <Select
                        value={formData.clinic.timezone || ""}
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
                        value={formData.clinic.first_billing_date || ""}
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
                        disabled
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
                        disabled
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
                    <Button size="sm" variant="outline" onClick={() => handleEdit("clinic-address")} disabled>
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
                        value={formData.clinic.address?.street || ""}
                        onChange={(e) => updateNestedFormData("clinic", "address", "street", e.target.value)}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">{formData?.clinic?.address?.street || "N/A"}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="number">Número</Label>
                    {isEditing === "clinic-address" ? (
                      <Input
                        id="number"
                        value={formData.clinic.address?.number || ""}
                        onChange={(e) => updateNestedFormData("clinic", "address", "number", e.target.value)}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">{formData?.clinic?.address?.number || "N/A"}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="complement">Complemento</Label>
                    {isEditing === "clinic-address" ? (
                      <Input
                        id="complement"
                        value={formData.clinic.address?.complement || ""}
                        onChange={(e) => updateNestedFormData("clinic", "address", "complement", e.target.value)}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">{formData?.clinic?.address?.complement || "N/A"}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="neighborhood">Bairro</Label>
                    {isEditing === "clinic-address" ? (
                      <Input
                        id="neighborhood"
                        value={formData.clinic.address?.neighborhood || ""}
                        onChange={(e) => updateNestedFormData("clinic", "address", "neighborhood", e.target.value)}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">{formData?.clinic?.address?.neighborhood}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    {isEditing === "clinic-address" ? (
                      <Input
                        id="city"
                        value={formData.clinic.address?.city || ""}
                        onChange={(e) => updateNestedFormData("clinic", "address", "city", e.target.value)}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">{formData?.clinic?.address?.city || "N/A"}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="state">Estado</Label>
                    {isEditing === "clinic-address" ? (
                      <Select
                        value={formData.clinic.address?.state || ""}
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
                      <p className="text-sm font-medium mt-1">{formData?.clinic?.address?.state || "N/A"}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="zip_code">CEP</Label>
                    {isEditing === "clinic-address" ? (
                      <Input
                        id="zip_code"
                        value={formData.clinic.address?.zip_code || ""}
                        onChange={(e) => updateNestedFormData("clinic", "address", "zip_code", e.target.value)}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">{formatZipCode(formData.clinic.address?.zip_code || "") || "N/A"}</p>
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
                <Button size="sm" variant="outline" disabled>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clinicPhonesData?.map((phone) => (
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
                      <Button size="sm" variant="ghost" disabled>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" disabled>
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
                    <Button size="sm" variant="outline" onClick={() => handleEdit("user-info")} disabled>
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
                        disabled
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
                        disabled
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
                    <Button size="sm" variant="outline" onClick={() => handleEdit("billing-settings")} disabled>
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
