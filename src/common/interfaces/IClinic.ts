export interface IClinic {
  id: string;
  oralsin_clinic_id: number;
  name: string;
  cnpj?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface IClinicCreateDTO {
  name: string;
  cnpj?: string | null;
}

export interface IClinicUpdateDTO extends Partial<IClinicCreateDTO> {}