import React, { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartArea, Table2 } from 'lucide-react';
import { formatCurrency, toNumber } from './utils';

export interface DailyRevenuePoint {
  label: string;
  value: number;
}

interface RevenueChartProps {
  data: DailyRevenuePoint[];
  total: number;
}

export function RevenueChart({ data, total }: RevenueChartProps) {
  const [view, setView] = useState<'chart' | 'table'>('chart');

  const maxValue = Math.max(...data.map((d) => toNumber(d.value)), 0);
  const peak = data.reduce(
    (acc, cur) => (toNumber(cur.value) > toNumber(acc.value) ? cur : acc),
    data[0] ?? { label: '-', value: 0 }
  );

  const ChartToggle = () => (
    <div
      role="group"
      aria-label="Tampilan pendapatan"
      className="flex rounded-xl border border-[#EFE4D4] p-0.5"
    >
      <button
        type="button"
        aria-label="Tampilan grafik"
        aria-pressed={view === 'chart'}
        onClick={() => setView('chart')}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
          view === 'chart' ? 'bg-[#F5EFE6] text-[#C2410C]' : 'text-[#6B5B4E]'
        }`}
      >
        <ChartArea className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="Tampilan tabel"
        aria-pressed={view === 'table'}
        onClick={() => setView('table')}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
          view === 'table' ? 'bg-[#F5EFE6] text-[#C2410C]' : 'text-[#6B5B4E]'
        }`}
      >
        <Table2 className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <section className="rounded-[18px] border border-[#EFE4D4] bg-white p-5 shadow-[0_1px_3px_rgba(42,33,27,0.06)] transition-shadow duration-200 hover:shadow-[0_6px_18px_rgba(42,33,27,0.10)]">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#2A211B]">Pendapatan harian</h2>
          <p className="text-xs text-[#6B5B4E]">{formatCurrency(total)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#6B5B4E]">
            Puncak: <span className="font-semibold text-[#2A211B]">{peak.label}</span> · {formatCurrency(toNumber(peak.value))}
          </p>
          <ChartToggle />
        </div>
      </div>

      {view === 'chart' ? (
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -12 }}>
              <CartesianGrid stroke="#F3E7D9" vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tick={{ fill: '#6B5B4E', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6B5B4E', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `Rp ${(v / 1000).toFixed(0)}rb`}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(toNumber(value)), 'Pendapatan']}
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #EFE4D4',
                  background: '#fff',
                }}
              />
              <Bar
                dataKey="value"
                radius={[6, 6, 0, 0]}
                fill="#FB923C"
              >
                {data.map((entry, index) => (
                  <cell
                    key={`cell-${index}`}
                    fill={entry.value === maxValue && maxValue > 0 ? '#C2410C' : '#FDBA74'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#EFE4D4]">
          <table className="w-full text-sm">
            <thead className="bg-[#F9F3EA]">
              <tr className="text-left text-xs font-semibold text-[#6B5B4E]">
                <th className="px-4 py-2">Tanggal</th>
                <th className="px-4 py-2 text-right">Pendapatan</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.label} className="border-t border-[#EFE4D4]">
                  <td className="px-4 py-2 text-[#2A211B]">{d.label}</td>
                  <td className="px-4 py-2 text-right font-medium text-[#2A211B]">
                    {formatCurrency(toNumber(d.value))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
