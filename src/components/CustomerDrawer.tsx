import React from 'react';
import { Customer } from '../types';
import { formatCurrency } from '../data/mockData';

interface CustomerDrawerProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onPayForCustomer: (customer: Customer) => void;
  onSendSms: (customer: Customer) => void;
}

export const CustomerDrawer: React.FC<CustomerDrawerProps> = ({
  customer,
  isOpen,
  onClose,
  onPayForCustomer,
  onSendSms
}) => {
  if (!customer) return null;

  const usedPercent = Math.min(100, Math.round((customer.remainingDebt / customer.creditLimit) * 100));

  return (
    <div
      id="customer-drawer-container"
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div
        id="customer-drawer"
        className={`absolute right-0 top-0 h-full w-full max-w-xl bg-surface-container-lowest shadow-2xl flex flex-col justify-between border-l border-outline-variant/30 transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-space-lg border-b border-outline-variant/20 flex items-start justify-between bg-surface-container-low">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high shrink-0 border border-outline-variant/40 flex items-center justify-center font-bold text-lg text-on-surface">
              {customer.avatarUrl ? (
                <img
                  src={customer.avatarUrl}
                  alt={customer.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                customer.name.substring(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-md font-bold text-on-surface">{customer.name}</h3>
                <span className="px-1.5 py-0.5 rounded bg-surface-container font-mono text-[10px] text-on-surface-variant">
                  {customer.code}
                </span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant font-mono">{customer.phone}</p>
              <p className="font-body-sm text-xs text-on-surface-variant truncate">{customer.address}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Drawer Content Body */}
        <div className="flex-1 overflow-y-auto p-space-lg space-y-space-lg">
          {/* Financial Status Bento */}
          <div className="grid grid-cols-2 gap-space-md">
            <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/20">
              <span className="font-label-sm text-xs text-on-surface-variant uppercase font-semibold">
                Qolgan Qarzdorlik
              </span>
              <div className="font-headline-md font-bold text-secondary font-mono mt-1">
                {formatCurrency(customer.remainingDebt)} UZS
              </div>
              <div className="text-[11px] text-on-surface-variant mt-1">
                To'lov muddati: <strong className={customer.status === 'overdue' ? 'text-error' : 'text-on-surface'}>{customer.dueDate}</strong>
              </div>
            </div>

            <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/20">
              <span className="font-label-sm text-xs text-on-surface-variant uppercase font-semibold">
                Jami To'langan
              </span>
              <div className="font-headline-md font-bold text-on-tertiary-container font-mono mt-1">
                {formatCurrency(customer.paidAmount)} UZS
              </div>
              <div className="text-[11px] text-on-surface-variant mt-1">
                Umumiy olingan: {formatCurrency(customer.totalDebt)} UZS
              </div>
            </div>
          </div>

          {/* Credit Limit Progress */}
          <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-on-surface">Kredit Limiti ({customer.rating} Reyting)</span>
              <span className="font-mono font-bold text-on-surface">
                {formatCurrency(customer.creditLimit)} UZS
              </span>
            </div>
            <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  customer.status === 'overdue' ? 'bg-error' : 'bg-secondary'
                }`}
                style={{ width: `${usedPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-on-surface-variant">
              <span>Band qilingan: {usedPercent}%</span>
              <span>Erkin qoldiq: {formatCurrency(Math.max(0, customer.creditLimit - customer.remainingDebt))} UZS</span>
            </div>
          </div>

          {/* Customer Metadata / Passport / Branch */}
          <div className="space-y-2 text-xs">
            <h4 className="font-label-lg font-bold text-on-surface">Pasport va Shaxsiy ma'lumotlar</h4>
            <div className="grid grid-cols-2 gap-2 p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20">
              <div>
                <span className="text-on-surface-variant block">Pasport seriya:</span>
                <span className="font-mono font-bold text-on-surface">{customer.passport || 'AA 7182904'}</span>
              </div>
              <div>
                <span className="text-on-surface-variant block">Filial:</span>
                <span className="font-semibold text-on-surface">{customer.branch}</span>
              </div>
              <div className="col-span-2 pt-1 border-t border-outline-variant/20">
                <span className="text-on-surface-variant block">Mijoz haqida izoh:</span>
                <span className="text-on-surface italic">{customer.notes || "Doimiy ishonchli mijoz."}</span>
              </div>
            </div>
          </div>

          {/* Historical Ledger Timeline */}
          <div className="space-y-2 text-xs">
            <h4 className="font-label-lg font-bold text-on-surface">Oxirgi Tranzaksiyalar Tarixi</h4>
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 flex justify-between items-center">
                <div>
                  <span className="font-bold text-primary font-mono block">#PAY-8492 (Aralash kassa)</span>
                  <span className="text-[11px] text-on-surface-variant">24.10.2024 • 14:32</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-on-tertiary-container block">+50,000 UZS</span>
                  <span className="text-[10px] text-on-surface-variant">Chek chiqarilgan</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 flex justify-between items-center">
                <div>
                  <span className="font-bold text-secondary font-mono block">#DEBT-2024-8841 (Nasiya savdo)</span>
                  <span className="text-[11px] text-on-surface-variant">25.09.2024 • 11:15</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-on-surface block">4,160,000 UZS</span>
                  <span className="text-[10px] text-secondary font-semibold">Faol shartnoma</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Action Footer */}
        <div className="p-space-md border-t border-outline-variant/20 bg-surface-container-low flex items-center justify-between gap-space-sm">
          <button
            onClick={() => onSendSms(customer)}
            className="flex-1 h-10 rounded-lg bg-surface-container-lowest hover:bg-surface-container font-label-md font-semibold text-on-surface flex items-center justify-center gap-1.5 transition-colors border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">chat_bubble_outline</span>
            <span>SMS Eslatma</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onPayForCustomer(customer);
            }}
            className="flex-1 h-10 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md font-bold flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">payments</span>
            <span>To'lov Qabul Qilish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
