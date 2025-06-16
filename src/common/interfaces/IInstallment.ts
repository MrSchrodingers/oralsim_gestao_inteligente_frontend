import type { IPaymentMethod } from "./IPaymentMethod";

export interface IInstallment {
  id: string;
  contract_id: string;
  contract_version?: number | null;
  installment_number: number;
  oralsin_installment_id?: number | null;
  due_date: string;
  installment_amount: number;
  received: boolean;
  installment_status?: string | null;
  payment_method?: IPaymentMethod | null;
  is_current: boolean;
  created_at?: string;
  updated_at?: string;
}