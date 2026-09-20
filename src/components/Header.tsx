import React, { useState } from 'react';
import { BRANCHES } from '../data/mockData';
import { NavigationPath } from '../types';

interface HeaderProps {
  currentPath: NavigationPath;
  onNavigate: (path: NavigationPath) => void;
  onOpenQuickDebt: () => void;
  onOpenQuickPay: () => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  onOpenQuickDebt,
  onSearchChange,
  searchQuery
}) => {
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0].name);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [lang, setLang] = useState<'UZ' | 'RU'>('UZ');
  const [darkMode, setDarkMode] = useState(false);
  const [quickActionOpen, setQuickActionOpen] = useState(false);

  const getBreadcrumbTitle = (path: NavigationPath) => {
    switch (path) {
      case 'dashboard': return 'Markaziy Panel';
      case 'customers': return 'Mijozlar Bazasi';
      case 'debts': return 'Qarzlar Jurnali';
      case 'payments': return "To'lovlar & Kassa";
      case 'create-debt': return 'Yangi Qarz Rasmiylashtirish';
      case 'sms-marketing': return 'SMS Xabarnomalar';
      case 'financial-reports': return 'Moliyaviy Hisobotlar';
      case 'debt-calendar': return 'Qarz Taqvimi';
      case 'employees': return 'Xodimlar & Kassirlar';
      case 'shops': return "Filiallar / Do'konlar";
      case 'ai-assistant': return 'AI Moliyaviy Yordamchi';
      case 'settings': return 'Tizim Sozlamalari';
      default: return 'Markaziy Panel';
    }
  };

  return (
    <header
      id="main-header"
      className="fixed top-0 left-64 right-0 h-16 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-outline-variant/30 z-40 px-gutter-desktop flex items-center justify-between gap-space-md"
    >
      {/* Branch selector & Breadcrumbs */}
      <div className="flex items-center gap-space-md">
        <div className="relative">
          <div
            id="branch-selector-button"
            onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
            className="flex items-center gap-space-xs px-space-sm py-1.5 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors border border-outline-variant/20"
          >
            <span className="material-symbols-outlined text-secondary text-[20px]">domain</span>
            <div className="flex flex-col text-left">
              <span className="font-label-md text-label-md text-on-surface font-semibold leading-tight">
                Bunyod Group
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight truncate max-w-[140px]">
                {selectedBranch}
              </span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">expand_more</span>
          </div>

          {branchDropdownOpen && (
            <div className="absolute left-0 mt-1 w-64 bg-surface-container-lowest rounded-lg shadow-xl border border-outline-variant/30 py-1 z-50">
              <div className="px-3 py-1.5 font-label-sm text-[10px] uppercase text-on-surface-variant font-bold">
                Filialni tanlang
              </div>
              {BRANCHES.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setSelectedBranch(b.name);
                    setBranchDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex flex-col text-xs hover:bg-surface-container-low transition-colors ${
                    selectedBranch === b.name ? 'bg-secondary/10 text-secondary font-bold' : 'text-on-surface'
                  }`}
                >
                  <span>{b.name}</span>
                  <span className="text-[10px] text-on-surface-variant">{b.address}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-outline-variant hidden xl:block" />

        <nav className="hidden xl:flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant">
          <button
            onClick={() => onNavigate('dashboard')}
            className="hover:text-on-surface transition-colors"
          >
            Bosh sahifa
          </button>
          <span>/</span>
          <span className="text-on-surface font-medium">{getBreadcrumbTitle(currentPath)}</span>
        </nav>
      </div>

      {/* Center Search Input */}
      <div className="flex-1 max-w-md mx-auto">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-9 pl-9 pr-20 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary border border-transparent focus:border-secondary transition-all"
            placeholder="Mijozlar, qarzlar, to'lovlar qidiruvi..."
          />
          <div className="absolute right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-surface-container-high font-label-sm text-label-sm text-on-surface-variant font-mono pointer-events-none">
            <span>Ctrl</span>
            <span>+</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-space-sm">
        {/* Quick Action Dropdown */}
        <div className="relative">
          <button
            id="quick-add-btn"
            onClick={() => setQuickActionOpen(!quickActionOpen)}
            className="h-9 px-space-md bg-primary hover:bg-surface-container-highest text-on-primary hover:text-on-surface font-label-lg text-label-lg rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span className="hidden 2xl:inline">Yangi Qarz / To‘lov</span>
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </button>

          {quickActionOpen && (
            <div className="absolute right-0 mt-1 w-52 bg-surface-container-lowest rounded-lg shadow-xl border border-outline-variant/30 py-1.5 z-50">
              <button
                onClick={() => {
                  setQuickActionOpen(false);
                  onNavigate('create-debt');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left font-label-md text-on-surface hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-secondary text-[18px]">post_add</span>
                <span>Yangi Qarz rasmiylashtirish</span>
              </button>
              <button
                onClick={() => {
                  setQuickActionOpen(false);
                  onNavigate('payments');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left font-label-md text-on-surface hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-on-tertiary-container text-[18px]">payments</span>
                <span>To‘lov qabul qilish</span>
              </button>
              <div className="h-px bg-outline-variant/30 my-1" />
              <button
                onClick={() => {
                  setQuickActionOpen(false);
                  onOpenQuickDebt();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left font-label-md text-on-surface hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-outline text-[18px]">bolt</span>
                <span>Tezkor qarz oynasi (Modal)</span>
              </button>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-outline-variant" />

        {/* Kassa ochiq badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-lowest rounded-full shadow-[0_1px_8px_rgba(0,0,0,0.04)] border border-outline-variant/20">
          <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim ring-2 ring-on-tertiary-container/30 animate-pulse" />
          <span className="font-label-sm text-label-sm text-on-tertiary-container font-semibold hidden md:inline">
            Kassa ochiq
          </span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            id="notifications-btn"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-error text-on-error font-label-sm text-[10px] rounded-full flex items-center justify-center font-bold">
              3
            </span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 p-space-sm z-50">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20 mb-2">
                <span className="font-label-md font-bold text-on-surface">Bildirishnomalar</span>
                <span className="px-1.5 py-0.5 rounded bg-error-container text-error text-[10px] font-bold">3 ta yangi</span>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto font-body-sm text-xs">
                <div className="p-2 rounded-lg bg-error-container/20 border border-error/20 flex gap-2">
                  <span className="material-symbols-outlined text-error text-[16px] shrink-0">warning</span>
                  <div>
                    <span className="font-bold text-error block">Muddati o‘tgan qarz!</span>
                    <span>Olimjon Toshmatov 4.6M UZS qarzini 9 kundan beri to‘lamadi.</span>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-surface-container-low flex gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px] shrink-0">schedule</span>
                  <div>
                    <span className="font-semibold text-on-surface block">Bugungi to‘lov eslatmasi</span>
                    <span>Bobur Yusupov uchun 4.5M UZS to‘lov kutilmoqda.</span>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-tertiary-fixed/30 flex gap-2">
                  <span className="material-symbols-outlined text-on-tertiary-container text-[16px] shrink-0">check_circle</span>
                  <div>
                    <span className="font-semibold text-on-tertiary-container block">To‘lov qabul qilindi</span>
                    <span>Aziz Aliyev 50,000 UZS to‘ladi (Aralash kassa).</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Language switch */}
        <div className="flex items-center bg-surface-container-low rounded-lg p-0.5 border border-outline-variant/20">
          <button
            onClick={() => setLang('UZ')}
            className={`px-2 py-1 font-label-sm text-label-sm rounded font-bold transition-all ${
              lang === 'UZ'
                ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            UZ
          </button>
          <button
            onClick={() => setLang('RU')}
            className={`px-2 py-1 font-label-sm text-label-sm rounded transition-all ${
              lang === 'RU'
                ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            RU
          </button>
        </div>

        {/* Dark/Light mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
          title="Yorug‘ / Qorong‘i rejim"
        >
          <span className="material-symbols-outlined text-[20px]">
            {darkMode ? 'dark_mode' : 'light_mode'}
          </span>
        </button>

        <div className="h-6 w-px bg-outline-variant" />

        {/* User profile */}
        <div className="flex items-center gap-space-sm pl-space-xs">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="font-label-md text-label-md text-on-surface font-semibold leading-tight">
              Azizbek Rahimov
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};
