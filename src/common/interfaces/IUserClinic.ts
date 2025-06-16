export interface IUserClinic {
  id: string;
  user_id: string;
  clinic_id: string;
  linked_at?: string;
}

export interface IUserClinicCreateDTO {
  user_id: string;
  clinic_id: string;
}