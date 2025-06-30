import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/src/common/components/ui/tabs"
import type { IUserFullData } from "@/src/common/interfaces/IUser"
import type { IClinicSummary } from "@/src/common/interfaces/IClinic"
import OverviewStats from "./OverviewStats"
import PlanCard from "./PlanCard"
import ClinicInfo from "./ClinicInfo"
import SubscriptionDetails from "./SubscriptionDetails"
import { getSubscriptionBadge } from "@/src/common/components/helpers/GetBadge"

/* Tipagem auxiliar */
interface SubscriptionInfo {
  remainingDays: number
}
interface ClinicTabsProps {
  user: IUserFullData
  clinicStats?: IClinicSummary | null
  plan: {
    name: string
    type: string
    price: number
    billing_cycle: "monthly" | "yearly"
    started_at: string
    expires_at: string
    features: string[]
  }
  subscriptionInfo: SubscriptionInfo
  copy: (txt: string) => void
}

export default function ClinicTabs({
  user,
  clinicStats,
  plan,
  subscriptionInfo,
  copy,
}: ClinicTabsProps) {
  const primaryClinic = user.clinics?.[0]

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
        <TabsTrigger value="clinic">Clínica</TabsTrigger>
        <TabsTrigger value="subscription">Assinatura</TabsTrigger>
      </TabsList>

      {/* ---------------- Visão Geral ---------------- */}
      <TabsContent value="overview" className="space-y-6">
        {clinicStats && (
          <>
            <OverviewStats stats={clinicStats} />
            <PlanCard plan={plan} subscriptionInfo={subscriptionInfo} />
          </>
        )}
      </TabsContent>

      {/* ---------------- Clínica -------------------- */}
      <TabsContent value="clinic" className="space-y-6">
        {primaryClinic && <ClinicInfo clinic={primaryClinic} copy={copy} />}
      </TabsContent>

      {/* ---------------- Assinatura ----------------- */}
      <TabsContent value="subscription" className="space-y-6">
        <SubscriptionDetails
          plan={plan}
          subStatusBadge={
            clinicStats ? getSubscriptionBadge(clinicStats?.subscription_status) : null
          }
          subscriptionInfo={subscriptionInfo}
        />
      </TabsContent>
    </Tabs>
  )
}
