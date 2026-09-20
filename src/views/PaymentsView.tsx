import React, { useState } from 'react';
import { Customer, PaymentTransaction, PaymentMethod } from '../types';
import { formatCurrency } from '../data/mockData';

interface PaymentsViewProps {
  customers: Customer[];
  transactions: PaymentTransaction[];
  onAddTransaction: (transaction: PaymentTransaction) => void;
  onUpdateCustomerDebt: (customerId: string, amountPaid: number) => void;
  onOpenReceiptModal: (transaction: PaymentTransaction) => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  customers,
  transactions,
  onAddTransaction,
  onUpdateCustomerDebt,
  onOpenReceiptModal
}) => {
  // Selected customer for settlement
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || 'cust-1');
  const activeCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  // Settlement state
  const [totalPayment, setTotalPayment] = useState<number>(50000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('split');
  const [cashAmount, setCashAmount] = useState<number>(30000);
  const [cardAmount, setCardAmount] = useState<number>(20000);
  const [sendSmsCheck, setSendSmsCheck] = useState<boolean>(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'last_month' | 'quarter'>('month');
  const [methodFilter, setMethodFilter] = useState<'all' | 'cash' | 'card' | 'split'>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [receiptSuccess, setReceiptSuccess] = useState<boolean>(false);

  // Sync split values when total changes or method changes
  const handleTotalChange = (newTotal: number) => {
    setTotalPayment(newTotal);
    if (paymentMethod === 'cash') {
      setCashAmount(newTotal);
      setCardAmount(0);
    } else if (paymentMethod === 'card') {
      setCashAmount(0);
      setCardAmount(newTotal);
    } else {
      // 60/40 ratio default
      const cashPart = Math.round(newTotal * 0.6);
      setCashAmount(cashPart);
      setCardAmount(newTotal - cashPart);
    }
  };

  const handleMethodSelect = (method: PaymentMethod) => {
    setPaymentMethod(method);
    if (method === 'cash') {
      setCashAmount(totalPayment);
      setCardAmount(0);
    } else if (method === 'card') {
      setCashAmount(0);
      setCardAmount(totalPayment);
    } else if (method === 'split') {
      const cashPart = Math.round(totalPayment * 0.6);
      setCashAmount(cashPart);
      setCardAmount(totalPayment - cashPart);
    }
  };

  const splitDifference = totalPayment - (cashAmount + cardAmount);
  const isSplitBalanced = splitDifference === 0;

  const currentCustomerOldDebt = activeCustomer ? activeCustomer.remainingDebt : 150000;
  const resultingDebt = Math.max(0, currentCustomerOldDebt - totalPayment);
  const isFullySettled = resultingDebt === 0;

  // Confirmation of payment
  const handleConfirmPayment = () => {
    if (totalPayment <= 0) {
      alert("Iltimos, to'lov summasini kiriting!");
      return;
    }
    if (paymentMethod === 'split' && !isSplitBalanced) {
      alert(`Aralash to'lov summasi to'liq mos kelmadi! Farq: ${formatCurrency(Math.abs(splitDifference))} UZS`);
      return;
    }

    const receiptNum = `#PAY-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const dateStr = now.toLocaleDateString('ru-RU');
    const timeStr = now.toLocaleTimeString('ru-RU');

    const newTx: PaymentTransaction = {
      id: `tx-${Date.now()}`,
      receiptNumber: receiptNum,
      customerId: activeCustomer.id,
      customerName: activeCustomer.name,
      customerPhone: activeCustomer.phone,
      date: dateStr,
      time: timeStr,
      totalAmount: totalPayment,
      cashAmount: paymentMethod === 'cash' ? totalPayment : paymentMethod === 'split' ? cashAmount : 0,
      cardAmount: paymentMethod === 'card' ? totalPayment : paymentMethod === 'split' ? cardAmount : 0,
      method: paymentMethod,
      cashierName: 'Nodir Bek (Kassa 1)',
      branch: 'Toshkent markaziy filiali',
      previousBalance: currentCustomerOldDebt,
      remainingBalance: resultingDebt,
      status: resultingDebt === 0 ? 'completed' : 'partial'
    };

    onAddTransaction(newTx);
    onUpdateCustomerDebt(activeCustomer.id, totalPayment);
    setReceiptSuccess(true);
    setTimeout(() => setReceiptSuccess(false), 3000);
  };

  // Filtered transactions for the ledger table
  const filteredTransactions = transactions.filter(t => {
    const matchesMethod = methodFilter === 'all' || t.method === methodFilter;
    const matchesSearch = 
      t.customerName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.receiptNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.customerPhone.includes(searchFilter);
    return matchesMethod && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full gap-space-lg relative">
      {/* Top Bar & Summary Statistics */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-1">
            <span>Kassa amaliyotlari</span>
            <span>•</span>
            <span className="text-secondary font-bold">Oktyabr 2024</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
            To'lovlar Tarixi & Tranzaksiyalar
          </h1>
        </div>

        <div className="flex items-center gap-space-sm flex-wrap">
          <div className="flex items-center bg-surface-container-low rounded-lg p-1 border border-outline-variant/20">
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-space-md py-1.5 rounded-lg font-label-md text-label-md transition-all ${
                selectedPeriod === 'month'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Ushbu oy
            </button>
            <button
              onClick={() => setSelectedPeriod('last_month')}
              className={`px-space-md py-1.5 rounded-lg font-label-md text-label-md transition-all ${
                selectedPeriod === 'last_month'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              O'tgan oy
            </button>
            <button
              onClick={() => setSelectedPeriod('quarter')}
              className={`px-space-md py-1.5 rounded-lg font-label-md text-label-md transition-all ${
                selectedPeriod === 'quarter'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Chorak
            </button>
          </div>

          <button
            id="openModalBtn"
            onClick={() => {
              window.scrollTo({ top: 380, behavior: 'smooth' });
            }}
            className="h-10 px-space-lg bg-primary text-on-primary hover:bg-primary-container font-label-lg text-label-lg rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add_card</span>
            <span>+ Yangi To'lov Qabul Qilish</span>
            <span className="ml-1 px-1.5 py-0.5 rounded bg-surface-container-highest/30 font-mono text-[10px] text-primary-fixed">
              F2
            </span>
          </button>
        </div>
      </div>

      {/* Bento Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
        {/* Total Collected */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-space-sm">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Jami to'lovlar (Oy)
            </span>
            <div className="w-8 h-8 rounded-lg bg-secondary-fixed/50 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[18px]">account_balance</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-metric-display text-metric-display text-on-surface tracking-tight">
              142,800,000 <span className="text-sm font-normal text-on-surface-variant">UZS</span>
            </div>
            <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-tertiary-container">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span className="font-bold">+18.4%</span>
              <span className="text-on-surface-variant font-normal">o'tgan oyga nisbatan</span>
            </div>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full mt-space-md overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: '82%' }} />
          </div>
        </div>

        {/* Cash Settlement */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-space-sm">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Naqd to'lovlar
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-metric-display text-metric-display text-on-surface tracking-tight">
              76,500,000 <span className="text-sm font-normal text-on-surface-variant">UZS</span>
            </div>
            <div className="flex items-center justify-between font-label-sm text-label-sm">
              <span className="text-on-surface-variant">53.6% umumiy ulush</span>
              <span className="font-semibold text-on-surface">192 ta kvitansiya</span>
            </div>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full mt-space-md overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: '53.6%' }} />
          </div>
        </div>

        {/* Card Settlement */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-space-sm">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Karta (Uzcard/Humo)
            </span>
            <div className="w-8 h-8 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary-container">
              <span className="material-symbols-outlined text-[18px]">credit_card</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-metric-display text-metric-display text-on-surface tracking-tight">
              48,300,000 <span className="text-sm font-normal text-on-surface-variant">UZS</span>
            </div>
            <div className="flex items-center justify-between font-label-sm text-label-sm">
              <span className="text-on-surface-variant">33.8% terminal orqali</span>
              <span className="font-semibold text-on-surface">114 ta kvitansiya</span>
            </div>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full mt-space-md overflow-hidden">
            <div className="bg-secondary-container h-full rounded-full" style={{ width: '33.8%' }} />
          </div>
        </div>

        {/* Mixed Settlement Highlight */}
        <div className="bg-primary-container p-space-lg rounded-xl shadow-md text-on-primary flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-secondary-container/20 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-space-sm">
            <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider">
              Aralash to'lovlar (Split)
            </span>
            <div className="w-8 h-8 rounded-lg bg-primary-fixed/10 flex items-center justify-center text-tertiary-fixed">
              <span className="material-symbols-outlined text-[18px]">sync_alt</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-metric-display text-metric-display text-on-primary tracking-tight">
              18,000,000 <span className="text-sm font-normal text-primary-fixed-dim">UZS</span>
            </div>
            <div className="flex items-center justify-between font-label-sm text-label-sm">
              <span className="text-primary-fixed-dim">12.6% gibrid kassa</span>
              <span className="font-semibold text-tertiary-fixed">42 ta operatsiya</span>
            </div>
          </div>
          <div className="w-full bg-primary-fixed/20 h-1 rounded-full mt-space-md overflow-hidden">
            <div className="bg-tertiary-fixed h-full rounded-full" style={{ width: '12.6%' }} />
          </div>
        </div>
      </div>

      {/* Operational Filter Row */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
          <button
            onClick={() => setMethodFilter('all')}
            className={`px-space-md py-2 rounded-lg font-label-md text-label-md font-semibold flex items-center gap-2 transition-all ${
              methodFilter === 'all'
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
            }`}
          >
            <span>Barchasi</span>
            <span className="px-1.5 py-0.5 rounded-full bg-surface-container-lowest/20 text-xs">
              {transactions.length}
            </span>
          </button>
          <button
            onClick={() => setMethodFilter('cash')}
            className={`px-space-md py-2 rounded-lg font-label-md text-label-md flex items-center gap-2 transition-all ${
              methodFilter === 'cash'
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
            }`}
          >
            <span>Naqd</span>
            <span className="px-1.5 py-0.5 rounded bg-surface-container text-xs">
              {transactions.filter(t => t.method === 'cash').length || 192}
            </span>
          </button>
          <button
            onClick={() => setMethodFilter('card')}
            className={`px-space-md py-2 rounded-lg font-label-md text-label-md flex items-center gap-2 transition-all ${
              methodFilter === 'card'
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
            }`}
          >
            <span>Karta (POS)</span>
            <span className="px-1.5 py-0.5 rounded bg-surface-container text-xs">
              {transactions.filter(t => t.method === 'card').length || 114}
            </span>
          </button>
          <button
            onClick={() => setMethodFilter('split')}
            className={`px-space-md py-2 rounded-lg font-label-md text-label-md flex items-center gap-2 transition-all ${
              methodFilter === 'split'
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
            }`}
          >
            <span>Aralash (Split)</span>
            <span className="px-1.5 py-0.5 rounded bg-secondary-fixed/50 text-secondary font-semibold text-xs">
              {transactions.filter(t => t.method === 'split').length || 42}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-space-sm flex-wrap lg:flex-nowrap">
          <div className="relative flex-1 sm:w-64">
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest border border-transparent focus:border-secondary shadow-inner"
              placeholder="ID, mijoz yoki kassir..."
            />
          </div>
          <div className="flex items-center gap-1 bg-surface-container-low px-space-sm py-1 rounded-lg border border-outline-variant/20">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">calendar_today</span>
            <span className="font-label-sm text-label-sm text-on-surface font-medium">01.10.2024 - 24.10.2024</span>
          </div>
          <button 
            onClick={() => alert("To'lovlar ro'yxati Excel formatida eksport qilindi.")}
            className="h-9 w-9 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface flex items-center justify-center hover:bg-surface-container border border-outline-variant/20"
            title="Eksport qilish"
          >
            <span className="material-symbols-outlined text-[20px]">file_download</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Active Settlement Dialog + Live Receipt Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg" id="paymentWorkflowGrid">
        {/* LEFT: Interactive Mixed Payment Modal Card (Demonstration & Action Hub) */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-space-lg rounded-xl shadow-md border border-outline-variant/20 flex flex-col justify-between">
          <div className="space-y-space-md">
            {/* Dialog Header */}
            <div className="flex items-start justify-between pb-space-sm border-b border-outline-variant/20">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-secondary text-on-secondary font-mono font-bold text-xs">
                    #PAY-8492
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Yangi Kassa Kirimi
                  </span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                  To'lov Qabul Qilish
                </h2>
              </div>
              <div className="text-right">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Kassir</span>
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse" />
                  <span className="font-label-md text-label-md font-semibold text-on-surface">
                    Nodir Bek (Kassa 1)
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Identity Ribbon & Selector */}
            <div className="p-space-md bg-surface-container-low rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border border-outline-variant/20">
              <div className="flex items-center gap-space-sm min-w-0">
                <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary font-bold">
                  {activeCustomer.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="font-label-lg text-label-lg font-bold text-on-surface truncate bg-transparent focus:outline-none cursor-pointer"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    {activeCustomer.phone} • {activeCustomer.branch}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-label-sm text-label-sm text-on-surface-variant">
                  Qarzdorlik balansi
                </div>
                <div className="font-headline-md text-headline-md text-error font-bold tracking-tight">
                  {formatCurrency(currentCustomerOldDebt)} <span className="text-xs font-normal">UZS</span>
                </div>
              </div>
            </div>

            {/* Amount to Settle Input + Quick Chips */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-label-md text-label-md font-semibold text-on-surface">
                  To'lov summasi
                </label>
                <span className="font-label-sm text-label-sm text-secondary">
                  Qarzdorlikdan chegiriladi
                </span>
              </div>
              <div className="relative flex items-center">
                <input
                  id="totalPayInput"
                  type="number"
                  value={totalPayment}
                  onChange={(e) => handleTotalChange(Number(e.target.value) || 0)}
                  className="w-full h-11 pl-4 pr-16 bg-surface-container-low rounded-lg font-headline-md text-headline-md text-on-surface font-bold focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary border border-outline-variant/30 shadow-inner"
                  placeholder="0"
                />
                <span className="absolute right-3.5 font-label-md text-label-md text-on-surface-variant font-semibold">
                  UZS
                </span>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleTotalChange(25000)}
                  className={`px-2.5 py-1 rounded font-label-sm text-label-sm transition-all active:scale-95 ${
                    totalPayment === 25000
                      ? 'bg-secondary text-on-secondary font-bold'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  25,000
                </button>
                <button
                  type="button"
                  onClick={() => handleTotalChange(50000)}
                  className={`px-2.5 py-1 rounded font-label-sm text-label-sm transition-all active:scale-95 ${
                    totalPayment === 50000
                      ? 'bg-secondary text-on-secondary font-bold'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  50,000
                </button>
                <button
                  type="button"
                  onClick={() => handleTotalChange(100000)}
                  className={`px-2.5 py-1 rounded font-label-sm text-label-sm transition-all active:scale-95 ${
                    totalPayment === 100000
                      ? 'bg-secondary text-on-secondary font-bold'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  100,000
                </button>
                <button
                  type="button"
                  onClick={() => handleTotalChange(currentCustomerOldDebt)}
                  className="px-2.5 py-1 rounded bg-primary text-on-primary font-label-sm text-label-sm font-bold hover:bg-primary-container active:scale-95 transition-all ml-auto"
                >
                  To'liq: {formatCurrency(currentCustomerOldDebt)}
                </button>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div>
              <label className="font-label-md text-label-md font-semibold text-on-surface block mb-2">
                To'lov shakli
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div
                  onClick={() => handleMethodSelect('cash')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg cursor-pointer transition-all border ${
                    paymentMethod === 'cash'
                      ? 'bg-primary-container text-on-primary shadow-sm ring-2 ring-secondary border-secondary'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">payments</span>
                  <span className="font-label-md text-label-md font-medium">Naqd</span>
                </div>

                <div
                  onClick={() => handleMethodSelect('card')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg cursor-pointer transition-all border ${
                    paymentMethod === 'card'
                      ? 'bg-primary-container text-on-primary shadow-sm ring-2 ring-secondary border-secondary'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">credit_card</span>
                  <span className="font-label-md text-label-md font-medium">Karta</span>
                </div>

                <div
                  onClick={() => handleMethodSelect('split')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg cursor-pointer transition-all border ${
                    paymentMethod === 'split'
                      ? 'bg-primary-container text-on-primary shadow-sm ring-2 ring-secondary border-secondary'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] text-tertiary-fixed">sync_alt</span>
                  <span className="font-label-md text-label-md font-bold">Aralash (Split)</span>
                </div>
              </div>
            </div>

            {/* Live Split Calculation & Validation Matrix (if split is active) */}
            {paymentMethod === 'split' && (
              <div className="p-space-md rounded-xl bg-surface-container-low space-y-space-md border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface">
                    Aralash taqsimot kalkulyatori
                  </span>
                  <span className="px-2 py-0.5 rounded bg-tertiary-fixed-dim/30 text-on-tertiary-fixed-variant font-label-sm text-[11px] font-bold">
                    Avtomatik balanslash
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  {/* Cash Input */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-label-sm text-label-sm font-medium text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">money</span> Naqd pul:
                      </span>
                      <span className="text-on-surface-variant font-mono">
                        {totalPayment > 0 ? Math.round((cashAmount / totalPayment) * 100) : 0}%
                      </span>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        id="cashInput"
                        type="number"
                        value={cashAmount}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 0;
                          setCashAmount(val);
                          setCardAmount(Math.max(0, totalPayment - val));
                        }}
                        className="w-full h-10 pl-3 pr-14 bg-surface-container-lowest rounded-lg font-headline-md text-headline-md text-on-surface font-bold focus:outline-none shadow-sm text-right border border-outline-variant/30"
                      />
                      <span className="absolute right-3 font-label-sm text-label-sm text-on-surface-variant">
                        UZS
                      </span>
                    </div>
                  </div>

                  {/* Card Input */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-label-sm text-label-sm font-medium text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">credit_card</span> Karta (Humo/Uzcard):
                      </span>
                      <span className="text-on-surface-variant font-mono">
                        {totalPayment > 0 ? Math.round((cardAmount / totalPayment) * 100) : 0}%
                      </span>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        id="cardInput"
                        type="number"
                        value={cardAmount}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 0;
                          setCardAmount(val);
                          setCashAmount(Math.max(0, totalPayment - val));
                        }}
                        className="w-full h-10 pl-3 pr-14 bg-surface-container-lowest rounded-lg font-headline-md text-headline-md text-on-surface font-bold focus:outline-none shadow-sm text-right border border-outline-variant/30"
                      />
                      <span className="absolute right-3 font-label-sm text-label-sm text-on-surface-variant">
                        UZS
                      </span>
                    </div>
                  </div>
                </div>

                {/* Formula & Validation status bar */}
                <div className="p-2.5 rounded-lg bg-surface-container-lowest flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs ${
                        isSplitBalanced
                          ? 'bg-on-tertiary-container text-surface-container-lowest'
                          : 'bg-error text-on-error'
                      }`}
                    >
                      {isSplitBalanced ? '✓' : '!'}
                    </div>
                    <span
                      className={`font-label-sm text-label-sm font-semibold ${
                        isSplitBalanced ? 'text-on-tertiary-container' : 'text-error'
                      }`}
                    >
                      {isSplitBalanced
                        ? `Summalar to'liq mos keldi (${formatCurrency(cashAmount)} + ${formatCurrency(cardAmount)} === ${formatCurrency(totalPayment)} UZS)`
                        : `Qismlar jami to'lovga teng emas!`}
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                    Farq: {formatCurrency(Math.abs(splitDifference))} UZS
                  </span>
                </div>

                {/* Resulting Debt Forecast */}
                <div className="pt-1 flex items-center justify-between text-xs font-label-md text-label-md">
                  <span className="text-on-surface-variant">To'lovdan keyingi qarz:</span>
                  <div className="flex items-center gap-2">
                    <span className="line-through text-outline">
                      {formatCurrency(currentCustomerOldDebt)} UZS
                    </span>
                    <span className="material-symbols-outlined text-[14px] text-on-surface-variant">
                      arrow_forward
                    </span>
                    <span className="font-bold text-on-surface text-sm">
                      {formatCurrency(resultingDebt)} UZS
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isFullySettled
                          ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                          : 'bg-surface-container-highest text-on-surface-variant'
                      }`}
                    >
                      {isFullySettled ? 'TO‘LIQ YOPILDI' : 'QISMAN'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Actions */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={sendSmsCheck}
                  onChange={(e) => setSendSmsCheck(e.target.checked)}
                  className="w-4 h-4 rounded text-secondary focus:ring-0"
                />
                <span className="font-label-md text-label-md text-on-surface font-medium">
                  Mijozga bepul SMS-chek yuborish
                </span>
              </label>
              <div className="flex items-center gap-1 text-on-surface-variant text-xs">
                <span className="material-symbols-outlined text-[16px]">info</span>
                <span>SMS hisobingizdan 1 ta chegiriladi</span>
              </div>
            </div>

            {receiptSuccess && (
              <div className="p-3 bg-tertiary-fixed/40 border border-on-tertiary-container/30 text-on-tertiary-container rounded-lg text-sm font-semibold flex items-center gap-2 animate-fadeIn">
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span>To'lov muvaffaqiyatli kiritildi va kassa hisoboti yangilandi!</span>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-space-sm pt-space-lg border-t border-outline-variant/20 mt-4">
            <button
              type="button"
              onClick={() => {
                setTotalPayment(0);
                setCashAmount(0);
                setCardAmount(0);
              }}
              className="h-10 px-space-md rounded-lg text-on-surface-variant hover:bg-surface-container font-label-lg text-label-lg transition-colors"
            >
              Bekor qilish
            </button>
            <button
              id="confirmPayBtn"
              type="button"
              onClick={handleConfirmPayment}
              className="h-10 px-space-lg rounded-lg bg-secondary text-on-secondary hover:bg-secondary-container font-label-lg text-label-lg font-bold flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>To'lovni tasdiqlash va Chek chiqarish</span>
            </button>
          </div>
        </div>

        {/* RIGHT: Electronic Receipt (Live Preview Thermal Ticket) */}
        <div className="lg:col-span-5 bg-surface-container-lowest p-space-lg rounded-xl shadow-md border border-outline-variant/20 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-space-md">
            <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">receipt_long</span>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                  Elektron Kassa Cheki
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed-dim/30 text-on-tertiary-fixed-variant font-label-sm text-[11px] font-bold">
                RASMIY HUJJAT
              </span>
            </div>

            {/* Thermal Paper Container */}
            <div className="bg-surface p-space-lg rounded-xl shadow-inner text-on-surface relative font-mono text-xs space-y-space-md border border-outline-variant/30">
              {/* Store Header */}
              <div className="text-center space-y-1">
                <div className="font-sans font-extrabold text-sm tracking-tight text-on-surface uppercase">
                  BUNYOD GROUP SAVDO MARKAZI
                </div>
                <p className="font-sans text-[11px] text-on-surface-variant">
                  Toshkent filiali, Chilonzor 9-kvartal, 12-uy
                </p>
                <p className="text-[10px] text-outline">STIR: 309 481 920 | Kassa apparati: #REG-901</p>
                <div className="pt-2 text-[11px] font-bold text-on-surface tracking-wider">
                  FISKAL CHEK № 10293
                </div>
                <div className="text-[10px] text-on-surface-variant">
                  Sana: 24.10.2024 • 14:32:10
                </div>
              </div>

              <div className="h-px bg-outline-variant/60 w-full" />

              {/* Customer info on check */}
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Mijoz:</span>
                  <span className="font-bold text-on-surface font-sans">{activeCustomer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Telefon:</span>
                  <span>{activeCustomer.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Kassir / Operator:</span>
                  <span className="font-sans">Nodir Bek (Kassa 1)</span>
                </div>
              </div>

              <div className="h-px bg-outline-variant/60 w-full" />

              {/* Settlement Breakdown */}
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Eski qarz balansi:</span>
                  <span>{formatCurrency(currentCustomerOldDebt)} UZS</span>
                </div>
                <div className="flex justify-between font-bold text-xs py-1 text-on-surface font-sans">
                  <span>QABUL QILINGAN TO'LOV:</span>
                  <span className="text-secondary text-sm">{formatCurrency(totalPayment)} UZS</span>
                </div>

                <div className="pl-3 space-y-1 text-[10px] text-on-surface-variant">
                  <div className="flex justify-between">
                    <span>↳ Naqd orqali:</span>
                    <span className="text-on-surface font-semibold">
                      {formatCurrency(paymentMethod === 'cash' ? totalPayment : paymentMethod === 'split' ? cashAmount : 0)} UZS
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>↳ Terminal (Humo/Uzcard):</span>
                    <span className="text-on-surface font-semibold">
                      {formatCurrency(paymentMethod === 'card' ? totalPayment : paymentMethod === 'split' ? cardAmount : 0)} UZS
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>↳ To'lov usuli turi:</span>
                    <span className="font-bold text-primary uppercase">{paymentMethod}</span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-outline-variant/60 w-full" />

              {/* Closing Balance & Status */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant text-[11px]">QOLGAN QARZ BALANSI:</span>
                  <span className="font-sans font-bold text-error text-sm">
                    {formatCurrency(resultingDebt)} UZS
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-on-surface-variant">To'lov holati:</span>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-bold uppercase font-sans">
                    {resultingDebt === 0 ? 'To‘liq To‘landi' : 'Qisman To‘landi'}
                  </span>
                </div>
              </div>

              {/* QR Code & Security Stamp */}
              <div className="pt-3 flex items-center justify-between border-t border-outline-variant/40">
                <div className="space-y-1 max-w-[170px]">
                  <p className="text-[9px] text-outline leading-tight">
                    QarzCRM tizimi orqali kassa tekshiruvi amalga oshirildi.
                  </p>
                  <span className="font-mono text-[9px] font-bold text-secondary">
                    QR-PAY-SECURE-8492
                  </span>
                </div>

                {/* Inline SVG QR Code from HTML mockup */}
                <div className="w-16 h-16 p-1 bg-surface-container-lowest rounded shadow-xs flex items-center justify-center border border-outline-variant/30">
                  <svg className="w-full h-full text-primary" fill="currentColor" viewBox="0 0 44 44">
                    <rect height="14" width="14" x="0" y="0" />
                    <rect fill="white" height="10" width="10" x="2" y="2" />
                    <rect height="6" width="6" x="4" y="4" />
                    <rect height="14" width="14" x="30" y="0" />
                    <rect fill="white" height="10" width="10" x="32" y="2" />
                    <rect height="6" width="6" x="34" y="4" />
                    <rect height="14" width="14" x="0" y="30" />
                    <rect fill="white" height="10" width="10" x="2" y="32" />
                    <rect height="6" width="6" x="4" y="34" />
                    <rect height="6" width="8" x="18" y="4" />
                    <rect height="8" width="8" x="18" y="14" />
                    <rect height="8" width="6" x="4" y="18" />
                    <rect height="6" width="8" x="32" y="18" />
                    <rect height="14" width="6" x="18" y="26" />
                    <rect height="6" width="12" x="28" y="30" />
                    <rect height="6" width="6" x="36" y="38" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Receipt Utility Operations */}
          <div className="pt-space-md grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                const dummyTx = transactions[0] || {
                  id: 'tx-preview',
                  receiptNumber: '#PAY-8492',
                  customerId: activeCustomer.id,
                  customerName: activeCustomer.name,
                  customerPhone: activeCustomer.phone,
                  date: '24.10.2024',
                  time: '14:32:10',
                  totalAmount: totalPayment,
                  cashAmount: cashAmount,
                  cardAmount: cardAmount,
                  method: paymentMethod,
                  cashierName: 'Nodir Bek (Kassa 1)',
                  branch: 'Toshkent markaziy filiali',
                  previousBalance: currentCustomerOldDebt,
                  remainingBalance: resultingDebt,
                  status: resultingDebt === 0 ? 'completed' : 'partial'
                };
                onOpenReceiptModal(dummyTx);
              }}
              className="py-2 px-2 rounded-lg bg-surface-container-low hover:bg-surface-container font-label-sm text-xs font-semibold text-on-surface flex items-center justify-center gap-1 transition-colors border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Chop etish</span>
            </button>
            <button
              type="button"
              onClick={() => alert(`SMS kvitansiya ${activeCustomer.phone} raqamiga yuborildi.`)}
              className="py-2 px-2 rounded-lg bg-surface-container-low hover:bg-surface-container font-label-sm text-xs font-semibold text-on-surface flex items-center justify-center gap-1 transition-colors border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[16px]">sms</span>
              <span>SMS yuborish</span>
            </button>
            <button
              type="button"
              onClick={() => alert("Fiskal chek PDF nusxasi yuklab olindi.")}
              className="py-2 px-2 rounded-lg bg-surface-container-low hover:bg-surface-container font-label-sm text-xs font-semibold text-on-surface flex items-center justify-center gap-1 transition-colors border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>PDF chek</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transactions History Ledger Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="p-space-md bg-surface-container-low flex items-center justify-between border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">receipt_long</span>
            <span className="font-headline-md text-headline-md text-on-surface">
              Barcha Kassa Tranzaksiyalari ({filteredTransactions.length})
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-container font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant h-10">
                <th className="py-2 px-space-md font-semibold">Kvitansiya #</th>
                <th className="py-2 px-space-md font-semibold">Mijoz</th>
                <th className="py-2 px-space-md font-semibold">Sana & Vaqt</th>
                <th className="py-2 px-space-md font-semibold">To'lov Usuli</th>
                <th className="py-2 px-space-md font-semibold text-right">Summa</th>
                <th className="py-2 px-space-md font-semibold text-right">Qoldiq Qarz</th>
                <th className="py-2 px-space-md font-semibold">Kassir</th>
                <th className="py-2 px-space-md font-semibold text-center">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/40">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-3 px-space-md font-mono font-bold text-primary">
                    {tx.receiptNumber}
                  </td>
                  <td className="py-3 px-space-md">
                    <div className="font-bold text-on-surface">{tx.customerName}</div>
                    <div className="text-[11px] text-on-surface-variant font-mono">{tx.customerPhone}</div>
                  </td>
                  <td className="py-3 px-space-md text-on-surface-variant">
                    {tx.date} <span className="font-mono text-[11px]">{tx.time}</span>
                  </td>
                  <td className="py-3 px-space-md">
                    <span className="px-2 py-0.5 rounded bg-surface-container font-mono uppercase font-bold text-[10px]">
                      {tx.method}
                    </span>
                  </td>
                  <td className="py-3 px-space-md text-right font-mono font-bold text-on-tertiary-container">
                    +{formatCurrency(tx.totalAmount)} UZS
                  </td>
                  <td className="py-3 px-space-md text-right font-mono font-bold text-on-surface">
                    {formatCurrency(tx.remainingBalance)} UZS
                  </td>
                  <td className="py-3 px-space-md text-on-surface-variant">
                    {tx.cashierName}
                  </td>
                  <td className="py-3 px-space-md text-center">
                    <button
                      onClick={() => onOpenReceiptModal(tx)}
                      className="p-1 rounded hover:bg-surface-container text-secondary"
                      title="Chekni ko'rish"
                    >
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
