import React, { useState } from 'react';
import { Customer } from '../types';
import { formatCurrency } from '../data/mockData';

interface CustomersViewProps {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
  onOpenNewCustomer: () => void;
  onPayForCustomer: (customer: Customer) => void;
  onSendSms: (customer: Customer) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  onSelectCustomer,
  onOpenNewCustomer,
  onPayForCustomer,
  onSendSms
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAmountRange, setSelectedAmountRange] = useState('all');
  const [selectedRowId, setSelectedRowId] = useState<string>('cust-1');

  // Filter logic
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBranch = selectedBranch === 'all' || 
      (selectedBranch === 'toshkent' && c.branch.includes('Toshkent')) ||
      (selectedBranch === 'samarqand' && c.branch.includes('Samarqand')) ||
      (selectedBranch === 'andijon' && c.branch.includes('Andijon'));

    const matchesStatus = selectedStatus === 'all' ||
      (selectedStatus === 'active' && (c.status === 'active' || c.status === 'partial')) ||
      (selectedStatus === 'overdue' && c.status === 'overdue') ||
      (selectedStatus === 'settled' && c.status === 'settled') ||
      (selectedStatus === 'due_today' && c.status === 'due_today');

    const matchesAmount = selectedAmountRange === 'all' ||
      (selectedAmountRange === 'under-5m' && c.remainingDebt < 5000000) ||
      (selectedAmountRange === '5m-15m' && c.remainingDebt >= 5000000 && c.remainingDebt <= 15000000) ||
      (selectedAmountRange === 'above-15m' && c.remainingDebt > 15000000);

    return matchesSearch && matchesBranch && matchesStatus && matchesAmount;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedBranch('all');
    setSelectedStatus('all');
    setSelectedAmountRange('all');
  };

  return (
    <div className="flex flex-col w-full space-y-gutter-desktop">
      {/* Metric Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Jami Mijozlar Boshqaruvi
            </span>
            <span className="p-1.5 rounded-lg bg-surface-container-low text-secondary material-symbols-outlined text-[20px]">
              groups
            </span>
          </div>
          <div className="my-space-sm">
            <span className="font-metric-display text-metric-display text-on-surface font-bold">
              1,842
            </span>
            <span className="font-label-md text-label-md text-on-surface-variant ml-1.5">nafar</span>
          </div>
          <div className="flex items-center gap-1 font-label-sm text-label-sm text-on-tertiary-container">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span className="font-semibold">+38 yangi</span>
            <span className="text-on-surface-variant">oxirgi 30 kunda</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Faol Nasiya Balansi
            </span>
            <span className="p-1.5 rounded-lg bg-surface-container-low text-secondary material-symbols-outlined text-[20px]">
              account_balance
            </span>
          </div>
          <div className="my-space-sm">
            <span className="font-metric-display text-metric-display text-on-surface font-bold">
              482.6M
            </span>
            <span className="font-label-md text-label-md text-on-surface-variant ml-1.5">UZS</span>
          </div>
          <div className="flex items-center gap-1 font-label-sm text-label-sm text-error">
            <span className="material-symbols-outlined text-[16px]">priority_high</span>
            <span className="font-semibold">68 ta mijoz</span>
            <span className="text-on-surface-variant">to‘lov kutmoqda</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Muddati O‘tgan Qarzdorlik
            </span>
            <span className="p-1.5 rounded-lg bg-error-container text-error material-symbols-outlined text-[20px]">
              alarm_off
            </span>
          </div>
          <div className="my-space-sm">
            <span className="font-metric-display text-metric-display text-error font-bold">
              64.1M
            </span>
            <span className="font-label-md text-label-md text-on-surface-variant ml-1.5">UZS</span>
          </div>
          <div className="flex items-center gap-1 font-label-sm text-label-sm text-error">
            <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
            <span className="font-semibold">14 ta mijoz</span>
            <span className="text-on-surface-variant">kechikish bosqichida</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Oylik Qaytarish Koeffitsienti
            </span>
            <span className="p-1.5 rounded-lg bg-surface-container-low text-on-tertiary-container material-symbols-outlined text-[20px]">
              verified
            </span>
          </div>
          <div className="my-space-sm">
            <span className="font-metric-display text-metric-display text-on-surface font-bold">
              91.4%
            </span>
            <span className="font-label-md text-label-md text-on-tertiary-container ml-1.5">+2.1%</span>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div className="bg-on-tertiary-container h-full rounded-full" style={{ width: '91.4%' }} />
          </div>
        </div>
      </div>

      {/* Main CRM Card: Filter Bar & Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col overflow-hidden">
        {/* Action Header & Filters */}
        <div className="p-space-lg flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest border-b border-outline-variant/20">
          <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-space-sm">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-12 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary border border-outline-variant/20 transition-all"
                placeholder="Ism, telefon raqami yoki pasport bo'yicha qidiring... (Ctrl+F)"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high px-1.5 py-0.5 rounded font-mono">
                ⌘F
              </span>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-space-xs flex-wrap">
              <div className="relative">
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="h-10 pl-3 pr-8 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface appearance-none focus:outline-none focus:ring-1 focus:ring-secondary cursor-pointer border border-outline-variant/20"
                >
                  <option value="all">Barcha filiallar</option>
                  <option value="toshkent">Toshkent markaziy filiali</option>
                  <option value="samarqand">Samarqand shahar filiali</option>
                  <option value="andijon">Andijon filiali</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
                  expand_more
                </span>
              </div>

              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="h-10 pl-3 pr-8 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface appearance-none focus:outline-none focus:ring-1 focus:ring-secondary cursor-pointer border border-outline-variant/20"
                >
                  <option value="all">Barcha statuslar</option>
                  <option value="active">Faol qarzdorlar</option>
                  <option value="overdue">Muddati o‘tganlar</option>
                  <option value="due_today">Bugun to'lanadigan</option>
                  <option value="settled">To‘liq to‘laganlar</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
                  filter_list
                </span>
              </div>

              <div className="relative">
                <select
                  value={selectedAmountRange}
                  onChange={(e) => setSelectedAmountRange(e.target.value)}
                  className="h-10 pl-3 pr-8 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface appearance-none focus:outline-none focus:ring-1 focus:ring-secondary cursor-pointer border border-outline-variant/20"
                >
                  <option value="all">Qarz miqdori: Barchasi</option>
                  <option value="under-5m">&lt; 5 mln UZS</option>
                  <option value="5m-15m">5 - 15 mln UZS</option>
                  <option value="above-15m">&gt; 15 mln UZS</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
                  payments
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-space-sm shrink-0">
            <button
              onClick={() => alert("Mijozlar bazasi Excel formatida muvaffaqiyatli eksport qilindi.")}
              className="h-10 px-space-md bg-surface-container-low hover:bg-surface-container text-on-surface font-label-lg text-label-lg rounded-lg flex items-center gap-1.5 transition-colors border border-outline-variant/20"
            >
              <span className="material-symbols-outlined text-[18px]">file_download</span>
              <span>Eksport (Excel/CSV)</span>
            </button>
            <button
              onClick={onOpenNewCustomer}
              className="h-10 px-space-md bg-primary hover:bg-surface-container-highest text-on-primary hover:text-on-surface font-label-lg text-label-lg rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>+ Yangi Mijoz Qo‘shish</span>
            </button>
          </div>
        </div>

        {/* Active Filters Tags */}
        <div className="px-space-lg py-2 flex items-center gap-space-xs flex-wrap bg-surface-container-lowest border-b border-outline-variant/10">
          <span className="font-label-sm text-label-sm text-on-surface-variant mr-1">Filtrlar:</span>
          {selectedBranch !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface-container-low text-on-surface font-label-sm text-label-sm rounded-lg border border-outline-variant/20">
              Filial: {selectedBranch}
              <button
                onClick={() => setSelectedBranch('all')}
                className="material-symbols-outlined text-[14px] hover:text-error"
              >
                close
              </button>
            </span>
          )}
          {selectedStatus !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface-container-low text-on-surface font-label-sm text-label-sm rounded-lg border border-outline-variant/20">
              Holati: {selectedStatus}
              <button
                onClick={() => setSelectedStatus('all')}
                className="material-symbols-outlined text-[14px] hover:text-error"
              >
                close
              </button>
            </span>
          )}
          {(selectedBranch !== 'all' || selectedStatus !== 'all' || searchQuery !== '' || selectedAmountRange !== 'all') && (
            <button
              onClick={clearFilters}
              className="font-label-sm text-label-sm text-secondary hover:underline ml-2 font-semibold"
            >
              Barchasini tozalash
            </button>
          )}
        </div>

        {/* Ledger Directory Data Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left font-body-sm text-body-sm border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider h-10 border-b border-outline-variant/20">
                <th className="pl-space-lg pr-space-md font-semibold">Mijoz / ID</th>
                <th className="px-space-md font-semibold">Telefon Raqami</th>
                <th className="px-space-md font-semibold text-right">Jami Olingan Qarz</th>
                <th className="px-space-md font-semibold text-right">To‘langan Summa</th>
                <th className="px-space-md font-semibold text-right">Qolgan Qarz</th>
                <th className="px-space-md font-semibold">To‘lov Muddati</th>
                <th className="px-space-md font-semibold">Holati</th>
                <th className="pr-space-lg pl-space-md font-semibold text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/40 bg-surface-container-lowest">
              {filteredCustomers.map((cust) => {
                const isSelected = selectedRowId === cust.id;
                return (
                  <tr
                    key={cust.id}
                    onClick={() => {
                      setSelectedRowId(cust.id);
                      onSelectCustomer(cust);
                    }}
                    className={`hover:bg-surface-container-low/60 transition-colors cursor-pointer ${
                      isSelected ? 'bg-secondary/5' : ''
                    }`}
                  >
                    {/* Customer Info */}
                    <td className="pl-space-lg pr-space-md py-3.5">
                      <div className="flex items-center gap-space-sm">
                        <div className="relative w-9 h-9 rounded-full overflow-hidden bg-surface-container-high shrink-0 border border-outline-variant/30 flex items-center justify-center font-bold text-xs">
                          {cust.avatarUrl ? (
                            <img
                              src={cust.avatarUrl}
                              alt={cust.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            cust.name.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-label-lg text-label-lg font-bold text-on-surface truncate">
                              {cust.name}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-surface-container font-label-sm text-[10px] text-on-surface-variant font-mono">
                              {cust.code}
                            </span>
                          </div>
                          <span className="font-body-sm text-xs text-on-surface-variant truncate">
                            {cust.address}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-space-md py-3.5 font-mono text-on-surface whitespace-nowrap">
                      {cust.phone}
                    </td>

                    {/* Total debt */}
                    <td className="px-space-md py-3.5 text-right font-mono font-medium text-on-surface whitespace-nowrap">
                      {formatCurrency(cust.totalDebt)} UZS
                    </td>

                    {/* Paid */}
                    <td className="px-space-md py-3.5 text-right font-mono font-medium text-on-tertiary-container whitespace-nowrap">
                      {formatCurrency(cust.paidAmount)} UZS
                    </td>

                    {/* Remaining */}
                    <td className="px-space-md py-3.5 text-right font-mono font-bold whitespace-nowrap">
                      <span
                        className={
                          cust.status === 'overdue'
                            ? 'text-error'
                            : cust.remainingDebt > 0
                            ? 'text-secondary'
                            : 'text-on-surface-variant'
                        }
                      >
                        {formatCurrency(cust.remainingDebt)} UZS
                      </span>
                    </td>

                    {/* Due Date */}
                    <td className="px-space-md py-3.5 whitespace-nowrap">
                      <span
                        className={`font-medium ${
                          cust.status === 'overdue'
                            ? 'text-error'
                            : cust.status === 'due_today'
                            ? 'text-error font-bold'
                            : 'text-on-surface'
                        }`}
                      >
                        {cust.dueDate}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-space-md py-3.5 whitespace-nowrap">
                      {cust.status === 'overdue' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-error-container text-error font-label-sm text-label-sm font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
                          Muddati o‘tgan (-9 kun)
                        </span>
                      )}
                      {cust.status === 'due_today' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          Bugun to‘lash kerak
                        </span>
                      )}
                      {cust.status === 'partial' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface-container-high text-secondary font-label-sm text-label-sm font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          Faol / Qisman
                        </span>
                      )}
                      {cust.status === 'active' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface-container-high text-secondary font-label-sm text-label-sm font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          Faol
                        </span>
                      )}
                      {cust.status === 'settled' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-fixed-variant" />
                          To‘liq to‘langan
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td
                      className="pr-space-lg pl-space-md py-3.5 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onPayForCustomer(cust)}
                          className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-secondary transition-colors"
                          title="To‘lov kiritish"
                        >
                          <span className="material-symbols-outlined text-[18px]">payments</span>
                        </button>
                        <button
                          onClick={() => onSendSms(cust)}
                          className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-secondary transition-colors"
                          title="SMS yuborish"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            chat_bubble_outline
                          </span>
                        </button>
                        <button
                          onClick={() => onSelectCustomer(cust)}
                          className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
                          title="Batafsil ko‘rish"
                        >
                          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-on-surface-variant">
                    Mos keluvchi mijozlar topilmadi. Filtr parametrlarini o'zgartirib ko'ring.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
