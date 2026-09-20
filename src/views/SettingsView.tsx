import React, { useState } from 'react';

export const SettingsView: React.FC = () => {
  const [companyName, setCompanyName] = useState('Bunyod Group');
  const [stir, setStir] = useState('309 481 920');
  const [phone, setPhone] = useState('+998 71 200-00-00');
  const [currency, setCurrency] = useState('UZS');
  const [autoSms, setAutoSms] = useState(true);
  const [printerPaper, setPrinterPaper] = useState('80mm');

  const handleSave = () => {
    alert("Tizim sozlamalari muvaffaqiyatli saqlandi!");
  };

  return (
    <div className="flex flex-col w-full space-y-gutter-desktop max-w-4xl">
      <div>
        <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-1">
          <span>Tizim Konfiguratsiyasi</span>
          <span>•</span>
          <span className="text-secondary font-bold">Sozlamalar</span>
        </div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
          CRM & Kassa Sozlamalari
        </h1>
      </div>

      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 space-y-space-lg text-xs">
        {/* Company info */}
        <div>
          <h3 className="font-headline-md font-bold text-on-surface mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">apartment</span>
            Korxona & Chek Rekvizitlari
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-on-surface mb-1">Kompaniya nomi (Chek sarlavhasi)</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-semibold focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-on-surface mb-1">STIR (INN)</label>
              <input
                type="text"
                value={stir}
                onChange={(e) => setStir(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-on-surface mb-1">Bog'lanish telefoni</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-on-surface mb-1">Asosiy valyuta</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none"
              >
                <option value="UZS">UZS (O'zbekiston so'mi)</option>
                <option value="USD">USD (AQSH Dollari)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Printer & SMS settings */}
        <div className="pt-4 border-t border-outline-variant/20">
          <h3 className="font-headline-md font-bold text-on-surface mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">print</span>
            Chek va Printer Parametrlari
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-on-surface mb-1">Termal qog'oz formati</label>
              <select
                value={printerPaper}
                onChange={(e) => setPrinterPaper(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none"
              >
                <option value="80mm">80mm Standart kassa lentasi</option>
                <option value="58mm">58mm Tor kassa lentasi</option>
                <option value="A4">A4 Hujjat formati</option>
              </select>
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoSms}
                  onChange={(e) => setAutoSms(e.target.checked)}
                  className="w-4 h-4 rounded text-secondary accent-secondary"
                />
                <span className="font-semibold text-on-surface">
                  To'lov amalga oshganda avtomatik SMS yuborish
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-outline-variant/20 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold text-xs shadow-md active:scale-95 transition-all"
          >
            Sozlamalarni Saqlash
          </button>
        </div>
      </div>
    </div>
  );
};
