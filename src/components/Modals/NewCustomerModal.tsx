import React, { useState } from 'react';
import { Customer } from '../../types';

interface NewCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomer: (customer: Customer) => void;
}

export const NewCustomerModal: React.FC<NewCustomerModalProps> = ({
  isOpen,
  onClose,
  onAddCustomer
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [passport, setPassport] = useState('');
  const [address, setAddress] = useState('');
  const [branch, setBranch] = useState('Toshkent markaziy filiali');
  const [creditLimit, setCreditLimit] = useState(10000000);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert("Iltimos, mijoz ismi va telefon raqamini kiriting!");
      return;
    }

    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      code: `#CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      phone,
      passport,
      address,
      branch,
      rating: 'A',
      creditLimit,
      totalDebt: 0,
      paidAmount: 0,
      remainingDebt: 0,
      dueDate: '—',
      status: 'settled',
      notes
    };

    onAddCustomer(newCust);
    onClose();
    alert(`Yangi mijoz ${name} muvaffaqiyatli qo'shildi!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-lg w-full p-space-lg border border-outline-variant/30 space-y-space-md">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">person_add</span>
            <h3 className="font-headline-md font-bold text-on-surface">Yangi Mijoz Ro‘yxatga Olish</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-on-surface mb-1">Mijoz F.I.SH *</label>
            <input
              type="text"
              required
              placeholder="Masalan: Azizbek Aliyev"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:bg-surface-container-lowest"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-on-surface mb-1">Telefon raqam *</label>
              <input
                type="text"
                required
                placeholder="+998 90 123-45-67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-mono focus:outline-none focus:bg-surface-container-lowest"
              />
            </div>
            <div>
              <label className="block font-semibold text-on-surface mb-1">Pasport Seriya</label>
              <input
                type="text"
                placeholder="AA 1234567"
                value={passport}
                onChange={(e) => setPassport(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-mono uppercase focus:outline-none focus:bg-surface-container-lowest"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-on-surface mb-1">Biriktirilgan Filial</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none"
              >
                <option value="Toshkent markaziy filiali">Toshkent markaziy</option>
                <option value="Samarqand shahar filiali">Samarqand shahar</option>
                <option value="Andijon filiali">Andijon filiali</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-on-surface mb-1">Kredit Limiti (UZS)</label>
              <input
                type="number"
                step="500000"
                value={creditLimit}
                onChange={(e) => setCreditLimit(Number(e.target.value) || 0)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-mono font-bold focus:outline-none focus:bg-surface-container-lowest"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-on-surface mb-1">Yashash manzili</label>
            <input
              type="text"
              placeholder="Toshkent sh., Chilonzor tumani..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:bg-surface-container-lowest"
            />
          </div>

          <div>
            <label className="block font-semibold text-on-surface mb-1">Qo'shimcha izoh</label>
            <textarea
              rows={2}
              placeholder="Ish joyi, qo'shimcha telefon yoki kafillik ma'lumoti..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:bg-surface-container-lowest"
            />
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
              type="submit"
              className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold shadow-sm"
            >
              Mijozni Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
