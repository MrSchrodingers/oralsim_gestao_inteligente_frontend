export interface IPaymentSummary {
  id: string;
  patient: string;
  amount: string;
  date: string;
  status: string;
}

export interface INotificationSummary {
  pendingSchedules: number;
  sentNotifications: number;
  pendingCalls: number;
  byStep: { [key: number]: number };
}

export interface ICollectionSummary {
  totalCases: number;
  withPipeboard: number;
  withoutPipeboard: number;
  overdueMinDaysPlus: number;
  overduePatients: number;
  preOverduePatients: number;
}

export interface IStats {
  totalReceivables: string;
  paidThisMonth: string;
  pendingPayments: string;
  overduePayments: string;
  collectionRate: number;
  totalContracts: number;
  totalPatients: number;
  averageDaysOverdue: number;
  overdueContracts: number;
}

export interface IDashboardSummary {
  stats: IStats;
  recentPayments: IPaymentSummary[];
  pendingPayments: IPaymentSummary[];
  notification?: INotificationSummary | null;
  collection?: ICollectionSummary | null;
}