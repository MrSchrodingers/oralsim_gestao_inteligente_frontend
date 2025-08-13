import type  { IClinicData } from './IClinicData';
import type  { IClinicPhone } from './IClinicPhone';

export interface IUser {
  id: string;
  email: string;
  name: string;
  clinic_name?: string | null;
  is_active: boolean;
  role: 'admin' | 'clinic';
  created_at?: string;
  updated_at?: string;
}

export interface IUserCreateDTO {
  email: string;
  password?: string;
  name: string;
  is_active: boolean;
  role: 'admin' | 'clinic';
  clinic_name?: string | null;
}

export type IUserUpdateDTO = Partial<IUserCreateDTO>

export interface IClinicWithDetails {
  id: string;
  oralsin_clinic_id: number;
  name: string;
  cnpj?: string | null;
  created_at?: string;
  updated_at?: string;
  data?: IClinicData | null;
  phones: IClinicPhone[];
}

export interface IUserFullData extends IUser {
  clinics: IClinicWithDetails[];
}

export interface IRegistrationRequestCreateDTO {
  email: string;
  password?: string;
  name: string;
  clinic_name: string;
  cordial_billing_config: number;
}