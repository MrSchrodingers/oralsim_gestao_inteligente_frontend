export interface IContactHistory {
  id: string;
  patient_id: string;
  contract_id?: string | null;
  clinic_id: string;
  notification_trigger: string;
  advance_flow: boolean;
  contact_type: string;
  sent_at?: string | null;
  duration_ms?: number | null;
  feedback_status?: string | null;
  success: boolean;
  observation?: string | null;
  message_id?: string | null;
  schedule_id?: string | null;
  created_at?: string;
  updated_at?: string;
}