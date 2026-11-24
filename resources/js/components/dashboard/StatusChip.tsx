import React from 'react';
import { getStatusColor } from './utils';

/** Label tampilan resmi untuk setiap status PO. */
const STATUS_LABEL: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  submited: 'Submitted', // typo legacy di database
  approved: 'Approved',
  delivered: 'Delivered',
  received: 'Received',
  cancelled: 'Cancelled',
};

export function StatusChip({ status }: { status: string }) {
  const key = (status || '').toLowerCase().trim();
  const label = STATUS_LABEL[key] ?? (status || '-');

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}>
      {label}
    </span>
  );
}
