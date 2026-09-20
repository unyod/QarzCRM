import React from 'react';
import { PaymentTransaction } from '../../types';
import { formatCurrency } from '../../data/mockData';

interface ReceiptModalProps {
  transaction: PaymentTransaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  isOpen,
  onClose
}) => {
  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-md w-full p-space-lg border border-outline-variant/30 space-y-space-md">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">receipt_long</span>
            <h3 className="font-headline-md font-bold text-on-surface">Kassa Fiskal Cheki</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Printable thermal receipt view */}
        <div className="bg-surface p-4 rounded-xl font-mono text-xs space-y-2.5 border border-outline-variant/40 shadow-inner">
          <div className="text-center space-y-1">
            <div className="font-sans font-bold text-sm tracking-tight text-on-surface uppercase">
              BUNYOD GROUP SAVDO MARKAZI
            </div>
            <p className="font-sans text-[11px] text-on-surface-variant">
              Toshkent filiali, Chilonzor 9-kvartal, 12-uy
            </p>
            <p className="text-[10px] text-outline">STIR: 309 481 920 | Kassa: #REG-901</p>
            <div className="font-bold text-on-surface pt-1">
              FISKAL CHEK № {transaction.receiptNumber}
            </div>
            <div className="text-[10px] text-on-surface-variant">
              Sana: {transaction.date} • {transaction.time}
            </div>
          </div>

          <div className="h-px bg-outline-variant/60 w-full" />

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Mijoz:</span>
              <span className="font-bold text-on-surface font-sans">{transaction.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Telefon:</span>
              <span>{transaction.customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Kassir:</span>
              <span>{transaction.cashierName}</span>
            </div>
          </div>

          <div className="h-px bg-outline-variant/60 w-full" />

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between text-on-surface-variant">
              <span>Eski balans:</span>
              <span>{formatCurrency(transaction.previousBalance)} UZS</span>
            </div>
            <div className="flex justify-between font-bold text-xs py-1 text-on-surface font-sans">
              <span>TO'LANGAN SUMMA:</span>
              <span className="text-secondary text-sm">{formatCurrency(transaction.totalAmount)} UZS</span>
            </div>
            <div className="flex justify-between text-[10px] text-on-surface-variant">
              <span>To'lov usuli:</span>
              <span className="font-bold text-primary uppercase">{transaction.method}</span>
            </div>
            <div className="flex justify-between text-[11px] pt-1 border-t border-outline-variant/40">
              <span className="text-on-surface-variant">QOLGAN QARZ:</span>
              <span className="font-bold text-error">{formatCurrency(transaction.remainingBalance)} UZS</span>
            </div>
          </div>

          {/* QR Code */}
          <div className="pt-2 flex items-center justify-between border-t border-outline-variant/40">
            <div className="text-[9px] text-outline leading-tight">
              QarzCRM orqali tekshirilgan kvitansiya.<br />
              QR-PAY-SECURE-{transaction.receiptNumber.replace('#PAY-', '')}
            </div>
            <div className="w-14 h-14 p-1 bg-surface-container-lowest rounded border border-outline-variant/30 flex items-center justify-center">
              <svg className="w-full h-full text-primary" fill="currentColor" viewBox="0 0 44 44">
                <rect height="14" width="14" x="0" y="0" />
                <rect fill="white" height="10" width="10" x="2" y="2" />
                <rect height="6" width="6" x="4" y="4" />
                <rect height="14" width="14" x="30" y="0" />
                <rect fill="white" height="10" width="10" x="32" y="2" />
                <rect height="6" width="6" x="34" y="4" />
                <rect height="14" width="14" x="0" y="30" />
                <rect fill="white" height="10" width="10" x="2" y="32" />
                <rect height="6" width="6" x="4" y="34" />
                <rect height="6" width="8" x="18" y="4" />
                <rect height="8" width="8" x="18" y="14" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container font-semibold text-xs"
          >
            Yopish
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold text-xs flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Chop etish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
