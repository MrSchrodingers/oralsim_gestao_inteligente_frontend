import type { IClinic } from "@/src/common/interfaces/IClinic";
import type { IContract } from "@/src/common/interfaces/IContract";
import type { IPatient } from "@/src/common/interfaces/IPatient";
import type { IContactSchedule } from "./IContactSchedule";

export interface IPendingCall {
  id: string;
  patient_id: string;
  contract_id: string;
  clinic_id: string;
  schedule_id?: string | null;

  patient: IPatient;
  contract: IContract;
  clinic: IClinic;
  schedule?: IContactSchedule | null;

  current_step: number;
  scheduled_at: string;
  last_attempt_at?: string | null;
  attempts: number;
  status: 'pending' | 'done' | 'failed';
  result_notes?: string | null;
}
