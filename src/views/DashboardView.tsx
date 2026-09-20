import React, { useState } from 'react';
import { Customer, PaymentTransaction, NavigationPath } from '../types';
import { formatCurrency } from '../data/mockData';

interface DashboardViewProps {
  customers: Customer[];
  transactions: PaymentTransaction[];
  onNavigate: (path: NavigationPath) => void;
  onOpenQuickDebt: () => void;
  onOpenQuickPay: () => void;
  onOpenBulkSms: () => void;
  onSelectCustomer: (customer: Customer) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  customers,
  transactions,
  onNavigate,
  onOpenQuickDebt,
  onOpenQuickPay,
  onOpenBulkSms,
  onSelectCustomer
}) => {
  const [exportOpen, setExportOpen] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  // Dynamic calculations from live data
  const totalDebtPortfolio = customers.reduce((sum, c) => sum + c.remainingDebt, 248650000);
  const totalCustomersCount = 1284 + (customers.length - 6);
  const todayPaymentsSum = transactions.slice(0, 3).reduce((sum, t) => sum + t.totalAmount, 18420000);
  const overdueDebtSum = customers.filter(c => c.status === 'overdue').reduce((sum, c) => sum + c.remainingDebt, 34200000);

  const handleExport = (format: 'xlsx' | 'pdf') => {
    setExportOpen(false);
    alert(`${format.toUpperCase()} shaklidagi moliyaviy audit hisoboti tayyorlandi va yuklab olindi.`);
  };

  const chartData = [
    { date: '01/10', debt: 8400000, pay: 12100000, debtH: '40%', payH: '55%' },
    { date: '03/10', debt: 6200000, pay: 14500000, debtH: '30%', payH: '65%' },
    { date: '05/10', debt: 10500000, pay: 9800000, debtH: '50%', payH: '45%' },
    { date: '07/10', debt: 12800000, pay: 16200000, debtH: '60%', payH: '75%' },
    { date: '09/10', debt: 5100000, pay: 11000000, debtH: '25%', payH: '50%' },
    { date: '11/10', debt: 14900000, pay: 18500000, debtH: '70%', payH: '85%' },
    { date: 'Bugun', debt: 9500000, pay: 21200000, debtH: '45%', payH: '95%' }
  ];

  return (
    <div className="flex flex-col w-full space-y-gutter-desktop">
      {/* Top Title & Quick Actions Row */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wider px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-semibold">
              Toshkent Markaziy Filiali
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container animate-pulse" />
            <span className="font-label-sm text-label-sm text-on-surface-variant">Sinxronizatsiya faol</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
            Kassa & Moliyaviy Nazorat Markazi
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          <button
            id="dash-quick-debt-btn"
            onClick={onOpenQuickDebt}
            className="h-9 px-space-md bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg rounded-lg shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">add_task</span>
            <span>Yangi qarz</span>
            <span className="text-[10px] font-mono bg-white/20 px-1 rounded ml-1">Ctrl+N</span>
          </button>

          <button
            id="dash-quick-pay-btn"
            onClick={onOpenQuickPay}
            className="h-9 px-space-md bg-secondary hover:bg-secondary-container text-on-secondary font-label-lg text-label-lg rounded-lg shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">payments</span>
            <span>To‘lov qabul qilish</span>
          </button>

          <button
            id="dash-bulk-sms-btn"
            onClick={onOpenBulkSms}
            className="h-9 px-space-md bg-surface-container-lowest text-on-surface hover:bg-surface-container font-label-lg text-label-lg rounded-lg shadow-sm flex items-center gap-1.5 transition-all border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">mark_chat_unread</span>
            <span>Ommaviy SMS</span>
          </button>

          <div className="relative inline-block text-left">
            <button
              id="export-dropdown-btn"
              onClick={() => setExportOpen(!exportOpen)}
              className="h-9 px-space-sm bg-surface-container-lowest text-on-surface hover:bg-surface-container font-label-lg text-label-lg rounded-lg shadow-sm flex items-center gap-1 transition-all border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Eksport</span>
              <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </button>

            {exportOpen && (
              <div
                id="export-dropdown-menu"
                className="absolute right-0 mt-1 w-48 bg-surface-container-lowest rounded-lg shadow-xl border border-outline-variant/30 z-30 py-1"
              >
                <button
                  onClick={() => handleExport('xlsx')}
                  className="w-full flex items-center gap-2 px-space-sm py-2 font-label-md text-label-md text-on-surface hover:bg-surface-container-low text-left"
                >
                  <span className="material-symbols-outlined text-[16px] text-on-tertiary-container">table_chart</span>
                  <span>Excel (.xlsx) hisobot</span>
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full flex items-center gap-2 px-space-sm py-2 font-label-md text-label-md text-on-surface hover:bg-surface-container-low text-left"
                >
                  <span className="material-symbols-outlined text-[16px] text-error">picture_as_pdf</span>
                  <span>PDF audit vedomost</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5 Top Bento KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-space-md">
        {/* Card 1: Jami Mijozlar */}
        <div 
          onClick={() => onNavigate('customers')}
          className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-surface-container-low rounded-full opacity-60 pointer-events-none" />
          <div className="flex items-start justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold tracking-wide uppercase">
              Jami Mijozlar
            </span>
            <span className="w-8 h-8 rounded-lg bg-surface-container-low text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">groups</span>
            </span>
          </div>
          <div className="my-space-xs">
            <span className="font-metric-display text-metric-display text-on-surface tabular-nums">
              {totalCustomersCount.toLocaleString()}
            </span>
            <span className="font-label-md text-label-md text-on-surface-variant ml-0.5">nafar</span>
          </div>
          <div className="flex items-center gap-1 font-label-sm text-label-sm text-on-tertiary-container font-semibold">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            <span>+12.4%</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">o‘tgan oydan</span>
          </div>
        </div>

        {/* Card 2: Jami Qarz Portfeli */}
        <div 
          onClick={() => onNavigate('debts')}
          className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold tracking-wide uppercase">
              Jami Qarz Portfeli
            </span>
            <span className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            </span>
          </div>
          <div className="my-space-xs">
            <span className="font-metric-display text-metric-display text-on-surface tabular-nums">
              {formatCurrency(totalDebtPortfolio)}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant ml-0.5 font-bold">UZS</span>
          </div>
          <div className="flex items-center justify-between font-label-sm text-label-sm">
            <span className="text-on-surface-variant">218 faol kelishuv</span>
            <span className="text-secondary font-semibold">O‘rtacha 1.14M</span>
          </div>
        </div>

        {/* Card 3: Bugungi To‘lovlar */}
        <div 
          onClick={() => onNavigate('payments')}
          className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold tracking-wide uppercase">
              Bugungi To‘lovlar
            </span>
            <span className="w-8 h-8 rounded-lg bg-surface-container-low text-on-tertiary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">price_check</span>
            </span>
          </div>
          <div className="my-space-xs">
            <span className="font-metric-display text-metric-display text-on-surface tabular-nums">
              {formatCurrency(todayPaymentsSum)}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant ml-0.5 font-bold">UZS</span>
          </div>
          <div className="flex items-center gap-1 font-label-sm text-label-sm text-on-tertiary-container font-semibold">
            <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
            <span>+8.4%</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">24 ta tranzaksiya</span>
          </div>
        </div>

        {/* Card 4: Muddati O‘tgan */}
        <div 
          onClick={() => onNavigate('customers')}
          className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-error/20 flex flex-col justify-between hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <span className="font-label-sm text-label-sm text-error font-semibold tracking-wide uppercase">
              Muddati O‘tgan
            </span>
            <span className="w-8 h-8 rounded-lg bg-error-container text-on-error-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">warning</span>
            </span>
          </div>
          <div className="my-space-xs">
            <span className="font-metric-display text-metric-display text-error tabular-nums">
              {formatCurrency(overdueDebtSum)}
            </span>
            <span className="font-label-sm text-label-sm text-error ml-0.5 font-bold">UZS</span>
          </div>
          <div className="flex items-center justify-between font-label-sm text-label-sm">
            <span className="text-error font-semibold">31 nafar mijoz</span>
            <span className="px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-semibold text-[10px]">
              Yuqori xavf
            </span>
          </div>
        </div>

        {/* Card 5: Bugungi SMS Eslatma */}
        <div 
          onClick={() => onNavigate('sms-marketing')}
          className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold tracking-wide uppercase">
              Bugungi SMS Eslatma
            </span>
            <span className="w-8 h-8 rounded-lg bg-surface-container-low text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">sms</span>
            </span>
          </div>
          <div className="my-space-xs">
            <span className="font-metric-display text-metric-display text-on-surface tabular-nums">
              142
            </span>
            <span className="font-label-md text-label-md text-on-surface-variant ml-0.5">ta yuborildi</span>
          </div>
          <div className="flex items-center justify-between font-label-sm text-label-sm">
            <span className="text-on-tertiary-container font-semibold">98.6% yetkazildi</span>
            <span className="text-on-surface-variant font-mono text-[11px]">Qoldiq: 4,858</span>
          </div>
        </div>
      </section>

      {/* Charts Section: Dynamic Bars & Donut */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
        {/* Left 8 Cols: Payments vs Debts Bar Dynamic Chart */}
        <div className="lg:col-span-8 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                To‘lovlar va Qarzlar Dinamikasi
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                So‘nggi 14 kunlik kassa kirimi va berilgan qarz miqdori
              </p>
            </div>
            <div className="flex items-center gap-space-sm">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-secondary" />
                <span className="font-label-sm text-label-sm text-on-surface font-medium">
                  To‘lov (Kirim)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-surface-dim" />
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                  Yangi qarz
                </span>
              </div>
            </div>
          </div>

          <div className="relative w-full h-72 flex flex-col justify-end pt-4">
            {/* Grid level lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
              <div className="w-full flex items-center">
                <span className="font-label-sm text-[10px] text-on-surface-variant w-12 text-right pr-2 font-mono">
                  30M
                </span>
                <div className="flex-1 h-px bg-surface-container-highest" />
              </div>
              <div className="w-full flex items-center">
                <span className="font-label-sm text-[10px] text-on-surface-variant w-12 text-right pr-2 font-mono">
                  20M
                </span>
                <div className="flex-1 h-px bg-surface-container-highest" />
              </div>
              <div className="w-full flex items-center">
                <span className="font-label-sm text-[10px] text-on-surface-variant w-12 text-right pr-2 font-mono">
                  10M
                </span>
                <div className="flex-1 h-px bg-surface-container-highest" />
              </div>
              <div className="w-full flex items-center">
                <span className="font-label-sm text-[10px] text-on-surface-variant w-12 text-right pr-2 font-mono">
                  0 UZS
                </span>
                <div className="flex-1 h-px bg-surface-container-highest" />
              </div>
            </div>

            {/* Bars */}
            <div className="relative z-10 w-full pl-12 h-56 flex items-end justify-between gap-1 sm:gap-2">
              {chartData.map((item, idx) => (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-1 group relative cursor-pointer"
                  onMouseEnter={() => setHoveredBar(item.date)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {/* Tooltip on hover */}
                  {hoveredBar === item.date && (
                    <div className="absolute -top-12 bg-primary text-on-primary text-[11px] font-mono py-1 px-2 rounded shadow-lg z-20 whitespace-nowrap pointer-events-none">
                      <div>Kirim: {(item.pay / 1000000).toFixed(1)}M UZS</div>
                      <div>Qarz: {(item.debt / 1000000).toFixed(1)}M UZS</div>
                    </div>
                  )}

                  <div className="w-full flex items-end justify-center gap-1 h-44">
                    <div
                      style={{ height: item.debtH }}
                      className="w-2.5 sm:w-3.5 bg-surface-dim rounded-t hover:bg-surface-variant transition-all"
                      title={`Yangi Qarz: ${formatCurrency(item.debt)} UZS`}
                    />
                    <div
                      style={{ height: item.payH }}
                      className="w-2.5 sm:w-3.5 bg-secondary rounded-t hover:bg-secondary-container transition-all"
                      title={`To'langan: ${formatCurrency(item.pay)} UZS`}
                    />
                  </div>
                  <span className="font-label-sm text-[10px] text-on-surface-variant font-mono">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-space-xs mt-space-xs bg-surface-container-low px-space-md py-2 rounded-lg border border-outline-variant/10">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Oy boshidan umumiy kirim:{' '}
              <strong className="text-on-surface font-semibold font-mono">126,500,000 UZS</strong>
            </span>
            <span className="font-label-sm text-label-sm text-on-tertiary-container font-semibold">
              Qaytarilish koeffitsiyenti: 89.2%
            </span>
          </div>
        </div>

        {/* Right 4 Cols: Payment Methods Donut Chart */}
        <div className="lg:col-span-4 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-space-sm">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                To‘lov Usullari
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Oylik tushumning kanal taqsimoti
              </p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
              donut_large
            </span>
          </div>

          <div className="flex items-center justify-center my-space-sm relative">
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-surface-container-high"
                cx="50"
                cy="50"
                fill="transparent"
                r="38"
                stroke="currentColor"
                strokeWidth="12"
              />
              <circle
                className="text-primary"
                cx="50"
                cy="50"
                fill="transparent"
                r="38"
                stroke="currentColor"
                strokeDasharray="238.76"
                strokeDashoffset="109.8"
                strokeWidth="12"
              />
              <circle
                className="text-secondary"
                cx="50"
                cy="50"
                fill="transparent"
                r="38"
                stroke="currentColor"
                strokeDasharray="238.76"
                strokeDashoffset="162.3"
                strokeWidth="12"
              />
              <circle
                className="text-on-tertiary-container"
                cx="50"
                cy="50"
                fill="transparent"
                r="38"
                stroke="currentColor"
                strokeDasharray="238.76"
                strokeDashoffset="205.3"
                strokeWidth="12"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                Jami To‘lov
              </span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold font-mono">
                126.5M
              </span>
              <span className="font-label-sm text-[10px] text-on-surface-variant">UZS</span>
            </div>
          </div>

          <div className="space-y-space-xs font-label-md text-label-md">
            <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low border border-outline-variant/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-on-surface font-medium">Naqd Pul</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-semibold text-on-surface">68,200,000 UZS</span>
                <span className="text-on-surface-variant font-mono ml-1 text-[11px]">(54%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low border border-outline-variant/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary" />
                <span className="text-on-surface font-medium">Uzcard / Humo</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-semibold text-on-surface">40,500,000 UZS</span>
                <span className="text-on-surface-variant font-mono ml-1 text-[11px]">(32%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low border border-outline-variant/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-on-tertiary-container" />
                <span className="text-on-surface font-medium">Bank & Ilova</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-semibold text-on-surface">17,800,000 UZS</span>
                <span className="text-on-surface-variant font-mono ml-1 text-[11px]">(14%)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Overview: Recent Transactions & Priority Debtors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
        {/* Recent Transactions Box */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">history</span>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                Oxirgi To'lovlar Kvitansiyalari
              </h3>
            </div>
            <button
              onClick={() => onNavigate('payments')}
              className="font-label-sm text-secondary hover:underline font-semibold"
            >
              Barchasini ko'rish →
            </button>
          </div>
          <div className="divide-y divide-surface-container-high/40">
            {transactions.slice(0, 4).map((t) => (
              <div key={t.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-primary">{t.receiptNumber}</span>
                    <span className="font-semibold text-on-surface">{t.customerName}</span>
                    <span className="px-1.5 py-0.5 rounded bg-surface-container text-[10px] font-mono text-on-surface-variant">
                      {t.method.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-on-surface-variant text-[11px]">
                    {t.date} • {t.time} • Kassir: {t.cashierName}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-on-tertiary-container block text-sm">
                    +{formatCurrency(t.totalAmount)} UZS
                  </span>
                  <span className="text-on-surface-variant text-[10px]">
                    Qoldiq: {formatCurrency(t.remainingBalance)} UZS
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Debtors Attention Box */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-[20px]">notification_important</span>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                Tezkor Nazoratdagi Qarzdorlar
              </h3>
            </div>
            <button
              onClick={() => onNavigate('customers')}
              className="font-label-sm text-secondary hover:underline font-semibold"
            >
              Mijozlar bazasi →
            </button>
          </div>
          <div className="divide-y divide-surface-container-high/40">
            {customers.filter(c => c.remainingDebt > 0).slice(0, 4).map((c) => (
              <div
                key={c.id}
                onClick={() => onSelectCustomer(c)}
                className="py-2.5 flex items-center justify-between text-xs hover:bg-surface-container-low/60 rounded px-1 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-bold text-xs">
                    {c.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-on-surface">{c.name}</span>
                      <span className="text-[10px] text-on-surface-variant font-mono">{c.code}</span>
                    </div>
                    <span className="text-on-surface-variant text-[11px]">
                      Muddat: <strong className={c.status === 'overdue' ? 'text-error' : 'text-on-surface'}>{c.dueDate}</strong>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-mono font-bold block text-sm ${c.status === 'overdue' ? 'text-error' : 'text-secondary'}`}>
                    {formatCurrency(c.remainingDebt)} UZS
                  </span>
                  <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                    c.status === 'overdue' ? 'bg-error-container text-error' : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    {c.status === 'overdue' ? 'Muddati o‘tgan' : c.status === 'due_today' ? 'Bugun to‘lash' : 'Faol'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
