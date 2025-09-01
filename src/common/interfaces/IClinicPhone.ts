export interface IClinicPhone {
  id: string;
  clinic_id: string;
  phone_number: string;
  contact_phone: string
  phone_type?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface IClinicPhoneCreateDTO {
  clinic_id: string;
  phone_number: string;
  phone_type?: string | null;
}

export type IClinicPhoneUpdateDTO = Partial<IClinicPhoneCreateDTO>