import React from 'react';
import { NavigationPath } from '../types';
import { BRAND_LOGO_URL } from '../data/mockData';

interface SidebarProps {
  currentPath: NavigationPath;
  onNavigate: (path: NavigationPath) => void;
  smsRemaining?: number;
  smsTotal?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  smsRemaining = 1420,
  smsTotal = 2000
}) => {
  const quotaPercent = Math.round((smsRemaining / smsTotal) * 100);

  const navItems: { id: NavigationPath; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Asosiy panel', icon: 'dashboard' },
    { id: 'customers', label: 'Mijozlar', icon: 'group' },
    { id: 'debts', label: 'Qarzlar', icon: 'account_balance_wallet' },
    { id: 'payments', label: "To'lovlar", icon: 'payments' },
    { id: 'create-debt', label: 'Yangi Qarz berish', icon: 'post_add' },
    { id: 'sms-marketing', label: 'SMS Xabarnomalar', icon: 'sms' },
    { id: 'financial-reports', label: 'Hisobotlar', icon: 'bar_chart' },
    { id: 'debt-calendar', label: 'Qarz Taqvimi', icon: 'calendar_month' },
    { id: 'employees', label: 'Xodimlar & Kassirlar', icon: 'badge' },
    { id: 'shops', label: "Filiallar / Do'konlar", icon: 'store' },
    { id: 'ai-assistant', label: 'AI Yordamchi', icon: 'smart_toy' },
    { id: 'settings', label: 'Sozlamalar', icon: 'settings' }
  ];

  return (
    <aside
      id="main-sidebar"
      className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest z-50 flex flex-col shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-outline-variant/30"
    >
      {/* Brand Header */}
      <div className="h-16 px-space-md flex items-center justify-between bg-surface-container-lowest border-b border-outline-variant/20">
        <div 
          className="flex items-center gap-space-sm cursor-pointer"
          onClick={() => onNavigate('dashboard')}
        >
          <img
            alt="QarzCRM Brand Logo"
            className="h-8 w-auto object-contain"
            src={BRAND_LOGO_URL}
          />
          <span className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">
            QarzCRM
          </span>
        </div>
        <span className="px-space-xs py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase font-semibold">
          SaaS
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-space-sm py-space-sm space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPath === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center gap-space-sm px-space-md py-2 rounded-lg text-left transition-colors ${
                isActive
                  ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-tertiary-fixed' : ''}`}>
                {item.icon}
              </span>
              <span className="font-label-lg text-label-lg">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer & Quota Card */}
      <div className="p-space-sm bg-surface-container-low border-t border-outline-variant/20">
        <div 
          className="bg-surface-container-lowest p-space-sm rounded-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)] mb-space-sm cursor-pointer hover:bg-surface-container/40 transition-colors"
          onClick={() => onNavigate('sms-marketing')}
        >
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-label-sm text-label-sm text-on-surface-variant">SMS Kvota</span>
            <span className="font-label-sm text-label-sm text-secondary font-semibold">{quotaPercent}%</span>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mb-1">
            <div
              className="bg-secondary h-full rounded-full transition-all duration-500"
              style={{ width: `${quotaPercent}%` }}
            />
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant truncate">
            {smsRemaining.toLocaleString()} / {smsTotal.toLocaleString()} qoldi
          </p>
        </div>

        <button
          id="logout-button"
          type="button"
          onClick={() => alert("Siz tizimdan chiqdingiz (Demo rejimi). Qayta kirish uchun sahifani yangilang.")}
          className="flex items-center gap-space-sm px-space-md py-2 rounded-lg text-error hover:bg-error-container hover:text-on-error-container transition-colors w-full text-left font-label-lg text-label-lg"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>Tizimdan chiqish</span>
        </button>
      </div>
    </aside>
  );
};
