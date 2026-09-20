import React, { useState } from 'react';
import { Customer } from '../types';
import { formatCurrency } from '../data/mockData';

interface AIAssistantViewProps {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  customers,
  onSelectCustomer
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[1]?.id || customers[0]?.id);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    riskLevel: 'Past' | "O'rta" | 'Yuqori';
    score: number;
    summary: string;
    recommendedAction: string;
    generatedSms: string;
  } | null>({
    riskLevel: 'Yuqori',
    score: 82,
    summary: "Olimjon Toshmatov 9 kundan beri to'lovni kechiktirmoqda. Kredit limiti (10 mln) ning 46% qismidan foydalangan. Oldingi to'lovlarida ham 4-5 kunlik kechikishlar kuzatilgan.",
    recommendedAction: "1. Ertalab 09:30 da telefon orqali shaxsan bog'lanish.\n2. Agar javob bermasa, kafil shaxsga xabarnoma jo'natish.\n3. Qarzdorlikni 2 qismga (2.3 mln dan) bo'lib to'lashni taklif qilish.",
    generatedSms: "Assalomu alaykum Olimjon aka! Bunyod Group do'koni bo'yicha 4,600,000 so'mlik nasiya to'lovingiz muddati 9 kunga kechikdi. Siz uchun to'lovni 2 qismga bo'lib to'lash imkoniyatini taqdim etamiz. Bugun soat 17:00 gacha kassa bilan bog'lanishingizni so'raymiz: +998 71 200-00-00."
  });

  const handleAnalyze = () => {
    const cust = customers.find(c => c.id === selectedCustomerId);
    if (!cust) return;

    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      if (cust.status === 'overdue') {
        setAnalysisResult({
          riskLevel: 'Yuqori',
          score: 84,
          summary: `${cust.name} to'lovni kechiktirmoqda. Qoldiq qarz: ${formatCurrency(cust.remainingDebt)} UZS. Kredit tarixi tahlili bo'yicha undiruv foizi 68%.`,
          recommendedAction: "1. Muddatni qayta ko'rib chiqish yoki qisman to'lovni talab qilish.\n2. Telegram yoki SMS orqali rasmiy ogohlantirish yuborish.",
          generatedSms: `Hurmatli ${cust.name}! Bunyod Group do'konidagi ${formatCurrency(cust.remainingDebt)} so'mlik qarzingiz muddati o'tib ketgan. Jarima hisoblanmasligi uchun bugun to'lovni amalga oshiring.`
        });
      } else {
        setAnalysisResult({
          riskLevel: 'Past',
          score: 18,
          summary: `${cust.name} intizomli mijoz (${cust.rating} reyting). To'lov muddati: ${cust.dueDate}. Kechikish ehtimoli 5% dan kam.`,
          recommendedAction: "Standart avtomatlashtirilgan eslatma kifoya qiladi. Maxsus qattiq choralar talab etilmaydi.",
          generatedSms: `Hurmatli ${cust.name}! Sizga qulaylik yaratish maqsadida ${cust.dueDate} sanasidagi ${formatCurrency(cust.remainingDebt)} so'm to'lovingizni eslatib o'tamiz. Rahmat!`
        });
      }
    }, 600);
  };

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  return (
    <div className="flex flex-col w-full space-y-gutter-desktop">
      <div>
        <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-1">
          <span>Sun'iy Intellekt Tahlili</span>
          <span>•</span>
          <span className="text-secondary font-bold">Gemini 2.5 Debt Intelligence</span>
        </div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
          AI Risk Tahlili & Undirish Strategiyasi
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
        {/* Left: Selector and Profile */}
        <div className="lg:col-span-5 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 space-y-space-md">
          <h3 className="font-headline-md font-bold text-on-surface">Mijozni Tahlil Uchun Tanlang</h3>
          
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">Mijoz:</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} — {formatCurrency(c.remainingDebt)} UZS ({c.status})
                </option>
              ))}
            </select>
          </div>

          {selectedCustomer && (
            <div className="p-3 bg-surface-container-low rounded-lg space-y-2 text-xs border border-outline-variant/20">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Qoldiq qarz:</span>
                <span className="font-mono font-bold text-secondary">
                  {formatCurrency(selectedCustomer.remainingDebt)} UZS
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">To'lov muddati:</span>
                <span className="font-semibold text-on-surface">{selectedCustomer.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Reyting:</span>
                <span className="font-bold text-on-tertiary-container">{selectedCustomer.rating} toifa</span>
              </div>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full h-11 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">psychology</span>
            <span>{analyzing ? "AI Tahlil qilmoqda..." : "AI Tahlilni Ishga Tushirish"}</span>
          </button>
        </div>

        {/* Right: AI Analysis Output */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 space-y-space-md">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">auto_awesome</span>
              <h3 className="font-headline-md font-bold text-on-surface">Tahlil Natijalari & Tavsiyalar</h3>
            </div>
            {analysisResult && (
              <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                analysisResult.riskLevel === 'Yuqori'
                  ? 'bg-error-container text-error'
                  : 'bg-tertiary-fixed text-on-tertiary-fixed'
              }`}>
                Risk: {analysisResult.riskLevel} ({analysisResult.score}/100)
              </span>
            )}
          </div>

          {analysisResult && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-on-surface mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-secondary">analytics</span>
                  Mijozning Moliyaviy Xatti-Harakati:
                </h4>
                <p className="text-on-surface-variant leading-relaxed bg-surface-container-low p-3 rounded-lg">
                  {analysisResult.summary}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-on-surface mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-on-tertiary-container">check_circle</span>
                  Tavsiya Qilingan Qadamlar (Action Plan):
                </h4>
                <div className="text-on-surface whitespace-pre-line bg-surface-container-low p-3 rounded-lg font-medium">
                  {analysisResult.recommendedAction}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-on-surface mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-primary">chat</span>
                  Optimal O'zbek Tilidagi Eslatma Matni:
                </h4>
                <div className="p-3 bg-surface-container rounded-lg font-mono text-[11px] text-on-surface border border-outline-variant/30 flex justify-between items-start gap-2">
                  <span className="flex-1">{analysisResult.generatedSms}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(analysisResult.generatedSms);
                      alert("Matn nusxalandi!");
                    }}
                    className="p-1 rounded bg-surface-container-high hover:bg-surface-container-highest shrink-0"
                    title="Nusxa olish"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
