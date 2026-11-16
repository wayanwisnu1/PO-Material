# Customer + Purchase Order Integration

## Always-on Rules for This User's App

### 1. CustomersPage must use API, not hardcoded data

**Pattern:** `resources/js/pages/CustomersPage.tsx` fetches from `/api/customers` via `useEffect` + `fetch`. State initialized as `[]`, loading spinner shown while fetching.

**Anti-pattern:** Hardcoding `const customers = [...]` — data never reflects DB changes, and new customers created via form do not appear.

**Fix:** Replace hardcoded list with `useState` + `useEffect` + `fetch('/api/customers')`. Show "Memuat data..." while loading, "Belum ada data customer" when empty.

### 2. CreateOrderForm must include Customer dropdown

**Pattern:** `resources/js/components/CreateOrderForm.tsx` includes `<select name="customer_id">` populated from `/api/customers` state.

**Setup:**
- Add `interface Customer { id: number; name: string; }` at file top
- Add `const [customers, setCustomers] = useState<Customer[]>([])` and `useEffect` fetching `/api/customers`
- Add `<select>` alongside existing Supplier `<select>`, with `<option value="">Pilih Customer</option>` + `{customers.map(customer => <option key={customer.id} value={customer.id}>{customer.name}</option>)}`

**Required form field:** `customer_id: ''` in `formData` initial state.

### 3. PurchaseOrder model must include customer_id

**Pattern:** `app/Models/PurchaseOrder.php` — add `'customer_id'` to `$fillable` array.

**Also add relasi:**
```php
public function customer()
{
    return $this->belongsTo(Customer::class);
}
```

### 4. Migration must add customer_id to purchase_orders

**Pattern:** `database/migrations/YYYY_MM_DD_add_customer_id_to_purchase_orders_table.php`:
```php
Schema::table('purchase_orders', function (Blueprint $table) {
    $table->foreignId('customer_id')->nullable()
          ->constrained('customers')
          ->after('supplier_id');
});
```

**Down:** dropForeign + dropColumn for customer_id.

### 5. PurchaseOrderApiController must validate customer_id

**Pattern:** `app/Http/Controllers/Api/PurchaseOrderApiController.php` — add to validation rules:
```php
'customer_id' => 'required|exists:customers,id',
```

**Also load relation** in response: `$order->load('customer')`.

### 6. Always run `npm run build` after JS changes

**Pattern:** After modifying any `.tsx` file, run `npm run build` to update `public/build/manifest.json`.

**Verified:** `vite build` succeeds with no errors when all entry points are correctly listed in `vite.config.js` inputs.

### 7. Always run `php artisan migrate` after schema changes

**Pattern:** After adding/modifying migration files, run `php artisan migrate` to apply to database.

**Verified:** Migration 2026_11_09_070316_add_customer_id_to_purchase_orders_table runs successfully.

## Pitfall: Forgetting customer_id in form submission

When creating PO, both `supplier_id` AND `customer_id` must be selected. If only supplier is filled, PO saves but customer_id is null. User must select customer from dropdown before submitting.

## Pitfall: Mismatched API response format

PurchaseOrderApiController must return `response()->json(['data' => $order->load('customer')], 201)` — same wrapper structure as other API methods. React CreateOrderForm expects `result.data` format.

## Pitfall: Not updating both CustomersPage AND CreateOrderForm

When adding new customer, both pages must be updated:
- CustomersPage: API fetch + render
- CreateOrderForm: Customer dropdown + fetch on useEffect

Both independently call `/api/customers` but share the same data source.