import React from 'react';
import { PeriodFilter, type Period } from './PeriodFilter';

interface HeaderProps {
  period: Period;
  onPeriodChange: (p: Period) => void;
  dateRange: string;
}

export function Header({ period, onPeriodChange, dateRange }: HeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#2A211B] tracking-tight">
          Halo, ini ringkasan pesanan Anda
        </h1>
        <p className="text-sm text-[#6B5B4E] mt-1.5">
          {dateRange} · dibandingkan dengan periode sebelumnya
        </p>
      </div>
      <PeriodFilter selected={period} onChange={onPeriodChange} />
    </div>
  );
}
