import React from 'react';
import { LucideProps } from 'lucide-react';

export const toNumber = (v: any) => Number(v) || 0;

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

/**
 * Warna badge status PO. Kunci dinormalisasi ke huruf kecil dan
 * "submited" (typo legacy di DB) diperlakukan sama dengan "submitted".
 */
export const getStatusColor = (status: string) => {
  const key = (status || '').toLowerCase().trim();
  switch (key) {
    case 'draft': return 'bg-gray-100 text-gray-600 border-gray-200';
    case 'submitted':
    case 'submited': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
    case 'received': return 'bg-teal-100 text-teal-800 border-teal-200';
    case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export interface Order {
  id: string;
  customer: string;
  product: string;
  status: string;
  location: string;
  date: string;
  amount: number;
}
