import React, { useState } from 'react';
import { Customer } from '../../types';

interface BulkSmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  smsRemaining: number;
  onSendBulkSms: (count: number) => void;
}

export const BulkSmsModal: React.FC<BulkSmsModalProps> = ({
  isOpen,
  onClose,
  customers,
  smsRemaining,
  onSendBulkSms
}) => {
  const [targetAudience, setTargetAudience] = useState<'all' | 'overdue' | 'due_today'>('overdue');
  const [smsMessage, setSmsMessage] = useState<string>(
    "Hurmatli mijoz! Bunyod Group do'konidagi qarz to'lovingiz muddati yaqinlashmoqda. To'lovni o'z vaqtida amalga oshirishingizni so'raymiz."
  );

  if (!isOpen) return null;

  const targetCount = targetAudience === 'all' 
    ? customers.length 
    : targetAudience === 'overdue' 
    ? customers.filter(c => c.status === 'overdue').length || 14
    : customers.filter(c => c.status === 'due_today').length || 8;

  const handleSend = () => {
    onSendBulkSms(targetCount);
    alert(`${targetCount} nafar mijozga SMS xabarnomalar muvaffaqiyatli yuborildi!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-lg w-full p-space-lg border border-outline-variant/30 space-y-space-md">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">mark_chat_unread</span>
            <h3 className="font-headline-md font-bold text-on-surface">Ommaviy SMS Xabarnoma</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-on-surface mb-1">Mijozlar guruhi (Auditoriya)</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTargetAudience('overdue')}
                className={`py-2 px-2 rounded-lg text-center font-semibold transition-all border ${
                  targetAudience === 'overdue'
                    ? 'bg-error-container text-error border-error'
                    : 'bg-surface-container-low text-on-surface border-transparent'
                }`}
              >
                Muddati o'tganlar
              </button>
              <button
                type="button"
                onClick={() => setTargetAudience('due_today')}
                className={`py-2 px-2 rounded-lg text-center font-semibold transition-all border ${
                  targetAudience === 'due_today'
                    ? 'bg-secondary text-on-secondary border-secondary'
                    : 'bg-surface-container-low text-on-surface border-transparent'
                }`}
              >
                Bugun to'laydiganlar
              </button>
              <button
                type="button"
                onClick={() => setTargetAudience('all')}
                className={`py-2 px-2 rounded-lg text-center font-semibold transition-all border ${
                  targetAudience === 'all'
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container-low text-on-surface border-transparent'
                }`}
              >
                Barcha mijozlar
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-on-surface mb-1">SMS Matni</label>
            <textarea
              rows={3}
              value={smsMessage}
              onChange={(e) => setSmsMessage(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:bg-surface-container-lowest"
            />
            <div className="flex justify-between text-[11px] text-on-surface-variant mt-1">
              <span>Uzunligi: {smsMessage.length} belgi (1 SMS)</span>
              <span>Qabul qiluvchilar: <strong className="text-on-surface">{targetCount} ta</strong></span>
            </div>
          </div>

          <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/20 flex justify-between items-center">
            <span className="text-on-surface-variant">Mavjud SMS balansi:</span>
            <span className="font-mono font-bold text-secondary text-sm">{smsRemaining} ta</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container font-semibold"
            >
              Bekor qilish
            </button>
            <button
              type="button"
              onClick={handleSend}
              className="px-5 py-2 rounded-lg bg-secondary hover:bg-secondary-container text-on-secondary font-bold shadow-sm"
            >
              Yuborish ({targetCount} ta SMS)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
