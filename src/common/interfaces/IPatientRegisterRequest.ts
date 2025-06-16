export interface IPatientRegisterRequest {
  initial_due_date: string; // YYYY-MM-DD
  final_due_date: string;   // YYYY-MM-DD
  user_id?: string | null;
}