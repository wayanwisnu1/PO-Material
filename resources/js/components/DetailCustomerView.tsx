import React, { useState, useEffect } from 'react';
import { useCurrentUser } from '@/lib/auth';

const params = new URLSearchParams(window.location.search);
const from = params.get('from') || 'dashboard';
const backUrl = from === 'customers' ? '/customers' : from === 'orders' ? '/orders' : '/dashboard';

interface Creator {
  name: string;
}

interface Customer {
  id: number;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  created_at: string;
  updated_at: string;
  creator?: Creator;
  updater?: Creator;
}

interface DetailCustomerViewProps {
  customerId: string;
  onBack: () => void;
}

export default function DetailCustomerView({ customerId, onBack }: DetailCustomerViewProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const { canAny } = useCurrentUser();
  const canEdit = canAny(['master.edit']);
  const canDelete = canAny(['master.delete']);

  const params = new URLSearchParams(window.location.search);
  const from = params.get('from') || 'customers';
  const backUrl = from === 'customers' ? '/customers' : from === 'orders' ? '/orders' : '/dashboard';

  useEffect(() => {
    fetch(`/api/customers/${customerId}`)
      .then(res => res.json())
      .then(data => {
        setCustomer(data.data);
        setLoading(false);
      })
      .catch(() => {
        alert('Gagal memuat data');
        setLoading(false);
      });
  }, [customerId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleDelete = () => {
    if (confirm('Hapus customer ini? Tindakan ini tidak dapat dibatalkan.')) {
      fetch(`/api/customers/${customerId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      })
        .then(res => {
          if (res.ok) {
            window.location.href = backUrl;
          } else {
            alert('Gagal menghapus customer');
          }
        })
        .catch(() => alert('Gagal menghapus customer'));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Data tidak ditemukan</p>
        <button
          onClick={onBack}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Kembali ke Daftar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Detail Customer</h2>
          <p className="mt-1 text-sm text-gray-600">Informasi lengkap customer</p>
        </div>
        <div className="flex gap-2">
          {canEdit && (
            <a
              href={`/dashboard/edit-customers/${customerId}?from=${from}`}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </a>
          )}
          {canDelete && (
            <button
              onClick={handleDelete}
              className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Hapus
            </button>
          )}
          <button
            onClick={() => window.location.href = backUrl}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">Informasi Customer</h3>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Nama Customer</p>
              <p className="text-lg font-medium text-gray-900">{customer.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contact Person</p>
              <p className="text-lg text-gray-900">{customer.contact_person}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Telepon</p>
              <p className="text-lg text-gray-900">{customer.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg text-gray-900">{customer.email}</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">Alamat</h3>
          </div>
          <div className="px-6 py-4">
            <p className="text-gray-900 whitespace-pre-line">{customer.address}</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Informasi Sistem</h3>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Dibuat</p>
              <p className="text-gray-900">{formatDate(customer.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Terakhir Diperbarui</p>
              <p className="text-gray-900">{formatDate(customer.updated_at)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Dibuat Oleh</p>
              <p className="text-gray-900">{customer.creator ? customer.creator.name : 'Sistem'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
