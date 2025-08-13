export interface IPatientPhone {
  id: string;
  patient_id: string;
  phone_number: string;
  phone_type?: 'home' | 'mobile' | 'commercial' | 'contact' | null;
  created_at?: string;
  updated_at?: string;
}

export interface IPatientPhoneCreateDTO {
  patient_id: string;
  phone_number: string;
  phone_type?: 'home' | 'mobile' | 'commercial' | 'contact' | null;
}

export type IPatientPhoneUpdateDTO = Partial<IPatientPhoneCreateDTO>