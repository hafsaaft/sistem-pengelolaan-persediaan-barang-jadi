import React, { useState } from 'react';
import { Product, TransactionType } from '../types';
import { PlusCircle, MinusCircle } from 'lucide-react';

interface TransactionFormProps {
  products: Product[];
  onSubmit: (data: { productId: string; type: TransactionType; quantity: number; price: number; reference: string; date: string }) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ products, onSubmit }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.IN);
  const [productId, setProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [reference, setReference] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || quantity <= 0) return;
    
    onSubmit({
      productId,
      type,
      quantity,
      price,
      reference,
      date
    });

    // Reset basics
    setQuantity(0);
    setReference('');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h2 className="text-lg font-semibold mb-6 text-slate-800 flex items-center gap-2">
        {type === TransactionType.IN ? <PlusCircle className="text-emerald-500" /> : <MinusCircle className="text-red-500" />}
        Catat Transaksi
      </h2>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setType(TransactionType.IN)}
          className={`flex-1 py-2 rounded-lg font-medium transition-colors ${type === TransactionType.IN ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          Barang Masuk (Produksi)
        </button>
        <button
          onClick={() => setType(TransactionType.OUT)}
          className={`flex-1 py-2 rounded-lg font-medium transition-colors ${type === TransactionType.OUT ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          Barang Keluar (Penjualan)
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
            <input 
              type="date" 
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Produk</label>
            <select 
              required
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Pilih Produk...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah (Qty)</label>
            <input 
              type="number" 
              min="1"
              required
              value={quantity || ''}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {type === TransactionType.IN ? 'Biaya Produksi / Unit' : 'Harga Jual / Unit (Opsional)'}
            </label>
            <input 
              type="number" 
              min="0"
              value={price || ''}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Rp 0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Referensi (No. Batch / Order)</label>
          <input 
            type="text" 
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Contoh: PO-2023-001"
          />
        </div>

        <button 
          type="submit" 
          className="w-full py-2.5 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition-colors"
        >
          Simpan Transaksi
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;