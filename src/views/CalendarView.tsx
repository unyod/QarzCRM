import React, { useState } from 'react';
import { Customer } from '../types';
import { formatCurrency } from '../data/mockData';

interface CalendarViewProps {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  customers,
  onSelectCustomer
}) => {
  const [currentMonth] = useState('Oktyabr 2024');

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // Group customers by day
  const getCustomersForDay = (day: number) => {
    if (day === 24) return customers.filter(c => c.status === 'due_today');
    if (day === 15) return customers.filter(c => c.status === 'overdue');
    if (day === 28) return customers.filter(c => c.name.includes('Azizbek'));
    if (day === 20) return customers.filter(c => c.status === 'settled');
    if (day === 30) return customers.filter(c => c.name.includes('Dilshod'));
    return [];
  };

  return (
    <div className="flex flex-col w-full space-y-gutter-desktop">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-1">
            <span>To‘lov Muddatlari Taqvimi</span>
            <span>•</span>
            <span className="text-secondary font-bold">{currentMonth}</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            Qarz & Nasiya Taqvimi
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs text-on-surface">
            <span className="w-2.5 h-2.5 rounded-full bg-error" /> Muddati o'tgan
          </span>
          <span className="flex items-center gap-1 text-xs text-on-surface ml-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary" /> Bugungi to'lov
          </span>
          <span className="flex items-center gap-1 text-xs text-on-surface ml-2">
            <span className="w-2.5 h-2.5 rounded-full bg-on-tertiary-container" /> Rejalashtirilgan
          </span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 p-space-md overflow-hidden">
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs py-2 bg-surface-container-low rounded-lg mb-2 text-on-surface-variant">
          <div>Dush</div>
          <div>Sesh</div>
          <div>Chor</div>
          <div>Pay</div>
          <div>Juma</div>
          <div>Shan</div>
          <div>Yak</div>
        </div>

        <div className="grid grid-cols-7 gap-1.5 min-h-[480px]">
          {daysInMonth.map((day) => {
            const dayCustomers = getCustomersForDay(day);
            const isToday = day === 24;

            return (
              <div
                key={day}
                className={`p-1.5 rounded-lg min-h-[90px] flex flex-col justify-between border transition-all ${
                  isToday
                    ? 'bg-secondary/10 border-secondary ring-1 ring-secondary'
                    : 'bg-surface-container-lowest hover:bg-surface-container-low border-outline-variant/30'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-bold font-mono ${isToday ? 'text-secondary' : 'text-on-surface'}`}>
                    {day}
                  </span>
                  {isToday && (
                    <span className="px-1 rounded bg-secondary text-on-secondary text-[9px] font-bold">
                      Bugun
                    </span>
                  )}
                </div>

                <div className="space-y-1 mt-1">
                  {dayCustomers.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => onSelectCustomer(c)}
                      className={`p-1 rounded text-[10px] truncate cursor-pointer transition-colors ${
                        c.status === 'overdue'
                          ? 'bg-error-container text-error font-bold'
                          : c.status === 'due_today'
                          ? 'bg-secondary text-on-secondary font-bold'
                          : 'bg-surface-container-high text-on-surface'
                      }`}
                      title={`${c.name}: ${formatCurrency(c.remainingDebt)} UZS`}
                    >
                      {c.name.split(' ')[0]}: {(c.remainingDebt / 1000000).toFixed(1)}M
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
