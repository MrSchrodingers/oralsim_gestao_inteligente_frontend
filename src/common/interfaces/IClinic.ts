export interface IClinic {
  id: string;
  oralsin_clinic_id: number;
  name: string;
  cnpj?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface IClinicSummary {
  id: string,
  name: string,
  total_patients: number,
  active_patients: number,
  receivables: number,
  collection_cases: number,
  monthly_revenue: string
}

export interface IClinicCreateDTO {
  name: string;
  cnpj?: string | null;
}

export type IClinicUpdateDTO = Partial<IClinicCreateDTO>