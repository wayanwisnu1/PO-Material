import React, { useEffect, useState } from 'react';

interface ChangeItem {
  field: string;
  label: string;
  old: string;
  new: string;
}

interface ActivityLog {
  id: number;
  created_at: string;
  user: { name: string } | null;
  action_key: 'create' | 'update' | 'delete';
  action: string;
  module: string;
  subject_type: string;
  subject_id: number;
  reference: string | null;
  subject_label: string;
  description: string;
  change_count: number;
  changes: ChangeItem[];
}

// Konfigurasi tampilan badge per aksi
const ACTION_BADGE: Record<string, { label: string; className: string }> = {
  create: {
    label: 'Tambah',
    className: 'bg-emerald-100 text-emerald-700',
  },
  update: {
    label: 'Ubah',
    className: 'bg-blue-100 text-blue-700',
  },
  delete: {
    label: 'Hapus',
    className: 'bg-rose-100 text-rose-700',
  },
};

export default function ActivityLogsContent() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/activity-logs')
      .then((res) => res.json())
      .then((data) => {
        setLogs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Activity Logs</h2>
          <p className="mt-1 text-sm text-gray-500">
            Riwayat semua aktivitas tambah, ubah, dan hapus data pada sistem.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 w-28">Aksi</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 w-40">Waktu</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 w-40">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Detail Perubahan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">Memuat data...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">Belum ada aktivitas tercatat.</td>
                </tr>
              ) : (
                logs.map((log) => {
                  const badge = ACTION_BADGE[log.action_key] ?? { label: log.action, className: 'bg-gray-100 text-gray-700' };
                  const hasChanges = log.changes && log.changes.length > 0;
                  const isExpanded = expandedId === log.id;

                  return (
                    <React.Fragment key={log.id}>
                      <tr className={isExpanded ? 'bg-gray-50' : ''}>
                        {/* Aksi */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${badge.className}`}>
                            {badge.label}
                          </span>
                        </td>
                        {/* Waktu */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(log.created_at).toLocaleString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        {/* User */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {log.user?.name || 'Sistem'}
                        </td>
                        {/* Subject */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div className="font-medium text-gray-900">{log.module}</div>
                          {log.reference && (
                            <div className="text-xs text-gray-500">{log.reference}</div>
                          )}
                        </td>
                        {/* Detail Perubahan */}
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {log.action_key === 'update' ? (
                            <div>
                              <span className="text-gray-500">{log.description}</span>
                              {hasChanges && (
                                <button
                                  type="button"
                                  onClick={() => toggleExpand(log.id)}
                                  className="ml-2 inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 hover:bg-gray-200"
                                >
                                  {isExpanded ? 'Sembunyikan' : `Lihat ${log.change_count} perubahan`}
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500">{log.description}</span>
                          )}
                        </td>
                      </tr>
                      {/* Baris expandable untuk detail perubahan */}
                      {isExpanded && hasChanges && (
                        <tr className="bg-gray-50">
                          <td colSpan={5} className="px-6 py-4">
                            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 w-48">Kolom</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Nilai Lama</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 w-8"></th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Nilai Baru</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                  {log.changes.map((c, idx) => (
                                    <tr key={idx}>
                                      <td className="px-4 py-2 text-sm font-medium text-gray-700">{c.label}</td>
                                      <td className="px-4 py-2 text-sm text-gray-500 line-through">{c.old}</td>
                                      <td className="px-4 py-2 text-center text-sm text-gray-400">→</td>
                                      <td className="px-4 py-2 text-sm font-medium text-emerald-700">{c.new}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
