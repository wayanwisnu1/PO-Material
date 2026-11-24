import React from 'react';
import { Clock } from 'lucide-react';

interface AlertBannerProps {
  pending: number;
  submitted: number;
}

export function AlertBanner({ pending, submitted }: AlertBannerProps) {
  if (pending === 0 && submitted === 0) return null;

  return (
    <div
      role="status"
      className="mb-6 flex items-center gap-3 rounded-[18px] border border-[#F5D0A9] bg-[#FEF3E2] px-4 py-3"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#C2410C] text-white">
        <Clock className="h-4.5 w-4.5" aria-hidden="true" />
      </span>
      <p className="text-sm leading-relaxed text-[#7C3A12]">
        <span className="font-bold">{pending} pesanan masih Pending</span> dan{' '}
        <span className="font-bold">{submitted} baru Submitted</span>. Segera tindak lanjuti agar tidak tertunda.
      </p>
    </div>
  );
}
