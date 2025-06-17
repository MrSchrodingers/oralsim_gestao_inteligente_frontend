import type  { IAddress } from './IAddress';
import type  { IPatientPhone } from './IPatientPhone';

export interface IPatient {
  id: string;
  oralsin_patient_id?: number | null;
  clinic_id: string;
  name: string;
  cpf?: string | null;
  address?: IAddress | null;
  contact_name?: string | null;
  email?: string | null;
  is_notification_enabled: boolean;
  phones: IPatientPhone[];
  created_at?: string;
  flow_type?: "notification_billing" | "cordial_billing" | null | undefined;
  updated_at?: string;
}

export interface IPatientUpdateDTO {
  name?: string;
  cpf?: string | null;
  email?: string | null;
  is_notification_enabled?: boolean;
}