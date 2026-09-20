import { Customer, CartItem, PaymentTransaction, DebtContract, SMSNotice } from '../types';

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    code: '#CUST-1049',
    name: 'Aliyev Azizbek',
    phone: '+998 90 123-45-67',
    passport: 'AA 7182904',
    address: 'Toshkent sh., Chilonzor 9-kvartal, 12-uy',
    branch: 'Toshkent markaziy filiali',
    rating: 'A+',
    creditLimit: 15000000,
    totalDebt: 12400000,
    paidAmount: 10200000,
    remainingDebt: 2200000,
    dueDate: '28.10.2024',
    status: 'partial',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    notes: 'Ish haqi 25-sanada tushadi, doimiy mijoz. To‘lov intizomi a’lo darajada.'
  },
  {
    id: 'cust-2',
    code: '#CUST-0892',
    name: 'Toshmatov Olimjon',
    phone: '+998 93 456-78-90',
    passport: 'AB 8839120',
    address: 'Samarqand sh., Registon ko‘chasi, 44',
    branch: 'Samarqand shahar filiali',
    rating: 'C',
    creditLimit: 6000000,
    totalDebt: 5800000,
    paidAmount: 1200000,
    remainingDebt: 4600000,
    dueDate: '15.10.2024',
    status: 'overdue',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    notes: 'Kechiktirilgan to‘lov bo‘yicha 2 marta SMS ogohlantirish yuborildi.'
  },
  {
    id: 'cust-3',
    code: '#CUST-1120',
    name: 'Rahimova Shahnoza',
    phone: '+998 97 789-01-23',
    passport: 'AC 5519283',
    address: 'Toshkent sh., Yunusobod 4-mavze',
    branch: 'Toshkent markaziy filiali',
    rating: 'A+',
    creditLimit: 20000000,
    totalDebt: 3150000,
    paidAmount: 3150000,
    remainingDebt: 0,
    dueDate: '20.10.2024',
    status: 'settled',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    notes: 'Qarz to‘liq yopildi. Kredit limiti 20 mln gacha oshirilgan.'
  },
  {
    id: 'cust-4',
    code: '#CUST-0743',
    name: 'Yusupov Bobur',
    phone: '+998 99 234-56-78',
    passport: 'AD 9012384',
    address: 'Andijon sh., Bobur shoh ko‘chasi, 19',
    branch: 'Andijon filiali',
    rating: 'B',
    creditLimit: 10000000,
    totalDebt: 8500000,
    paidAmount: 4000000,
    remainingDebt: 4500000,
    dueDate: 'Bugun (24.10)',
    status: 'due_today',
    notes: 'Bugun to‘lov kuni, ertalabki eslatma SMS yuborildi.'
  },
  {
    id: 'cust-5',
    code: '#CUST-1288',
    name: 'Umarov Jasur',
    phone: '+998 94 345-67-89',
    passport: 'AE 3381940',
    address: 'Toshkent sh., Mirobod tumani, 8',
    branch: 'Toshkent markaziy filiali',
    rating: 'A',
    creditLimit: 8000000,
    totalDebt: 1200000,
    paidAmount: 300000,
    remainingDebt: 900000,
    dueDate: '05.11.2024',
    status: 'active',
    notes: 'Birinchi marotaba nasiya rasmiylashtirdi.'
  },
  {
    id: 'cust-6',
    code: '#CUST-1304',
    name: 'Karimov Dilshod',
    phone: '+998 91 555-43-21',
    passport: 'AF 6619028',
    address: 'Toshkent sh., Sergeli 7-mavze',
    branch: 'Toshkent markaziy filiali',
    rating: 'B',
    creditLimit: 15000000,
    totalDebt: 14800000,
    paidAmount: 6200000,
    remainingDebt: 8600000,
    dueDate: '30.10.2024',
    status: 'active',
    notes: 'Oylik grafik bo‘yicha to‘lab bormoqda.'
  }
];

export const INITIAL_PRODUCTS: CartItem[] = [
  {
    id: 'prod-1',
    name: 'Samsung Galaxy A54 8/128GB Black',
    subtitle: 'IMEI: 864291054321098 • Kafolat: 12 oy',
    sku: '8806091240182',
    quantity: 1,
    unitPrice: 3850000
  },
  {
    id: 'prod-2',
    name: "Smartfon g'ilofi va himoya oynasi (Case & Glass)",
    subtitle: 'A54 Silicone Shockproof + 9D Shisha',
    sku: 'ACC-9941-GL',
    quantity: 2,
    unitPrice: 65000
  },
  {
    id: 'prod-3',
    name: 'Original 25W zaryadlovchi adapter',
    subtitle: 'Type-C Power Delivery Fast Charge',
    sku: '8801643981245',
    quantity: 1,
    unitPrice: 180000
  }
];

export const CATALOG_PRODUCTS = [
  {
    id: 'cat-1',
    name: 'Samsung Galaxy A54 8/128GB Black',
    subtitle: 'IMEI: 864291054321098 • Kafolat: 12 oy',
    sku: '8806091240182',
    price: 3850000
  },
  {
    id: 'cat-2',
    name: "Smartfon g'ilofi va himoya oynasi (Case & Glass)",
    subtitle: 'A54 Silicone Shockproof + 9D Shisha',
    sku: 'ACC-9941-GL',
    price: 65000
  },
  {
    id: 'cat-3',
    name: 'Original 25W zaryadlovchi adapter',
    subtitle: 'Type-C Power Delivery Fast Charge',
    sku: '8801643981245',
    price: 180000
  },
  {
    id: 'cat-4',
    name: 'Apple iPhone 15 Pro 128GB Natural Titanium',
    subtitle: 'IMEI: 359128091823901 • Apple 1-yil kafolat',
    sku: '019594901923',
    price: 13200000
  },
  {
    id: 'cat-5',
    name: 'Apple AirPods Pro 2 (USB-C)',
    subtitle: 'MagSafe Case • Active Noise Cancellation',
    sku: '194253397472',
    price: 2750000
  },
  {
    id: 'cat-6',
    name: 'Xiaomi Redmi Note 13 Pro 8/256GB Midnight Black',
    subtitle: '200MP OIS Kamera • 67W Turbo Charge',
    sku: '6941812759124',
    price: 2890000
  }
];

export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'tx-1',
    receiptNumber: '#PAY-8492',
    customerId: 'cust-1',
    customerName: 'Aziz Aliyev',
    customerPhone: '+998 90 123-45-67',
    date: '24.10.2024',
    time: '14:32:10',
    totalAmount: 50000,
    cashAmount: 30000,
    cardAmount: 20000,
    method: 'split',
    cashierName: 'Nodir Bek (Kassa 1)',
    branch: 'Toshkent markaziy filiali',
    previousBalance: 150000,
    remainingBalance: 100000,
    status: 'partial'
  },
  {
    id: 'tx-2',
    receiptNumber: '#PAY-8491',
    customerId: 'cust-6',
    customerName: 'Dilshod Karimov',
    customerPhone: '+998 91 555-43-21',
    date: '24.10.2024',
    time: '13:15:40',
    totalAmount: 2000000,
    cashAmount: 2000000,
    cardAmount: 0,
    method: 'cash',
    cashierName: 'Azizbek Rahimov',
    branch: 'Toshkent markaziy filiali',
    previousBalance: 10600000,
    remainingBalance: 8600000,
    status: 'partial'
  },
  {
    id: 'tx-3',
    receiptNumber: '#PAY-8490',
    customerId: 'cust-2',
    customerName: 'Olimjon Toshmatov',
    customerPhone: '+998 93 456-78-90',
    date: '24.10.2024',
    time: '11:45:02',
    totalAmount: 1200000,
    cashAmount: 0,
    cardAmount: 1200000,
    method: 'card',
    cashierName: 'Nodir Bek (Kassa 1)',
    branch: 'Samarqand shahar filiali',
    previousBalance: 5800000,
    remainingBalance: 4600000,
    status: 'partial'
  },
  {
    id: 'tx-4',
    receiptNumber: '#PAY-8489',
    customerId: 'cust-3',
    customerName: 'Shahnoza Rahimova',
    customerPhone: '+998 97 789-01-23',
    date: '23.10.2024',
    time: '17:20:18',
    totalAmount: 3150000,
    cashAmount: 0,
    cardAmount: 3150000,
    method: 'card',
    cashierName: 'Azizbek Rahimov',
    branch: 'Toshkent markaziy filiali',
    previousBalance: 3150000,
    remainingBalance: 0,
    status: 'completed'
  },
  {
    id: 'tx-5',
    receiptNumber: '#PAY-8488',
    customerId: 'cust-5',
    customerName: 'Jasur Umarov',
    customerPhone: '+998 94 345-67-89',
    date: '23.10.2024',
    time: '15:10:00',
    totalAmount: 300000,
    cashAmount: 150000,
    cardAmount: 150000,
    method: 'split',
    cashierName: 'Nodir Bek (Kassa 1)',
    branch: 'Toshkent markaziy filiali',
    previousBalance: 1200000,
    remainingBalance: 900000,
    status: 'partial'
  }
];

export const INITIAL_DEBTS: DebtContract[] = [
  {
    id: 'debt-1',
    contractNumber: 'DEBT-2024-8841',
    customerId: 'cust-1',
    customerName: 'Aliyev Azizbek',
    customerPhone: '+998 90 123-45-67',
    totalAmount: 4160000,
    paidAmount: 1660000,
    remainingAmount: 2500000,
    startDate: '25.10.2024',
    dueDate: '25.11.2024',
    termDays: 30,
    status: 'active',
    branch: 'Toshkent markaziy filiali',
    items: INITIAL_PRODUCTS,
    notes: 'Ish haqi 25-sanada tushadi, qolgan 2.5 mln to‘liq to‘lanadi.',
    collateralInfo: 'Passport nusxasi ilova qilindi.',
    hasCollateralFile: true,
    collateralFileName: 'pasport_seriya_AA7182.pdf'
  },
  {
    id: 'debt-2',
    contractNumber: 'DEBT-2024-8820',
    customerId: 'cust-2',
    customerName: 'Toshmatov Olimjon',
    customerPhone: '+998 93 456-78-90',
    totalAmount: 5800000,
    paidAmount: 1200000,
    remainingAmount: 4600000,
    startDate: '15.09.2024',
    dueDate: '15.10.2024',
    termDays: 30,
    status: 'overdue',
    branch: 'Samarqand shahar filiali',
    items: [
      {
        id: 'p-10',
        name: 'Xiaomi Redmi Note 13 Pro 8/256GB',
        subtitle: '200MP OIS Kamera',
        sku: '6941812759124',
        quantity: 2,
        unitPrice: 2900000
      }
    ],
    notes: 'Kechiktirilgan, mijoz bilan bog‘lanildi.'
  },
  {
    id: 'debt-3',
    contractNumber: 'DEBT-2024-8792',
    customerId: 'cust-4',
    customerName: 'Yusupov Bobur',
    customerPhone: '+998 99 234-56-78',
    totalAmount: 8500000,
    paidAmount: 4000000,
    remainingAmount: 4500000,
    startDate: '24.09.2024',
    dueDate: 'Bugun (24.10)',
    termDays: 30,
    status: 'due_today',
    branch: 'Andijon filiali',
    items: [],
    notes: 'Bugun qarz to‘lovi kutilmoqda.'
  }
];

export const INITIAL_SMS_LOGS: SMSNotice[] = [
  {
    id: 'sms-1',
    recipientPhone: '+998 90 123-45-67',
    recipientName: 'Aziz Aliyev',
    message: 'Hurmatli Aziz Aliyev! Bunyod Group do‘konidagi to‘lovingiz qabul qilindi: 50,000 UZS. Qoldiq: 100,000 UZS. Rahmat!',
    sentAt: '24.10.2024 14:32',
    status: 'delivered',
    type: 'payment_confirmation'
  },
  {
    id: 'sms-2',
    recipientPhone: '+998 99 234-56-78',
    recipientName: 'Bobur Yusupov',
    message: 'Hurmatli Bobur Yusupov! Eslatib o‘tamiz, bugun 24.10.2024 sizning 4,500,000 UZS miqdoridagi to‘lov kuningiz. Kassa: Bunyod Group.',
    sentAt: '24.10.2024 09:00',
    status: 'delivered',
    type: 'due_reminder'
  },
  {
    id: 'sms-3',
    recipientPhone: '+998 93 456-78-90',
    recipientName: 'Olimjon Toshmatov',
    message: 'DIQQAT! Olimjon Toshmatov, sizning to‘lov muddatingiz 9 kunga o‘tib ketdi. Qarz miqdori: 4,600,000 UZS. Iltimos, kassaga murojaat qiling.',
    sentAt: '23.10.2024 11:15',
    status: 'delivered',
    type: 'overdue_warning'
  }
];

export const BRANCHES = [
  { id: 'b-1', name: 'Toshkent markaziy filiali', company: 'Bunyod Group', address: 'Chilonzor 9, 12' },
  { id: 'b-2', name: 'Samarqand shahar filiali', company: 'Bunyod Group', address: 'Registon ko‘chasi, 44' },
  { id: 'b-3', name: 'Andijon filiali', company: 'Bunyod Group', address: 'Bobur shoh, 19' }
];

export const BRAND_LOGO_URL = 'https://lh3.googleusercontent.com/aida/AEtjO1UyAPEi3yii6-_3vpbEoK9EyknkJ3aNu_jEKiu7tulHFXq-AACcAOLCEqx-SM1bwRTrx7VrXoIE1Lo50RZ_vDLcbh8WWRm2Ip01nPU0fqx_CYe3c2I6v-eDQxOMbKLkeIp_e4bc7owkf8oMyF7vdjMpp-vx2EyRPKIEdncb8SMpEbK-v9ex-w6czMpGbTzDG0s1bA7JHmDRtswcGHVbJIfZxKJv3NQTvyR9URNpQ0NN';

export const formatCurrency = (val: number): string => {
  return new Intl.NumberFormat('uz-UZ').format(val);
};
