import React from 'react';

export type Period = '7d' | '30d' | '90d' | '12m';

interface PeriodFilterProps {
  selected: Period;
  onChange: (period: Period) => void;
}

const PERIODS: { id: Period; label: string }[] = [
  { id: '7d', label: '7 Hari' },
  { id: '30d', label: '30 Hari' },
  { id: '90d', label: '90 Hari' },
  { id: '12m', label: '12 Bulan' },
];

export function PeriodFilter({ selected, onChange }: PeriodFilterProps) {
  return (
    <div className="flex bg-[#EFE4D4] p-1 rounded-full text-xs font-semibold">
      {PERIODS.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onChange(p.id)}
          className={`px-3 py-1.5 rounded-full transition-all duration-200 min-h-[36px] flex items-center justify-center ${
            selected === p.id
              ? 'bg-[#C2410C] text-white shadow-sm'
              : 'text-[#6B5B4E] hover:text-[#2A211B]'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
