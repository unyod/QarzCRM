import React from 'react';
import { BRANCHES } from '../data/mockData';

export const ShopsView: React.FC = () => {
  return (
    <div className="flex flex-col w-full space-y-gutter-desktop">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-1">
            <span>Savdo Tarmoqlari</span>
            <span>•</span>
            <span className="text-secondary font-bold">Do'konlar</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            Do'konlar va Filiallar Boshqaruvi
          </h1>
        </div>

        <button
          onClick={() => alert("Yangi filial qo'shish")}
          className="h-10 px-space-md bg-primary text-on-primary rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">store</span>
          <span>+ Yangi Filial</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        {BRANCHES.map(b => (
          <div key={b.id} className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-surface-container font-mono text-xs font-bold text-on-surface">
                {b.company}
              </span>
              <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-bold text-[10px]">
                Ochiq
              </span>
            </div>
            <h3 className="font-headline-md font-bold text-on-surface">{b.name}</h3>
            <p className="text-xs text-on-surface-variant">{b.address}</p>

            <div className="pt-2 border-t border-outline-variant/20 flex justify-between text-xs font-mono">
              <span className="text-on-surface-variant">Filial ID:</span>
              <span className="font-bold text-on-surface">{b.id.toUpperCase()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
