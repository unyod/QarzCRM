import React from 'react';
import { Customer, PaymentTransaction } from '../types';
import { formatCurrency } from '../data/mockData';

interface ReportsViewProps {
  customers: Customer[];
  transactions: PaymentTransaction[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  customers,
  transactions
}) => {
  const totalReceived = transactions.reduce((sum, t) => sum + t.totalAmount, 142800000);
  const totalDebt = customers.reduce((sum, c) => sum + c.remainingDebt, 482600000);
  const overdueDebt = customers.filter(c => c.status === 'overdue').reduce((sum, c) => sum + c.remainingDebt, 64100000);
  const recoveryRate = 91.4;

  return (
    <div className="flex flex-col w-full space-y-gutter-desktop">
      <div>
        <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-1">
          <span>Moliyaviy Audit & Tahlil</span>
          <span>•</span>
          <span className="text-secondary font-bold">Hisobotlar</span>
        </div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
          Moliyaviy Hisobotlar & Tahlillar
        </h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20">
          <span className="font-label-sm text-on-surface-variant uppercase font-semibold">Jami Tushum (Oy)</span>
          <div className="font-metric-display text-on-surface font-mono mt-1">
            {formatCurrency(totalReceived)} UZS
          </div>
          <span className="text-xs text-on-tertiary-container font-semibold">+18.4% o'tgan oyga nisbatan</span>
        </div>

        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20">
          <span className="font-label-sm text-on-surface-variant uppercase font-semibold">Qarz Qaytarish Koeffitsienti</span>
          <div className="font-metric-display text-on-tertiary-container font-mono mt-1">
            {recoveryRate}%
          </div>
          <span className="text-xs text-on-surface-variant">Maqsadli ko‘rsatkich: 90.0%</span>
        </div>

        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20">
          <span className="font-label-sm text-on-surface-variant uppercase font-semibold">Kutilayotgan Nasiya Qoldig'i</span>
          <div className="font-metric-display text-secondary font-mono mt-1">
            {formatCurrency(totalDebt)} UZS
          </div>
          <span className="text-xs text-on-surface-variant">Barcha filiallar bo‘yicha</span>
        </div>

        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-error/20">
          <span className="font-label-sm text-error uppercase font-semibold">Muddati O‘tgan Risk Balansi</span>
          <div className="font-metric-display text-error font-mono mt-1">
            {formatCurrency(overdueDebt)} UZS
          </div>
          <span className="text-xs text-error font-semibold">Zudlik bilan undirish talab qilinadi</span>
        </div>
      </div>

      {/* Detailed Analysis Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 space-y-3">
          <h3 className="font-headline-md font-bold text-on-surface">Filiallar Bo'yicha Tushum</h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-surface-container-low rounded-lg flex justify-between items-center">
              <div>
                <span className="font-bold text-on-surface block">Toshkent Markaziy Filiali</span>
                <span className="text-on-surface-variant">142 ta bitim • 94.2% qaytarilish</span>
              </div>
              <span className="font-mono font-bold text-sm text-on-surface">88,400,000 UZS</span>
            </div>
            <div className="p-3 bg-surface-container-low rounded-lg flex justify-between items-center">
              <div>
                <span className="font-bold text-on-surface block">Samarqand Shahar Filiali</span>
                <span className="text-on-surface-variant">78 ta bitim • 87.5% qaytarilish</span>
              </div>
              <span className="font-mono font-bold text-sm text-on-surface">36,200,000 UZS</span>
            </div>
            <div className="p-3 bg-surface-container-low rounded-lg flex justify-between items-center">
              <div>
                <span className="font-bold text-on-surface block">Andijon Filiali</span>
                <span className="text-on-surface-variant">44 ta bitim • 91.0% qaytarilish</span>
              </div>
              <span className="font-mono font-bold text-sm text-on-surface">18,200,000 UZS</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 space-y-3">
          <h3 className="font-headline-md font-bold text-on-surface">To'lov Usullari Salmog'i</h3>
          <div className="space-y-3 text-xs pt-2">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-on-surface">Naqd pul to'lovlari (53.6%)</span>
                <span className="font-mono font-bold">76,500,000 UZS</span>
              </div>
              <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '53.6%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-on-surface">Bank kartalari (Uzcard/Humo) (33.8%)</span>
                <span className="font-mono font-bold">48,300,000 UZS</span>
              </div>
              <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                <div className="bg-secondary h-full rounded-full" style={{ width: '33.8%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-on-surface">Aralash Split to'lovlar (12.6%)</span>
                <span className="font-mono font-bold">18,000,000 UZS</span>
              </div>
              <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                <div className="bg-tertiary-fixed-dim h-full rounded-full" style={{ width: '12.6%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
