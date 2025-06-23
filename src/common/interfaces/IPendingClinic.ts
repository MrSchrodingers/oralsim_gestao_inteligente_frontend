export interface IPendingClinic {
  id: string
  email: string
  name: string
  clinic_name: string
  status: "pending" | "approved" | "rejected"
  created_at: string
  updated_at: string
  is_paid?: boolean
  selected_plan?: string
  notes?: string
  oralsin_clinic_id?: number
}