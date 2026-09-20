import React, { useState } from 'react';
import { DebtContract, Customer } from '../types';
import { formatCurrency } from '../data/mockData';

interface DebtsViewProps {
  debts: DebtContract[];
  customers: Customer[];
  onOpenCreateDebt: () => void;
  onPayForCustomer: (customer: Customer) => void;
}

export const DebtsView: React.FC<DebtsViewProps> = ({
  debts,
  customers,
  onOpenCreateDebt,
  onPayForCustomer
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'overdue' | 'due_today'>('all');
  const [search, setSearch] = useState('');

  const filteredDebts = debts.filter(d => {
    const matchesFilter = filter === 'all' || d.status === filter;
    const matchesSearch = 
      d.customerName.toLowerCase().includes(search.toLowerCase()) ||
      d.contractNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.customerPhone.includes(search);
    return matchesFilter && matchesSearch;
  });

  const totalRemaining = debts.reduce((sum, d) => sum + d.remainingAmount, 0);

  return (
    <div className="flex flex-col w-full space-y-gutter-desktop">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-1">
            <span>Nasiya shartnomalari</span>
            <span>•</span>
            <span className="text-secondary font-bold">Faol portfel</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            Qarzlar & Nasiya Jurnali
          </h1>
        </div>

        <button
          onClick={onOpenCreateDebt}
          className="h-10 px-space-lg bg-primary text-on-primary hover:bg-primary-container font-label-lg text-label-lg rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">post_add</span>
          <span>+ Yangi Qarz Rasmiylashtirish</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20">
          <span className="font-label-sm text-on-surface-variant uppercase font-semibold">Jami Faol Nasiya</span>
          <div className="font-metric-display text-on-surface mt-1 font-mono">
            {formatCurrency(totalRemaining)} UZS
          </div>
          <span className="text-xs text-on-surface-variant">{debts.length} ta faol shartnoma</span>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-error/20">
          <span className="font-label-sm text-error uppercase font-semibold">Muddati O‘tgan Shartnomalar</span>
          <div className="font-metric-display text-error mt-1 font-mono">
            {formatCurrency(debts.filter(d => d.status === 'overdue').reduce((sum, d) => sum + d.remainingAmount, 0))} UZS
          </div>
          <span className="text-xs text-error font-semibold">
            {debts.filter(d => d.status === 'overdue').length} ta mijoz kechikmoqda
          </span>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20">
          <span className="font-label-sm text-on-surface-variant uppercase font-semibold">O‘rtacha Nasiya Miqdori</span>
          <div className="font-metric-display text-secondary mt-1 font-mono">
            {formatCurrency(Math.round(totalRemaining / (debts.length || 1)))} UZS
          </div>
          <span className="text-xs text-on-tertiary-container font-semibold">Standart 30 kunlik muddat</span>
        </div>
      </div>

      {/* Filter and search */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filter === 'all' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            Barchasi ({debts.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filter === 'active' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            Faol
          </button>
          <button
            onClick={() => setFilter('overdue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filter === 'overdue' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            Muddati o'tgan
          </button>
          <button
            onClick={() => setFilter('due_today')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filter === 'due_today' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            Bugun to'lanadigan
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Shartnoma # yoki mijoz..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-surface-container-low text-xs border border-outline-variant/30 focus:outline-none focus:bg-surface-container-lowest"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant uppercase font-semibold h-10 border-b border-outline-variant/20">
                <th className="py-2 px-space-md">Shartnoma №</th>
                <th className="py-2 px-space-md">Mijoz F.I.SH</th>
                <th className="py-2 px-space-md">Berilgan sana</th>
                <th className="py-2 px-space-md">Oxirgi muddat</th>
                <th className="py-2 px-space-md text-right">Jami summa</th>
                <th className="py-2 px-space-md text-right">To'langan</th>
                <th className="py-2 px-space-md text-right">Qoldiq Qarz</th>
                <th className="py-2 px-space-md">Holat</th>
                <th className="py-2 px-space-md text-center">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/40">
              {filteredDebts.map((d) => {
                const matchedCust = customers.find(c => c.id === d.customerId);
                return (
                  <tr key={d.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3 px-space-md font-mono font-bold text-primary">
                      {d.contractNumber}
                    </td>
                    <td className="py-3 px-space-md">
                      <div className="font-bold text-on-surface">{d.customerName}</div>
                      <div className="text-[11px] text-on-surface-variant font-mono">{d.customerPhone}</div>
                    </td>
                    <td className="py-3 px-space-md text-on-surface-variant font-mono">
                      {d.startDate}
                    </td>
                    <td className="py-3 px-space-md font-mono font-semibold">
                      <span className={d.status === 'overdue' ? 'text-error' : d.status === 'due_today' ? 'text-error font-bold' : 'text-on-surface'}>
                        {d.dueDate}
                      </span>
                    </td>
                    <td className="py-3 px-space-md text-right font-mono font-medium text-on-surface">
                      {formatCurrency(d.totalAmount)} UZS
                    </td>
                    <td className="py-3 px-space-md text-right font-mono text-on-tertiary-container font-semibold">
                      {formatCurrency(d.paidAmount)} UZS
                    </td>
                    <td className="py-3 px-space-md text-right font-mono font-bold text-secondary">
                      {formatCurrency(d.remainingAmount)} UZS
                    </td>
                    <td className="py-3 px-space-md">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        d.status === 'overdue'
                          ? 'bg-error-container text-error'
                          : d.status === 'due_today'
                          ? 'bg-surface-container text-on-surface'
                          : 'bg-surface-container-high text-secondary'
                      }`}>
                        {d.status === 'overdue' ? 'Muddati o‘tgan' : d.status === 'due_today' ? 'Bugun to‘lash' : 'Faol'}
                      </span>
                    </td>
                    <td className="py-3 px-space-md text-center">
                      <button
                        onClick={() => {
                          if (matchedCust) onPayForCustomer(matchedCust);
                        }}
                        className="px-2 py-1 rounded bg-secondary text-on-secondary font-semibold hover:bg-secondary-container transition-all"
                      >
                        To'lov
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
