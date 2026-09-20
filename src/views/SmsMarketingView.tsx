import React, { useState } from 'react';
import { Customer, SMSNotice } from '../types';

interface SmsMarketingViewProps {
  customers: Customer[];
  smsLogs: SMSNotice[];
  smsRemaining: number;
  smsTotal: number;
  onSendSms: (notice: SMSNotice) => void;
}

export const SmsMarketingView: React.FC<SmsMarketingViewProps> = ({
  customers,
  smsLogs,
  smsRemaining,
  smsTotal,
  onSendSms
}) => {
  const [activeTemplate, setActiveTemplate] = useState<'reminder' | 'overdue' | 'gratitude'>('reminder');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [customText, setCustomText] = useState<string>(
    "Hurmatli {mijoz}! Bunyod Group do‘konidagi to‘lovingiz muddati {sana} kuni. Iltimos, o'z vaqtida to'lashni unutmang."
  );

  const quotaPercent = Math.round((smsRemaining / smsTotal) * 100);

  const applyTemplate = (type: 'reminder' | 'overdue' | 'gratitude') => {
    setActiveTemplate(type);
    if (type === 'reminder') {
      setCustomText("Hurmatli {mijoz}! Bunyod Group do‘konidagi to‘lovingiz muddati {sana} kuni. Iltimos, o'z vaqtida to'lashni unutmang.");
    } else if (type === 'overdue') {
      setCustomText("DIQQAT! {mijoz}, sizning nasiya to‘lovingiz muddati o‘tib ketdi. Qoldiq: {qarz} UZS. Zudlik bilan kassaga murojaat qiling.");
    } else {
      setCustomText("Hurmatli {mijoz}! To‘lovingiz muvaffaqiyatli qabul qilindi ({summa} UZS). Bunyod Group bilan hamkorligingiz uchun rahmat!");
    }
  };

  const handleSendSingleSms = () => {
    const cust = customers.find(c => c.id === selectedCustomerId);
    if (!cust) return;

    let finalMsg = customText
      .replace('{mijoz}', cust.name)
      .replace('{sana}', cust.dueDate)
      .replace('{qarz}', cust.remainingDebt.toLocaleString())
      .replace('{summa}', '50,000');

    const newNotice: SMSNotice = {
      id: `sms-${Date.now()}`,
      recipientPhone: cust.phone,
      recipientName: cust.name,
      message: finalMsg,
      sentAt: new Date().toLocaleString('uz-UZ'),
      status: 'delivered',
      type: activeTemplate === 'overdue' ? 'overdue_warning' : activeTemplate === 'gratitude' ? 'payment_confirmation' : 'due_reminder'
    };

    onSendSms(newNotice);
    alert(`SMS xabarnoma ${cust.name} (${cust.phone}) ga yuborildi!`);
  };

  return (
    <div className="flex flex-col w-full space-y-gutter-desktop">
      {/* Header */}
      <div>
        <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-1">
          <span>Aloqa va Bildirishnomalar</span>
          <span>•</span>
          <span className="text-secondary font-bold">Eskiz.uz SMS Gateway</span>
        </div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
          SMS Xabarnomalar & Eslatma Tizimi
        </h1>
      </div>

      {/* Quota Bento & Template Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
        {/* Left 4 Cols: SMS Quota & Status */}
        <div className="lg:col-span-4 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-on-surface-variant uppercase font-semibold">
                Oylik SMS Paketi
              </span>
              <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-mono text-xs font-bold">
                PRO TARIF
              </span>
            </div>
            <div className="font-metric-display text-on-surface font-bold">
              {smsRemaining.toLocaleString()} <span className="text-sm font-normal text-on-surface-variant">/ {smsTotal.toLocaleString()} qoldi</span>
            </div>
            <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full transition-all" style={{ width: `${quotaPercent}%` }} />
            </div>
            <div className="flex justify-between text-xs text-on-surface-variant">
              <span>Sarflangan: {smsTotal - smsRemaining} ta</span>
              <span className="font-bold text-secondary">{quotaPercent}% mavjud</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-outline-variant/20 space-y-2 text-xs">
            <div className="flex justify-between text-on-surface-variant">
              <span>SMS Gateway Holati:</span>
              <span className="text-on-tertiary-container font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse" />
                Faol (99.8% uptime)
              </span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span>Yetkazilish koeffitsienti:</span>
              <span className="font-bold text-on-surface font-mono">98.6%</span>
            </div>
          </div>
        </div>

        {/* Right 8 Cols: Quick Dispatch & Templates */}
        <div className="lg:col-span-8 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 space-y-space-md">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-md font-bold text-on-surface">Tezkor SMS Yuborish</h3>
            <div className="flex items-center gap-1">
              <button
                onClick={() => applyTemplate('reminder')}
                className={`px-2.5 py-1 rounded text-xs font-semibold ${
                  activeTemplate === 'reminder' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'
                }`}
              >
                Eslatma
              </button>
              <button
                onClick={() => applyTemplate('overdue')}
                className={`px-2.5 py-1 rounded text-xs font-semibold ${
                  activeTemplate === 'overdue' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'
                }`}
              >
                Muddati o'tgan
              </button>
              <button
                onClick={() => applyTemplate('gratitude')}
                className={`px-2.5 py-1 rounded text-xs font-semibold ${
                  activeTemplate === 'gratitude' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'
                }`}
              >
                Minnatdorchilik
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block font-semibold text-on-surface mb-1">Mijozni tanlang:</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone}) - {c.status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-on-surface mb-1">Dinamik parametrlar:</label>
              <div className="flex gap-1 flex-wrap pt-1">
                <span className="px-2 py-1 rounded bg-surface-container text-[11px] font-mono">{'{mijoz}'}</span>
                <span className="px-2 py-1 rounded bg-surface-container text-[11px] font-mono">{'{sana}'}</span>
                <span className="px-2 py-1 rounded bg-surface-container text-[11px] font-mono">{'{qarz}'}</span>
                <span className="px-2 py-1 rounded bg-surface-container text-[11px] font-mono">{'{summa}'}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-on-surface mb-1 text-xs">SMS Xabar Matni:</label>
            <textarea
              rows={3}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:bg-surface-container-lowest"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleSendSingleSms}
              className="h-10 px-space-lg bg-secondary hover:bg-secondary-container text-on-secondary font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Xabarni Yuborish</span>
            </button>
          </div>
        </div>
      </div>

      {/* SMS Logs Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="p-space-md bg-surface-container-low flex items-center justify-between border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">mark_email_read</span>
            <span className="font-headline-md font-bold text-on-surface">Yuborilgan SMSlar Tarixi</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container font-semibold uppercase text-on-surface-variant h-10 border-b border-outline-variant/20">
                <th className="py-2 px-space-md">Qabul qiluvchi</th>
                <th className="py-2 px-space-md">Telefon</th>
                <th className="py-2 px-space-md">Xabar matni</th>
                <th className="py-2 px-space-md">Vaqt</th>
                <th className="py-2 px-space-md">Holati</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/40">
              {smsLogs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-container-low">
                  <td className="py-3 px-space-md font-bold text-on-surface">{log.recipientName}</td>
                  <td className="py-3 px-space-md font-mono text-on-surface">{log.recipientPhone}</td>
                  <td className="py-3 px-space-md text-on-surface-variant max-w-md truncate">{log.message}</td>
                  <td className="py-3 px-space-md text-on-surface-variant font-mono">{log.sentAt}</td>
                  <td className="py-3 px-space-md">
                    <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-bold text-[10px]">
                      Yetkazildi
                    </span>
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
