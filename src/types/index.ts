export type NavigationPath = 
  | 'dashboard'
  | 'customers'
  | 'debts'
  | 'payments'
  | 'create-debt'
  | 'sms-marketing'
  | 'financial-reports'
  | 'debt-calendar'
  | 'employees'
  | 'shops'
  | 'ai-assistant'
  | 'settings';

export type PaymentMethod = 'cash' | 'card' | 'split' | 'transfer';

export type DebtStatus = 'active' | 'overdue' | 'settled' | 'partial' | 'due_today';

export interface Customer {
  id: string;
  code: string;
  name: string;
  phone: string;
  passport?: string;
  address: string;
  branch: string;
  rating: 'A+' | 'A' | 'B' | 'C' | 'D';
  creditLimit: number;
  totalDebt: number;
  paidAmount: number;
  remainingDebt: number;
  dueDate: string;
  status: DebtStatus;
  avatarUrl?: string;
  notes?: string;
}

export interface CartItem {
  id: string;
  name: string;
  subtitle: string;
  sku: string;
  quantity: number;
  unitPrice: number;
}

export interface PaymentTransaction {
  id: string;
  receiptNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  totalAmount: number;
  cashAmount: number;
  cardAmount: number;
  method: PaymentMethod;
  cashierName: string;
  branch: string;
  previousBalance: number;
  remainingBalance: number;
  status: 'completed' | 'partial';
}

export interface DebtContract {
  id: string;
  contractNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  startDate: string;
  dueDate: string;
  termDays: number;
  status: DebtStatus;
  branch: string;
  items: CartItem[];
  notes?: string;
  collateralInfo?: string;
  hasCollateralFile?: boolean;
  collateralFileName?: string;
}

export interface SMSNotice {
  id: string;
  recipientPhone: string;
  recipientName: string;
  message: string;
  sentAt: string;
  status: 'delivered' | 'pending' | 'failed';
  type: 'due_reminder' | 'payment_confirmation' | 'overdue_warning' | 'marketing';
}
