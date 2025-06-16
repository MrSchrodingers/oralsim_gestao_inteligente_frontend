export interface IContactSchedule {
  id: string;
  patient_id: string;
  contract_id?: string | null;
  clinic_id: string;
  current_step: number;
  channel: string;
  scheduled_date: string;
  status?: string | null;
  notification_trigger?: string;
  advance_flow: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface IContactScheduleCreateDTO {
  patient_id: string;
  contract_id?: string | null;
  clinic_id: string;
  current_step: number;
  channel: string;
  scheduled_date: string;
  status?: string | null;
  installment_id?: string | null;
}

export interface IContactScheduleUpdateDTO extends Partial<IContactScheduleCreateDTO> {}