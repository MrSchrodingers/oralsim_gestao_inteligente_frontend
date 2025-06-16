export interface ICoveredClinic {
  id: string;
  clinic_id: string;
  oralsin_clinic_id: number;
  name: string;
  cnpj?: string | null;
  corporate_name?: string | null;
  acronym?: string | null;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ICoveredClinicCreateDTO {
  name: string;
}