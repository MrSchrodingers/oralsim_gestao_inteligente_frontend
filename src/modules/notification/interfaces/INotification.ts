export interface ISendManualNotificationRequest {
  patient_id: string;
  contract_id: string;
  channel: 'sms' | 'whatsapp' | 'email' | 'phonecall';
  message_id: string;
}

export interface IRunAutomatedNotificationsRequest {
  clinic_id: string;
  batch_size?: number;
  only_pending?: boolean;
  channel?: 'sms' | 'whatsapp' | 'email' | 'phonecall';
}