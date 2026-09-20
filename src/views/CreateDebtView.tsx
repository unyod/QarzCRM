import React, { useState } from 'react';
import { Customer, CartItem, DebtContract } from '../types';
import { INITIAL_PRODUCTS, CATALOG_PRODUCTS, formatCurrency } from '../data/mockData';

interface CreateDebtViewProps {
  customers: Customer[];
  onAddDebtContract: (contract: DebtContract) => void;
  onOpenNewCustomer: () => void;
  onSuccessNavigate: () => void;
}

export const CreateDebtView: React.FC<CreateDebtViewProps> = ({
  customers,
  onAddDebtContract,
  onOpenNewCustomer,
  onSuccessNavigate
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || 'cust-1');
  const [customerSearchInput, setCustomerSearchInput] = useState<string>('Aziz Aliyev');
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_PRODUCTS);
  const [termOption, setTermOption] = useState<'15' | '30' | '60' | 'custom'>('30');
  const [customDueDate, setCustomDueDate] = useState<string>('25 Noyabr 2024');
  const [notes, setNotes] = useState<string>('Ish haqi 25-sanada tushadi, qolgan 2.5 mln to‘liq to‘lanadi.');
  const [collateralText, setCollateralText] = useState<string>('Passport nusxasi ilova qilindi.');
  const [hasCollateralFile, setHasCollateralFile] = useState<boolean>(true);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [downPayment, setDownPayment] = useState<number>(1660000);
  const [showCatalogModal, setShowCatalogModal] = useState<boolean>(false);
  const [smsBeforeDays, setSmsBeforeDays] = useState<boolean>(true);
  const [smsDueMorning, setSmsDueMorning] = useState<boolean>(true);
  const [smsOverduePenalty, setSmsOverduePenalty] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  // Cart operations
  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const addProductFromCatalog = (product: typeof CATALOG_PRODUCTS[0]) => {
    const existing = cartItems.find(item => item.sku === product.sku);
    if (existing) {
      updateQuantity(existing.id, 1);
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}`,
        name: product.name,
        subtitle: product.subtitle,
        sku: product.sku,
        quantity: 1,
        unitPrice: product.price
      };
      setCartItems(prev => [...prev, newItem]);
    }
    setShowCatalogModal(false);
  };

  // Financial calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const totalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const remainingDebtAmount = Math.max(0, totalAfterDiscount - downPayment);
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Credit limit checks
  const creditLimit = selectedCustomer?.creditLimit || 15000000;
  const currentTotalUsed = (selectedCustomer?.remainingDebt || 0) + remainingDebtAmount;
  const usedPercent = Math.min(100, Math.round((currentTotalUsed / creditLimit) * 100));

  const handleSelectTerm = (term: '15' | '30' | '60' | 'custom') => {
    setTermOption(term);
    const date = new Date();
    if (term === '15') {
      date.setDate(date.getDate() + 15);
      setCustomDueDate(date.toLocaleDateString('uz-UZ'));
    } else if (term === '30') {
      date.setDate(date.getDate() + 30);
      setCustomDueDate(date.toLocaleDateString('uz-UZ'));
    } else if (term === '60') {
      date.setDate(date.getDate() + 60);
      setCustomDueDate(date.toLocaleDateString('uz-UZ'));
    }
  };

  const handleSubmitDebt = () => {
    if (cartItems.length === 0) {
      alert("Iltimos, sotiladigan mahsulotlarni qo'shing!");
      return;
    }
    if (!selectedCustomer) {
      alert("Iltimos, mijozni tanlang!");
      return;
    }

    setIsSubmitting(true);
    const contractNum = `DEBT-2024-${Math.floor(8800 + Math.random() * 1000)}`;

    const newContract: DebtContract = {
      id: `debt-${Date.now()}`,
      contractNumber: contractNum,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      totalAmount: totalAfterDiscount,
      paidAmount: downPayment,
      remainingAmount: remainingDebtAmount,
      startDate: new Date().toLocaleDateString('uz-UZ'),
      dueDate: customDueDate,
      termDays: termOption === '15' ? 15 : termOption === '60' ? 60 : 30,
      status: 'active',
      branch: selectedCustomer.branch || 'Toshkent markaziy filiali',
      items: cartItems,
      notes: notes,
      collateralInfo: collateralText,
      hasCollateralFile: hasCollateralFile,
      collateralFileName: 'pasport_seriya_AA7182.pdf'
    };

    setTimeout(() => {
      onAddDebtContract(newContract);
      setIsSubmitting(false);
      alert(`Nasiya shartnomasi #${contractNum} muvaffaqiyatli rasmiylashtirildi!`);
      onSuccessNavigate();
    }, 400);
  };

  return (
    <div className="flex flex-col w-full">
      {/* POS Navigation & Session Ribbon */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md mb-space-lg">
        <div className="flex items-center gap-space-md">
          <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[24px]">receipt_long</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                Kassa #04 • Terminal 1A
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container animate-pulse" />
              <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                ID: DEBT-2024-8841
              </span>
            </div>
            <div className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Yangi Qarz va POS Rasmiylashtirish
            </div>
          </div>
        </div>

        {/* Quick Shortcuts Toolbar */}
        <div className="flex items-center gap-space-xs bg-surface-container-lowest p-1.5 rounded-xl shadow-sm border border-outline-variant/20">
          <button
            onClick={() => setShowCatalogModal(true)}
            className="px-space-md py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex items-center gap-2 text-on-surface font-label-md text-label-md"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">barcode_scanner</span>
            <span>Skaner (F3)</span>
          </button>
          <button
            onClick={() => alert("Oxirgi kassa cheklari jurnali ochilmoqda...")}
            className="px-space-md py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex items-center gap-2 text-on-surface font-label-md text-label-md"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">history</span>
            <span>Oxirgi cheklar</span>
          </button>
          <div className="px-space-sm py-1 font-label-sm text-label-sm font-mono text-on-surface-variant bg-surface-container rounded">
            <span>Kassir: A. Rahimov</span>
          </div>
        </div>
      </div>

      {/* Primary Dynamic Workspace Bento Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* Left 8 Columns: Client Ledger Selector & Dynamic Items Table */}
        <div className="xl:col-span-8 flex flex-col gap-space-lg">
          {/* Customer Identity & Creditworthiness Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 p-space-lg relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-md">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">person_pin</span>
                <span className="font-headline-md text-headline-md text-on-surface font-bold">
                  Mijoz profilingi va ishonch reytingi
                </span>
              </div>
              <button
                id="quickAddClientBtn"
                onClick={onOpenNewCustomer}
                className="px-space-md py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-label-lg text-label-lg flex items-center gap-1.5 transition-colors border border-outline-variant/20"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary">person_add</span>
                <span>+ Yangi mijoz qo'shish (Quick Add)</span>
              </button>
            </div>

            {/* Searchable Field with Auto-filled Profile State */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
              <div className="lg:col-span-7 relative">
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[20px]">
                    manage_search
                  </span>
                  <input
                    id="customerSearch"
                    type="text"
                    value={customerSearchInput}
                    onChange={(e) => {
                      setCustomerSearchInput(e.target.value);
                      const found = customers.find(c => 
                        c.name.toLowerCase().includes(e.target.value.toLowerCase()) || 
                        c.phone.includes(e.target.value)
                      );
                      if (found) setSelectedCustomerId(found.id);
                    }}
                    className="w-full h-11 pl-10 pr-24 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/30 shadow-inner"
                    placeholder="Mijoz ismi, telefon raqami yoki pasport..."
                  />
                  <div className="absolute right-2 flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-mono">
                    <span>Ctrl + F</span>
                  </div>
                </div>

                {/* Customer Meta Preview Drawer */}
                <div className="mt-space-sm p-space-sm bg-surface-container-low rounded-lg flex items-center justify-between flex-wrap gap-2 border border-outline-variant/20">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-on-surface font-label-lg text-label-lg">
                      {selectedCustomer.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-label-lg text-label-lg text-on-surface font-bold">
                        {selectedCustomer.name}
                      </div>
                      <div className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                        {selectedCustomer.phone}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-space-md">
                    <div className="text-right">
                      <div className="font-label-sm text-label-sm text-on-surface-variant">
                        Jami avvalgi qarzi:
                      </div>
                      <div className="font-label-md text-label-md font-mono text-on-tertiary-container font-bold">
                        {selectedCustomer.remainingDebt === 0 ? '0 UZS (Toza)' : `${formatCurrency(selectedCustomer.remainingDebt)} UZS`}
                      </div>
                    </div>
                    <div className="px-2.5 py-1 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      <span>{selectedCustomer.rating} Reyting</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Risk & Financial Trust Metric */}
              <div className="lg:col-span-5 bg-surface-container p-space-sm rounded-lg flex flex-col justify-between border border-outline-variant/20">
                <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                  <span>Mijoz kredit limiti holati</span>
                  <span className="font-mono font-bold text-on-surface">
                    {formatCurrency(creditLimit)} UZS
                  </span>
                </div>
                <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden my-2">
                  <div
                    className="bg-secondary h-full rounded-full transition-all duration-500"
                    style={{ width: `${usedPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between font-label-sm text-label-sm">
                  <span className="text-on-surface-variant">
                    Ushbu xarid: {formatCurrency(remainingDebtAmount)} UZS
                  </span>
                  <span className="text-on-tertiary-container font-semibold">
                    Qoldiq: {formatCurrency(Math.max(0, creditLimit - currentTotalUsed))} UZS
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Line Items Table (Tovarlar va Xizmatlar) */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
            <div className="p-space-md bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">
                  shopping_cart_checkout
                </span>
                <span className="font-headline-md text-headline-md text-on-surface font-bold">
                  Sotilayotgan Mahsulotlar ({cartItems.length} pozitsiya)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="scanBarcodeBtn"
                  onClick={() => setShowCatalogModal(true)}
                  className="px-space-md py-1.5 bg-surface-container-lowest hover:bg-surface-container-high text-on-surface rounded-lg font-label-lg text-label-lg flex items-center gap-1.5 transition-colors shadow-xs border border-outline-variant/20"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">qr_code_scanner</span>
                  <span>Shtrix-kod skanerlash</span>
                </button>
                <button
                  id="addProductRowBtn"
                  onClick={() => setShowCatalogModal(true)}
                  className="px-space-md py-1.5 bg-primary hover:bg-surface-container-highest text-on-primary hover:text-on-surface rounded-lg font-label-lg text-label-lg flex items-center gap-1.5 transition-colors shadow-sm"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>+ Mahsulot qo‘shish (F2)</span>
                </button>
              </div>
            </div>

            {/* High-Density POS Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant h-10">
                    <th className="py-2 px-space-md font-semibold w-12 text-center">#</th>
                    <th className="py-2 px-space-md font-semibold">Tovar / Mahsulot nomi</th>
                    <th className="py-2 px-space-md font-semibold">Shtrix-kod / Artikul</th>
                    <th className="py-2 px-space-md font-semibold text-center w-36">Soni</th>
                    <th className="py-2 px-space-md font-semibold text-right w-40">Birlik narxi</th>
                    <th className="py-2 px-space-md font-semibold text-right w-44">Jami summa</th>
                    <th className="py-2 px-space-md font-semibold w-16 text-center">Amal</th>
                  </tr>
                </thead>
                <tbody className="font-body-md text-body-md text-on-surface divide-y divide-surface-container-high/40" id="cartTableBody">
                  {cartItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="py-3 px-space-md text-center font-mono font-bold text-on-surface-variant">
                        {index + 1}
                      </td>
                      <td className="py-3 px-space-md">
                        <div className="font-semibold text-on-surface">{item.name}</div>
                        <div className="font-label-sm text-label-sm text-on-surface-variant">
                          {item.subtitle}
                        </div>
                      </td>
                      <td className="py-3 px-space-md font-mono text-label-sm font-medium text-on-surface-variant">
                        <span className="px-2 py-0.5 rounded bg-surface-container">{item.sku}</span>
                      </td>
                      <td className="py-3 px-space-md">
                        <div className="flex items-center justify-center bg-surface-container-low rounded-lg p-0.5 w-28 mx-auto border border-outline-variant/30">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-colors font-bold"
                            type="button"
                          >
                            -
                          </button>
                          <span className="flex-1 text-center font-mono font-bold text-label-md">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 flex items-center justify-center rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-colors font-bold"
                            type="button"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-space-md text-right font-mono font-medium text-on-surface">
                        {formatCurrency(item.unitPrice)}{' '}
                        <span className="text-label-sm text-on-surface-variant">UZS</span>
                      </td>
                      <td className="py-3 px-space-md text-right font-mono font-bold text-on-surface">
                        {formatCurrency(item.quantity * item.unitPrice)}{' '}
                        <span className="text-label-sm text-on-surface-variant">UZS</span>
                      </td>
                      <td className="py-3 px-space-md text-center">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-8 h-8 rounded hover:bg-error-container hover:text-on-error-container text-on-surface-variant transition-colors flex items-center justify-center mx-auto"
                          title="O'chirish"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {cartItems.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-on-surface-variant">
                        Savat bo'sh. Mahsulot qo'shish uchun yuqoridagi tugmani bosing.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Quick Item Insertion Bar */}
            <div className="p-space-sm bg-surface-container-low flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm border-t border-outline-variant/20">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-[16px] text-secondary">info</span>
                <span>Tovarlarni tezkor qo'shish uchun shtrix-kodni skanerlang yoki F2 tugmasini bosing.</span>
              </div>
              <span className="font-mono font-bold text-on-surface">
                Jami: {totalItemCount} dona buyum
              </span>
            </div>
          </div>

          {/* Debt Terms, Schedules & Collateral (Qarz Shartlari va Kafillik) */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 p-space-lg">
            <div className="flex items-center justify-between mb-space-md">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">calendar_month</span>
                <span className="font-headline-md text-headline-md text-on-surface font-bold">
                  To'lov jadvali va Kafillik kafolati
                </span>
              </div>
              <span className="font-label-sm text-label-sm bg-surface-container px-2.5 py-1 rounded text-on-surface-variant font-mono">
                SMS Eslatma Moduli Faol
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
              {/* Terms & Due Date Options */}
              <div className="space-y-space-md">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1.5 font-semibold">
                    Qarz to'lashning oxirgi muddati (Due Date)
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    <button
                      onClick={() => handleSelectTerm('15')}
                      className={`py-2 text-center rounded-lg font-label-md text-label-md transition-colors ${
                        termOption === '15'
                          ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`}
                      type="button"
                    >
                      15 kun
                    </button>
                    <button
                      onClick={() => handleSelectTerm('30')}
                      className={`py-2 text-center rounded-lg font-label-md text-label-md transition-colors ${
                        termOption === '30'
                          ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`}
                      type="button"
                    >
                      30 kun
                    </button>
                    <button
                      onClick={() => handleSelectTerm('60')}
                      className={`py-2 text-center rounded-lg font-label-md text-label-md transition-colors ${
                        termOption === '60'
                          ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`}
                      type="button"
                    >
                      60 kun
                    </button>
                    <button
                      onClick={() => handleSelectTerm('custom')}
                      className={`py-2 text-center rounded-lg font-label-md text-label-md transition-colors ${
                        termOption === 'custom'
                          ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`}
                      type="button"
                    >
                      Shaxsiy
                    </button>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
                      event
                    </span>
                    <input
                      type="text"
                      value={customDueDate}
                      onChange={(e) => setCustomDueDate(e.target.value)}
                      className="w-full h-10 pl-9 pr-3 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface font-semibold focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/30"
                    />
                  </div>
                </div>

                {/* Automated SMS Notifications Config */}
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-2 font-semibold">
                    Avtomatlashtirilgan SMS Eslatmalar
                  </label>
                  <div className="space-y-2 bg-surface-container-low p-space-sm rounded-lg border border-outline-variant/20">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={smsBeforeDays}
                        onChange={(e) => setSmsBeforeDays(e.target.checked)}
                        className="w-4 h-4 rounded text-secondary accent-secondary"
                      />
                      <span className="font-body-sm text-body-sm text-on-surface font-medium">
                        To'lov muddatidan 3 kun oldin eslatish
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={smsDueMorning}
                        onChange={(e) => setSmsDueMorning(e.target.checked)}
                        className="w-4 h-4 rounded text-secondary accent-secondary"
                      />
                      <span className="font-body-sm text-body-sm text-on-surface font-medium">
                        To'lov kuni ertalabki xabarnoma (09:00)
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={smsOverduePenalty}
                        onChange={(e) => setSmsOverduePenalty(e.target.checked)}
                        className="w-4 h-4 rounded text-secondary accent-secondary"
                      />
                      <span className="font-body-sm text-body-sm text-on-surface font-medium">
                        Muddati o'tganda avtomatik jarima va bildirishnoma
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Notes and Collateral Details */}
              <div className="space-y-space-md">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1.5 font-semibold">
                    Qo'shimcha Izoh (Notes)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2.5 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/30"
                    placeholder="Mijoz kelishuvi va to'lov shartlari..."
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1.5 font-semibold">
                    Kafillik / Garov ma'lumoti
                  </label>
                  <div className="flex items-center gap-2 bg-surface-container-low p-2 rounded-lg border border-outline-variant/30">
                    <span className="material-symbols-outlined text-secondary text-[20px]">
                      description
                    </span>
                    <input
                      type="text"
                      value={collateralText}
                      onChange={(e) => setCollateralText(e.target.value)}
                      className="flex-1 bg-transparent font-body-md text-body-md text-on-surface focus:outline-none"
                    />
                    <button
                      onClick={() => setHasCollateralFile(!hasCollateralFile)}
                      className="p-1 text-on-surface-variant hover:text-on-surface rounded"
                      type="button"
                      title="Fayl biriktirish"
                    >
                      <span className="material-symbols-outlined text-[20px]">attach_file</span>
                    </button>
                  </div>
                  {hasCollateralFile && (
                    <div className="flex items-center gap-2 mt-1 font-label-sm text-label-sm text-on-surface-variant">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      <span>File biriktirilgan: pasport_seriya_AA7182.pdf (1.2 MB)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Financial Settlement Calculator & Checkout Panel */}
        <div className="xl:col-span-4 flex flex-col gap-space-lg sticky top-20">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 p-space-lg">
            <div className="flex items-center justify-between pb-space-sm mb-space-md border-b border-outline-variant/20">
              <div className="font-headline-md text-headline-md text-on-surface flex items-center gap-2 font-bold">
                <span className="material-symbols-outlined text-secondary text-[22px]">point_of_sale</span>
                <span>Moliyaviy Hisob-Kitob</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-mono">
                Valyuta: UZS
              </span>
            </div>

            {/* Metric Breakdown Rows */}
            <div className="space-y-space-md">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-on-surface-variant font-body-md text-body-md">
                <span>Oraliq summa (Subtotal):</span>
                <span className="font-mono font-bold text-on-surface text-label-lg">
                  {formatCurrency(subtotal)} UZS
                </span>
              </div>

              {/* Discount with input */}
              <div className="bg-surface-container-low p-space-sm rounded-lg space-y-2 border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-error">sell</span>
                    <span>Chegirma (Discount):</span>
                  </span>
                  <div className="w-32 relative">
                    <input
                      type="number"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                      className="w-full h-8 pl-2 pr-8 bg-surface-container-lowest rounded text-right font-mono font-bold text-xs border border-outline-variant/30"
                      placeholder="0"
                    />
                    <span className="absolute right-1.5 top-2 text-[10px] text-on-surface-variant font-mono">
                      UZS
                    </span>
                  </div>
                </div>
              </div>

              {/* Down Payment (Boshlang'ich to'lov) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-on-surface font-semibold">
                    Boshlang'ich to'lov (Oldindan):
                  </label>
                  <span className="text-on-tertiary-container font-mono text-xs font-semibold">
                    Kassaga kirim
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value) || 0)}
                    className="w-full h-10 pl-3 pr-14 bg-surface-container-low rounded-lg font-headline-md text-headline-md text-on-surface font-bold text-right border border-outline-variant/30 focus:bg-surface-container-lowest focus:outline-none"
                  />
                  <span className="absolute right-3 font-label-sm text-label-sm text-on-surface-variant font-mono">
                    UZS
                  </span>
                </div>
              </div>

              <div className="h-px bg-outline-variant/40 my-1" />

              {/* Final Debt Amount (Sof Nasiya) */}
              <div className="p-space-md rounded-xl bg-primary-container text-on-primary space-y-2">
                <div className="flex items-center justify-between text-xs text-primary-fixed-dim">
                  <span>SOF NASIYA / QARZ MIQDORI:</span>
                  <span className="font-mono uppercase">{termOption} kunlik muddat</span>
                </div>
                <div className="font-headline-xl text-headline-xl font-bold font-mono tracking-tight text-tertiary-fixed">
                  {formatCurrency(remainingDebtAmount)} <span className="text-xs font-normal">UZS</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-primary-fixed-dim pt-1 border-t border-white/10">
                  <span>Oxirgi to‘lov sanasi:</span>
                  <span className="font-bold text-on-primary">{customDueDate}</span>
                </div>
              </div>

              {/* Confirmation Action Button */}
              <button
                id="submit-debt-btn"
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitDebt}
                className="w-full h-12 rounded-xl bg-secondary text-on-secondary hover:bg-secondary-container font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[22px]">task_alt</span>
                <span>Qarzdorlikni Tasdiqlash & Rasmiylashtirish</span>
              </button>

              <p className="text-center font-label-sm text-[11px] text-on-surface-variant">
                * Rasmiylashtirilgach, mijoz profiliga qarz yoziladi va SMS xabarnoma yuboriladi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Catalog / Barcode Scanner Modal */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-xl w-full p-space-lg border border-outline-variant/30 space-y-space-md">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">qr_code_scanner</span>
                <h3 className="font-headline-md font-bold text-on-surface">
                  Mahsulotlar Katalogi / Shtrix-kod
                </h3>
              </div>
              <button
                onClick={() => setShowCatalogModal(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-xs text-on-surface-variant">
              Savatga qo'shish uchun quyidagi ro'yxatdan tovar tanlang yoki shtrix-kod skanerlang:
            </p>

            <div className="max-h-72 overflow-y-auto space-y-2 divide-y divide-surface-container-high/30">
              {CATALOG_PRODUCTS.map((p) => (
                <div
                  key={p.id}
                  className="pt-2 flex items-center justify-between hover:bg-surface-container-low p-2 rounded-lg transition-colors cursor-pointer"
                  onClick={() => addProductFromCatalog(p)}
                >
                  <div>
                    <div className="font-semibold text-sm text-on-surface">{p.name}</div>
                    <div className="text-xs text-on-surface-variant font-mono">
                      Shtrix: {p.sku} • {p.subtitle}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-secondary text-sm block">
                      {formatCurrency(p.price)} UZS
                    </span>
                    <button className="px-2 py-0.5 rounded bg-primary text-on-primary text-xs font-semibold mt-1">
                      + Qo'shish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
