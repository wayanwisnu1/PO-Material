<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Customer;
use Illuminate\Support\Facades\Auth;

class ActivityLogApiController extends Controller
{
    /**
     * Label modul untuk ditampilkan di UI.
     */
    protected array $moduleLabels = [
        'PurchaseOrder' => 'Purchase Order',
        'Product' => 'Produk',
        'ProductHotmix' => 'Produk Hotmix',
        'ProductBatu' => 'Produk Batu',
        'Customer' => 'Customer',
        'Supplier' => 'Supplier',
        'User' => 'User',
    ];

    /**
     * Label ramah untuk setiap kolom, agar tidak menampilkan nama kolom database.
     */
    protected array $fieldLabels = [
        'po_number' => 'Nomor PO',
        'po_date' => 'Tanggal PO',
        'po_type' => 'Tipe PO',
        'nama_marketing' => 'Nama Marketing',
        'customer_id' => 'Customer',
        'contact_person' => 'Contact Person',
        'quantity' => 'Jumlah',
        'material_name' => 'Nama Material',
        'satuan' => 'Satuan',
        'harga' => 'Harga Satuan',
        'total_amount' => 'Total Nilai',
        'buyer_address' => 'Alamat Pembeli',
        'delivery_address' => 'Alamat Pengiriman',
        'delivery_schedule' => 'Jadwal Pengiriman',
        'payment_terms' => 'Termin Pembayaran',
        'payment_days' => 'Lama Termin (hari)',
        'status' => 'Status',
        'jenis_transaksi' => 'Jenis Transaksi',
        'lokasi_sumber' => 'Lokasi Sumber',
        'foto_po' => 'Foto PO',
        'name' => 'Nama',
        'email' => 'Email',
        'phone' => 'Telepon',
        'address' => 'Alamat',
        'company' => 'Perusahaan',
        'code' => 'Kode',
        'price' => 'Harga',
        'unit' => 'Satuan',
        'stock' => 'Stok',
        'description' => 'Deskripsi',
        'is_active' => 'Status Aktif',
        'role_id' => 'Role',
    ];

    /**
     * Kolom teknis yang tidak perlu ditampilkan sebagai "perubahan".
     */
    protected array $ignoredFields = [
        'id', 'created_at', 'updated_at', 'deleted_at',
        'created_by', 'updated_by', 'deleted_by',
        'remember_token', 'email_verified_at', 'password',
        'customer', 'creator', 'updater', 'items',
    ];

    public function getLogs($subjectType = null, $subjectId = null)
    {
        if (! Auth::user()->hasPermission('data.view_all')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = ActivityLog::with('user');

        if ($subjectType && $subjectId) {
            $query->where('subject_type', $subjectType)
                  ->where('subject_id', $subjectId);
        }

        $logs = $query->orderBy('created_at', 'desc')->limit(500)->get();

        // Kumpulkan customer_id yang muncul agar bisa ditampilkan sebagai nama.
        $customerIds = [];
        foreach ($logs as $log) {
            foreach ([$log->old_data, $log->new_data] as $payload) {
                if (is_array($payload) && isset($payload['customer_id'])) {
                    $customerIds[] = $payload['customer_id'];
                }
            }
        }
        $customerNames = empty($customerIds)
            ? collect()
            : Customer::whereIn('id', array_unique($customerIds))->pluck('name', 'id');

        $result = $logs->map(function (ActivityLog $log) use ($customerNames) {
            $old = is_array($log->old_data) ? $log->old_data : [];
            $new = is_array($log->new_data) ? $log->new_data : [];

            $actionKey = $this->detectAction($old, $new);

            $subjectType = class_basename($log->subject_type);
            $moduleLabel = $this->moduleLabels[$subjectType] ?? $subjectType;

            // Tipe PO (beton/hotmix/batu) untuk memperjelas modul
            $poType = $new['po_type'] ?? $old['po_type'] ?? null;
            if ($subjectType === 'PurchaseOrder' && $poType) {
                $moduleLabel = 'PO ' . ucfirst($poType);
            }

            $reference = $new['po_number'] ?? $old['po_number'] ?? null;

            $changes = $actionKey === 'update'
                ? $this->buildChanges($old, $new, $customerNames)
                : [];

            $subjectLabel = $moduleLabel;
            if ($reference) {
                $subjectLabel .= ' — ' . $reference;
            }

            $description = match ($actionKey) {
                'create' => 'Menambahkan data ' . $moduleLabel,
                'delete' => 'Menghapus data ' . $moduleLabel,
                default => empty($changes)
                    ? 'Menyimpan data ' . $moduleLabel . ' tanpa perubahan nilai'
                    : 'Mengubah ' . count($changes) . ' kolom pada ' . $moduleLabel,
            };

            return [
                'id' => $log->id,
                'created_at' => $log->created_at,
                'user' => $log->user ? ['name' => $log->user->name] : null,
                'action_key' => $actionKey,
                'action' => ucfirst($actionKey),
                'module' => $moduleLabel,
                'subject_type' => $subjectType,
                'subject_id' => $log->subject_id,
                'reference' => $reference,
                'subject_label' => $subjectLabel,
                'description' => $description,
                'change_count' => count($changes),
                'changes' => $changes,
            ];
        });

        return response()->json($result);
    }

    /**
     * Tentukan jenis aksi dari isi payload.
     */
    protected function detectAction(array $old, array $new): string
    {
        if (empty($old) && ! empty($new)) {
            return 'create';
        }

        if (! empty($old) && empty($new)) {
            return 'delete';
        }

        return 'update';
    }

    /**
     * Bandingkan data lama & baru, hasilkan daftar perubahan yang mudah dibaca.
     */
    protected function buildChanges(array $old, array $new, $customerNames): array
    {
        $changes = [];
        $keys = array_unique(array_merge(array_keys($old), array_keys($new)));

        foreach ($keys as $key) {
            if (in_array($key, $this->ignoredFields, true)) {
                continue;
            }

            $before = $old[$key] ?? null;
            $after = $new[$key] ?? null;

            if ($this->valuesEqual($before, $after)) {
                continue;
            }

            $changes[] = [
                'field' => $key,
                'label' => $this->fieldLabels[$key] ?? ucwords(str_replace('_', ' ', $key)),
                'old' => $this->formatValue($key, $before, $customerNames),
                'new' => $this->formatValue($key, $after, $customerNames),
            ];
        }

        return $changes;
    }

    protected function valuesEqual($a, $b): bool
    {
        if (is_array($a) || is_array($b)) {
            return json_encode($a) === json_encode($b);
        }

        if ($a === null && $b === null) {
            return true;
        }

        if ($a === null || $b === null) {
            return false;
        }

        // Bandingkan sebagai string agar "100" dan 100 dianggap sama
        return (string) $a === (string) $b;
    }

    /**
     * Ubah nilai mentah menjadi teks yang bisa dibaca manusia.
     */
    protected function formatValue(string $key, $value, $customerNames): string
    {
        if ($value === null || $value === '') {
            return '—';
        }

        if ($key === 'customer_id' && $customerNames->has($value)) {
            return $customerNames->get($value);
        }

        if ($key === 'is_active') {
            return $value ? 'Aktif' : 'Tidak Aktif';
        }

        if (is_bool($value)) {
            return $value ? 'Ya' : 'Tidak';
        }

        if (is_array($value)) {
            return json_encode($value);
        }

        if (in_array($key, ['harga', 'total_amount', 'price'], true) && is_numeric($value)) {
            return 'Rp ' . number_format((float) $value, 0, ',', '.');
        }

        if (in_array($key, ['quantity', 'stock'], true) && is_numeric($value)) {
            return rtrim(rtrim(number_format((float) $value, 2, ',', '.'), '0'), ',');
        }

        if (str_ends_with($key, '_at') || str_ends_with($key, '_date') || $key === 'delivery_schedule') {
            try {
                return \Carbon\Carbon::parse($value)->translatedFormat('d M Y');
            } catch (\Throwable $e) {
                return (string) $value;
            }
        }

        return (string) $value;
    }
}

