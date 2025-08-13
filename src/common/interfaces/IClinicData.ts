import type  { IAddress } from './IAddress';

export interface IClinicData {
  id: string;
  clinic_id: string;
  corporate_name?: string | null;
  acronym?: string | null;
  address?: IAddress | null;
  active: boolean;
  franchise: boolean;
  timezone?: string | null;
  first_billing_date?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface IClinicDataCreateDTO {
  clinic_id: string;
  address_id?: string | null;
  corporate_name?: string | null;
  acronym?: string | null;
  active?: boolean;
  franchise?: boolean;
  timezone?: string | null;
  first_billing_date?: string | null;
}

export type IClinicDataUpdateDTO = Partial<IClinicDataCreateDTO>