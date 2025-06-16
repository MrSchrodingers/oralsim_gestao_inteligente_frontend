export interface IPendingSync {
  id: string;
  object_type: 'clinic' | 'patient';
  object_api_id?: number | null;
  action: string;
  new_data: any;
  old_data?: any | null;
  status: 'pending' | 'approved' | 'rejected' | 'applied';
  processed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}