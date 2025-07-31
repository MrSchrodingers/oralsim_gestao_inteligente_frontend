export interface ICollectionCase {
  id: string;
  patient_id: string;
  contract_id: string;
  stage_id: number;
  last_stage_id: number;
  installment_id: string;
  clinic_id: string;
  opened_at: string;
  amount: number;
  deal_id?: number | null;
  deal_sync_status: 'pending' | 'created' | 'updated' | 'error';
  status: 'open' | 'closed';
}