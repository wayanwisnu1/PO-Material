import React, { useState, useEffect } from 'react';

interface DetailProductHotmixViewProps {
  productId: string;
  onCancel: () => void;
}

export default function DetailProductHotmixView({ productId, onCancel }: DetailProductHotmixViewProps) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products-hotmix/${productId}`)
      .then(res => res.json())
      .then(data => { setProduct(data.data); setLoading(false); })
      .catch(() => { alert('Gagal memuat'); setLoading(false); });
  }, [productId]);

  if (loading) return <div className="p-8 text-center">Memuat...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Detail Produk Hotmix</h2>
        <button onClick={onCancel} className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50">Kembali</button>
      </div>
      <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
        <div><label className="block text-sm font-medium text-gray-500">Nama Barang</label><p className="text-lg">{product.name}</p></div>
        <div><label className="block text-sm font-medium text-gray-500">Deskripsi</label><p className="text-lg">{product.description || '-'}</p></div>
        <div><label className="block text-sm font-medium text-gray-500">Harga</label><p className="text-lg">{product.price ?? '-'}</p></div>
      </div>
    </div>
  );
}
