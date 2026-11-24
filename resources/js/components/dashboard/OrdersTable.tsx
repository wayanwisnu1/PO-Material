import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency, getStatusColor, Order, toNumber } from './utils';
import { StatusChip } from './StatusChip';

interface OrdersTableProps {
  orders: Order[];
}

const PAGE_SIZE = 5;

const STATUS_LIST = [
  'Semua',
  'Draft',
  'Submitted',
  'Approved',
  'Delivered',
  'Received',
  'Cancelled',
] as const;

/** Warna dot indikator per status (selaras dengan warna badge status). */
const STATUS_DOT: Record<string, string> = {
  Draft: 'bg-gray-400',
  Submitted: 'bg-blue-500',
  Approved: 'bg-emerald-500',
  Delivered: 'bg-green-500',
  Received: 'bg-teal-500',
  Cancelled: 'bg-red-500',
};

function getAvatarColor(name: string) {
  const colors = ['bg-[#1D5FA8]', 'bg-[#0F6B3A]', 'bg-[#C2410C]', 'bg-[#7C3A12]', 'bg-[#6B5B4E]'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [filter, setFilter] = useState<string>('Semua');
  const [page, setPage] = useState(0);

  /**
   * Normalisasi status dari database: huruf kecil, dan "Submited" (typo legacy
   * di DB) disamakan dengan "submitted" agar filter tetap akurat.
   */
  const normalizeStatus = (status: string) => {
    const s = (status || '').toLowerCase().trim();
    return s === 'submited' ? 'submitted' : s;
  };

  const filtered = useMemo(() => {
    if (filter === 'Semua') return orders;
    const target = filter.toLowerCase();
    return orders.filter((o) => normalizeStatus(o.status) === target);
  }, [orders, filter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { Semua: orders.length };
    for (const s of STATUS_LIST) {
      if (s === 'Semua') continue;
      const target = s.toLowerCase();
      c[s] = orders.filter((o) => normalizeStatus(o.status) === target).length;
    }
    return c;
  }, [orders]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages - 1);
  const visible = filtered.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE);

  if (page > current) setPage(current);

  return (
    <section className="rounded-[18px] border border-[#EFE4D4] bg-white shadow-[0_1px_3px_rgba(42,33,27,0.06)] transition-shadow duration-200 hover:shadow-[0_6px_18px_rgba(42,33,27,0.10)]">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 pb-3">
        <h2 className="text-base font-bold text-[#2A211B]">
          Pesanan terbaru · <span className="text-[#6B5B4E]">{filtered.length} dari {orders.length}</span>
        </h2>
        <div className="hide-scrollbar flex max-w-full gap-1.5 overflow-x-auto">
          {STATUS_LIST.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setFilter(s);
                setPage(0);
              }}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors min-h-[36px] ${
                filter === s
                  ? 'border-[#2A211B] bg-[#2A211B] text-white'
                  : 'border-transparent bg-[#F5EFE6] text-[#6B5B4E] hover:bg-[#EFE4D4]'
              }`}
            >
              {s !== 'Semua' && (
                <span
                  aria-hidden="true"
                  className={`inline-block h-1.5 w-1.5 rounded-full ${STATUS_DOT[s] ?? 'bg-gray-400'}`}
                />
              )}
              {s} <span className="font-mono text-[10px] opacity-70">{counts[s] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-[#EFE4D4] bg-[#F9F3EA]">
              {['PESANAN', 'PELANGGAN', 'STATUS', 'LOKASI', 'TANGGAL', 'JUMLAH'].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#6B5B4E]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#6B5B4E]">
                  Tidak ada pesanan untuk filter ini.
                </td>
              </tr>
            ) : (
              visible.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-[#EFE4D4] transition-colors duration-150 hover:bg-[#FDF8F2]"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-[#6B5B4E]">{o.id}</td>
                  <td className="min-w-[180px] px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white ${getAvatarColor(o.customer)}`}
                        aria-hidden="true"
                      >
                        {getInitials(o.customer)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#2A211B]">{o.customer}</p>
                        <p className="truncate text-[11px] text-[#6B5B4E]">{o.product}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <StatusChip status={o.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-[#2A211B]">{o.location}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-[#6B5B4E]">
                    {new Date(o.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-bold text-[#2A211B]">
                    {formatCurrency(toNumber(o.amount))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-3 px-5 py-3 text-xs text-[#6B5B4E]">
        <span className="tabular-nums">
          {filtered.length === 0
            ? '0 hasil'
            : `${current * PAGE_SIZE + 1}–${Math.min(filtered.length, (current + 1) * PAGE_SIZE)} dari ${filtered.length}`}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Halaman sebelumnya"
            disabled={current === 0}
            onClick={() => setPage(current - 1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#EFE4D4] text-[#6B5B4E] transition-colors hover:bg-[#F5EFE6] disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[3ch] text-center font-mono font-semibold tabular-nums text-[#2A211B]">
            {current + 1}/{pages}
          </span>
          <button
            type="button"
            aria-label="Halaman berikutnya"
            disabled={current >= pages - 1}
            onClick={() => setPage(current + 1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#EFE4D4] text-[#6B5B4E] transition-colors hover:bg-[#F5EFE6] disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
