import type { IPaymentMethod } from "./IPaymentMethod";

export interface IContract {
  id: string;
  oralsin_contract_id?: number | null;
  patient_id: string;
  clinic_id: string;
  status: 'ativo' | 'inativo' | 'cancelado';
contract_version?: string | null;
  remaining_installments: number;
  overdue_amount: number;
  final_contract_value?: number | null;
  do_notifications: boolean;
  do_billings: boolean;
  first_billing_date?: string | null;
  negotiation_notes?: string | null;
  payment_method?: IPaymentMethod | null;
  created_at?: string;
  updated_at?: string;
}