import React, { useState } from 'react';

interface Employee {
  id: string;
  name: string;
  role: string;
  phone: string;
  branch: string;
  status: 'active' | 'inactive';
  shiftsTotal: number;
}

export const EmployeesView: React.FC = () => {
  const [employees] = useState<Employee[]>([
    {
      id: 'emp-1',
      name: 'Anvar Rahimov',
      role: 'Katta Kassir (Terminal 1A)',
      phone: '+998 90 987-65-43',
      branch: 'Toshkent markaziy filiali',
      status: 'active',
      shiftsTotal: 24
    },
    {
      id: 'emp-2',
      name: 'Nargiza Karimova',
      role: 'Kassa operatori',
      phone: '+998 93 321-45-67',
      branch: 'Toshkent markaziy filiali',
      status: 'active',
      shiftsTotal: 22
    },
    {
      id: 'emp-3',
      name: 'Sardor Qodirov',
      role: 'Filial mudiri',
      phone: '+998 97 555-12-34',
      branch: 'Samarqand shahar filiali',
      status: 'active',
      shiftsTotal: 26
    }
  ]);

  return (
    <div className="flex flex-col w-full space-y-gutter-desktop">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-1">
            <span>Kadrlar & Huquqlar</span>
            <span>•</span>
            <span className="text-secondary font-bold">Xodimlar</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            Xodimlar va Kassirlar Nazorati
          </h1>
        </div>

        <button
          onClick={() => alert("Yangi xodim qo'shish oynasi")}
          className="h-10 px-space-md bg-primary text-on-primary rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>+ Yangi Xodim</span>
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-surface-container font-semibold text-on-surface-variant h-10 border-b border-outline-variant/20">
              <th className="py-2 px-space-md">Xodim F.I.SH</th>
              <th className="py-2 px-space-md">Lavozimi</th>
              <th className="py-2 px-space-md">Telefon</th>
              <th className="py-2 px-space-md">Filial</th>
              <th className="py-2 px-space-md">Oylik smenalar</th>
              <th className="py-2 px-space-md">Holat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-high/40">
            {employees.map(e => (
              <tr key={e.id} className="hover:bg-surface-container-low">
                <td className="py-3 px-space-md font-bold text-on-surface flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center font-mono">
                    {e.name.substring(0, 2)}
                  </div>
                  <span>{e.name}</span>
                </td>
                <td className="py-3 px-space-md text-on-surface-variant">{e.role}</td>
                <td className="py-3 px-space-md font-mono text-on-surface">{e.phone}</td>
                <td className="py-3 px-space-md text-on-surface">{e.branch}</td>
                <td className="py-3 px-space-md font-mono">{e.shiftsTotal} smena</td>
                <td className="py-3 px-space-md">
                  <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-bold text-[10px]">
                    Faol
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
