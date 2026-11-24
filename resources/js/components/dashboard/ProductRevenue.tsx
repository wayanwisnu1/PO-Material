import React from 'react';
import { formatCurrency, toNumber } from './utils';

export interface ProductRevenueItem {
  label: string;
  value: number;
  color: string;
}

interface ProductRevenueProps {
  data: ProductRevenueItem[];
}

export function ProductRevenue({ data }: ProductRevenueProps) {
  const total = data.reduce((s, d) => s + toNumber(d.value), 0);

  return (
    <section className="rounded-[18px] border border-[#EFE4D4] bg-white p-5 shadow-[0_1px_3px_rgba(42,33,27,0.06)] transition-shadow duration-200 hover:shadow-[0_6px_18px_rgba(42,33,27,0.10)]">
      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="text-base font-bold text-[#2A211B]">Pendapatan per produk</h2>
        <span className="text-xs font-semibold text-[#6B5B4E]">{formatCurrency(total)}</span>
      </div>
      <div className="flex flex-col gap-4">
        {data.map((item) => {
          const val = toNumber(item.value);
          const pct = total > 0 ? (val / total) * 100 : 0;
          return (
            <div key={item.label}>
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-semibold text-[#2A211B]">{item.label}</span>
                <span className="text-xs text-[#6B5B4E]">
                  {formatCurrency(val)} · <span className="font-semibold text-[#2A211B]">{Math.round(pct)}%</span>
                </span>
              </div>
              <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-[#F5EFE6]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
