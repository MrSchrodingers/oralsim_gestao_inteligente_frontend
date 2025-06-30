import { Card, CardHeader, CardTitle, CardContent } from "@/src/common/components/ui/card"
import { Building2, MapPin, Phone, Copy as CopyIcon } from "lucide-react"
import { Badge } from "@/src/common/components/ui/badge"
import { Button } from "@/src/common/components/ui/button"
import { Label } from "@/src/common/components/ui/label"
import { formatDateOnly } from "@/src/common/utils/formatters"
import type { IClinicWithDetails } from "../../interfaces/IUser"

interface Props {
  clinic: IClinicWithDetails
  copy: (v: string) => void
}

export default function ClinicInfo({ clinic, copy }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" /> Informações da Clínica
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Info label="Nome">{clinic.name}</Info>
          <Info label="Razão Social">{clinic.data?.corporate_name}</Info>
          <Info label="CNPJ">
            {clinic.cnpj}
            <CopyButton onClick={() => copy(clinic.cnpj!)} />
          </Info>
          <Info label="Sigla">{clinic.data?.acronym}</Info>
          <Info label="ID OralSin">{clinic.oralsin_clinic_id}</Info>
          <Info label="Franquia">{clinic.data?.franchise ? "Sim" : "Não"}</Info>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" /> Endereço & Contato
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <section>
            <Label className="text-muted-foreground">Endereço</Label>
            <p>
              {clinic?.data?.address?.street}, {clinic?.data?.address?.number}
            </p>
            {clinic?.data?.address?.complement && (
              <p className="text-muted-foreground">{clinic.data.address.complement}</p>
            )}
            <p className="text-muted-foreground">
              {clinic?.data?.address?.neighborhood}, {clinic?.data?.address?.city} -{" "}
              {clinic?.data?.address?.state}
            </p>
            <p className="text-muted-foreground">CEP: {clinic?.data?.address?.zip_code}</p>
          </section>

          <section>
            <Label className="text-muted-foreground">Telefones</Label>
            <div className="space-y-2">
              {clinic.phones.map((p) => (
                <div key={p.id} className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{p.phone_number}</span>
                  <Badge variant="outline" className="text-xs">
                    {p.phone_type}
                  </Badge>
                  <CopyButton onClick={() => copy(p.phone_number)} />
                </div>
              ))}
            </div>
          </section>

          <Info label="Timezone">{clinic.data?.timezone}</Info>
          <Info label="Primeiro Faturamento">
            {formatDateOnly(clinic.data?.first_billing_date)}
          </Info>
        </CardContent>
      </Card>
    </div>
  )
}

const Info = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <Label className="text-muted-foreground">{label}</Label>
    <p className="font-medium">{children}</p>
  </div>
)

const CopyButton = ({ onClick }: { onClick: () => void }) => (
  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onClick}>
    <CopyIcon className="h-3 w-3" />
  </Button>
)
