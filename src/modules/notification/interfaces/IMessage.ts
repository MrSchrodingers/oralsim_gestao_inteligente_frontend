export interface IMessage {
  id: string;
  type: 'sms' | 'email' | 'whatsapp' | 'phonecall';
  content: string;
  step: number;
  clinic_id?: string | null;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface IMessageCreateDTO {
  type: 'sms' | 'email' | 'whatsapp' | 'phonecall';
  content: string;
  step: number;
  clinic_id?: string | null;
  is_default?: boolean;
}

export type IMessageUpdateDTO = Partial<IMessageCreateDTO>