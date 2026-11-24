import React from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

export interface KpiProps {
  label: string;
  value: string;
  delta: number | null; // null = tampilkan "-"
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

export function KpiCard({ label, value, delta, icon, iconBg, iconColor }: KpiProps) {
  const up = delta !== null && delta > 0;
  const down = delta !== null && delta < 0;
  const flat = delta !== null && delta === 0;

  return (
    <article className="relative flex min-h-[120px] flex-col justify-between overflow-hidden rounded-[18px] border border-[#EFE4D4] bg-white p-5 shadow-[0_1px_3px_rgba(42,33,27,0.06)] transition-shadow duration-200 hover:shadow-[0_6px_18px_rgba(42,33,27,0.10)]">
      <span
        aria-hidden="true"
        className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-[12px] ${iconBg} ${iconColor}`}
      >
        {icon}
      </span>
      <h3 className="max-w-[65%] text-[13px] font-semibold text-[#6B5B4E]">
        {label}
      </h3>
      <div className="mt-6">
        <p className="text-[26px] font-bold leading-none tracking-tight text-[#2A211B]">
          {value}
        </p>
        <p className="mt-2.5 flex items-center gap-1.5 text-xs">
          {delta === null ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 font-semibold text-[#6B5B4E]">
              <Minus className="h-3 w-3" aria-hidden="true" />
              vs periode lalu
            </span>
          ) : up ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 font-semibold text-[#0F6B3A]">
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />+{delta.toFixed(1)}%
            </span>
          ) : down ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 font-semibold text-[#B91C1C]">
              <ArrowDownRight className="h-3 w-3" aria-hidden="true" />−{Math.abs(delta).toFixed(1)}%
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 font-semibold text-[#6B5B4E]">
              0% vs periode lalu
            </span>
          )}
          {delta !== null && (
            <span className="text-[#6B5B4E]">vs periode lalu</span>
          )}
        </p>
      </div>
    </article>
  );
}
