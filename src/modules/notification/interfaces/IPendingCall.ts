export interface IPendingCall {
  id: string;
  patient_id: string;
  contract_id: string;
  clinic_id: string;
  schedule_id?: string | null;
  current_step: number;
  scheduled_at: string;
  last_attempt_at?: string | null;
  attempts: number;
  status: 'pending' | 'done' | 'failed';
  result_notes?: string | null;
}