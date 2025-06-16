export interface IMessage {
  id: string;
  type: 'sms' | 'email' | 'whatsapp';
  content: string;
  step: number;
  clinic_id?: string | null;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface IMessageCreateDTO {
  type: 'sms' | 'email' | 'whatsapp';
  content: string;
  step: number;
  clinic_id?: string | null;
  is_default?: boolean;
}

export interface IMessageUpdateDTO extends Partial<IMessageCreateDTO> {}