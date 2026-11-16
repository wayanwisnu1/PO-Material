# PO Material Beton

Aplikasi Purchase Order (PO) untuk Material Beton berbasis Laravel 12 dengan Dashboard React Modern.

## Fitur

### Dashboard Modern (React + 21st.dev)
- **KPI Cards** - Revenue, customers, conversion, churn dengan sparklines
- **Revenue Chart** - Interactive chart dengan table view toggle
- **Channel Breakdown** - Revenue by source dengan progress bars
- **Orders Table** - Sortable, filterable, paginated recent orders
- **Responsive Sidebar** - Collapsible rail/drawer, dark mode support
- **Indonesian locale** - IDR currency, id-ID formatting

### Manajemen Supplier
- CRUD supplier beton lengkap
- Informasi: nama, alamat, telepon, email, contact person
- Riwayat purchase order per supplier

### Purchase Order
- Buat, edit, lihat, hapus PO
- Nomor PO unik
- Detail supplier dan pembeli
- Alamat pengiriman dan jadwal
- Syarat pembayaran (Cash/Termin/Invoice)
- Terms of Payment (TOP) dalam hari
- Status tracking: Draft → Submitted → Approved → Delivered / Cancelled
- Catatan tambahan

### Item Beton
- Multiple items per PO
- Jenis beton: Readymix, Precast, dll
- Mutu beton: K-250, K-300, K-350, fc' 20 MPa, dll
- Quantity dan satuan (m³, unit, m²)
- Harga satuan dan subtotal
- Spesifikasi tambahan
- Auto-calculate total PO dari semua items
- Tambah/hapus item langsung di detail PO

## Tech Stack

- **Laravel 12** (PHP 8.2+)
- **React 18** + TypeScript
- **Tailwind CSS 4** (via Vite plugin)
- **Vite 6** (build tool + React plugin)
- **SQLite** (database default)
- **21st.dev** (AppDashboardShell component)
- **Lucide React** (icons)

## Instalasi

```bash
# Clone atau extract project
cd po-material-beton

# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Setup database (SQLite default)
php artisan migrate
php artisan db:seed

# Build assets
npm run build

# Start server
php artisan serve
```

Buka: **http://127.0.0.1:8000** (redirect ke `/dashboard`)

## Pages

- **`/dashboard`** - React dashboard modern (21st.dev AppDashboardShell)
- **`/purchase-orders`** - Laravel Blade views (legacy)
- **`/suppliers`** - Supplier management (Blade)

## Database Schema

### suppliers
```
id, name, address, phone, email, contact_person, timestamps
```

### purchase_orders
```
id, po_number (unique), po_date, supplier_id (FK),
buyer_company, buyer_address, delivery_address, delivery_schedule,
payment_terms (enum: cash/termin/invoice), payment_days (nullable),
total_amount (auto calculated), status (enum: draft/submitted/approved/delivered/cancelled),
notes (nullable), timestamps
```

### po_items
```
id, purchase_order_id (FK), concrete_type, concrete_grade,
quantity (decimal), unit, unit_price (decimal), subtotal (decimal),
specifications (nullable), timestamps
```

## Routes

```
GET  /                                    → Redirect ke dashboard
GET  /dashboard                           → React dashboard (modern)
GET  /suppliers                           → List suppliers
GET  /suppliers/create                    → Form tambah supplier
POST /suppliers                           → Save supplier
GET  /suppliers/{id}                      → Detail supplier + riwayat PO
GET  /suppliers/{id}/edit                 → Form edit supplier
PUT  /suppliers/{id}                      → Update supplier
DEL  /suppliers/{id}                      → Delete supplier (cascade PO)

GET  /purchase-orders                     → List POs
GET  /purchase-orders/create              → Form buat PO baru
POST /purchase-orders                     → Save PO
GET  /purchase-orders/{id}                → Detail PO + items + form tambah item
GET  /purchase-orders/{id}/edit           → Form edit PO
PUT  /purchase-orders/{id}                → Update PO
DEL  /purchase-orders/{id}                → Delete PO (cascade items)
POST /purchase-orders/{id}/items          → Tambah item ke PO
DEL  /purchase-orders/{id}/items/{itemId} → Hapus item dari PO
```

## Data Contoh (Seeder)

Setelah `php artisan db:seed`, akan terisi:

**3 Suppliers:**
- PT Beton Jaya Abadi (Jakarta Timur)
- CV Readymix Nusantara (Bekasi)
- PT Semen Beton Indonesia (Jakarta Selatan)

**3 Purchase Orders:**
1. PO/2026/11/001 - PT Konstruksi Mega - Status: Approved - Total: Rp 66,500,000
   - 50 m³ Readymix K-300 @ Rp 850,000
   - 30 m³ Readymix K-250 @ Rp 800,000
   
2. PO/2026/11/002 - PT Pembangunan Indah - Status: Submitted - Total: Rp 90,000,000
   - 100 m³ Readymix K-350 @ Rp 900,000
   
3. PO/2026/11/003 - CV Bangun Sejahtera - Status: Draft - Total: Rp 25,000,000
   - 200 unit Precast K-225 @ Rp 125,000

## Development

```bash
# Dev mode (hot reload)
npm run dev

# Parallel dev
php artisan serve &
npm run dev

# Clear cache
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# Reset database
php artisan migrate:fresh --seed
```

## Struktur Project

```
app/
├── Http/Controllers/
│   ├── PurchaseOrderController.php    # CRUD PO + items
│   └── SupplierController.php         # CRUD suppliers
├── Models/
│   ├── PurchaseOrder.php              # Model + updateTotalAmount()
│   ├── PoItem.php                     # Model items
│   └── Supplier.php                   # Model supplier

database/
├── migrations/
│   ├── 2026_11_06_024010_create_suppliers_table.php
│   ├── 2026_11_06_024012_create_purchase_orders_table.php
│   └── 2026_11_06_024013_create_po_items_table.php
└── seeders/
    ├── SupplierSeeder.php             # 3 suppliers contoh
    └── PurchaseOrderSeeder.php        # 3 PO + items

resources/
├── css/app.css                        # Tailwind CSS
├── js/app.js
└── views/
    ├── layouts/app.blade.php          # Layout utama
    ├── suppliers/
    │   ├── index.blade.php            # List suppliers
    │   ├── create.blade.php           # Form tambah
    │   ├── edit.blade.php             # Form edit
    │   └── show.blade.php             # Detail + riwayat PO
    └── purchase-orders/
        ├── index.blade.php            # List POs dengan status badges
        ├── create.blade.php           # Form buat PO
        ├── edit.blade.php             # Form edit PO
        └── show.blade.php             # Detail PO + items + form add item

routes/
└── web.php                            # Resource routes + custom item routes
```

## Fitur Utama

### 1. List Purchase Orders
- Tabel PO: nomor, tanggal, supplier, total, status, jadwal pengiriman
- Status badges dengan warna berbeda
- Actions: View, Edit, Delete

### 2. Detail PO (Show)
- **Info PO**: nomor, tanggal, status, jadwal, pembayaran, total
- **Pihak Terlibat**: supplier detail, pembeli, alamat pengiriman
- **Catatan**
- **Tabel Items Beton**: jenis, mutu, qty, satuan, harga, subtotal
- **Form Tambah Item**: langsung di halaman detail, auto-update total
- **Actions**: hapus item, edit PO

### 3. Auto Calculate Total
Method `updateTotalAmount()` di model PurchaseOrder otomatis hitung total dari sum subtotal items.

### 4. Supplier Management
- List suppliers dengan contact details
- Detail supplier menampilkan semua PO yang pernah dibuat
- Edit dan delete

## Models & Relationships

```php
Supplier
  → hasMany(PurchaseOrder)

PurchaseOrder
  → belongsTo(Supplier)
  → hasMany(PoItem)
  → updateTotalAmount() // recalculate total

PoItem
  → belongsTo(PurchaseOrder)
```

## License

MIT
