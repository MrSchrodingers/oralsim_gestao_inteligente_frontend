export interface IFlowStepConfig {
  id: string;
  step_number: number;
  channels: ('sms' | 'whatsapp' | 'email' | 'phonecall' | 'letter')[];
  cooldown_days: number;
  active: boolean;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}