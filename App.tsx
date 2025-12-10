import React, { useState, useEffect } from 'react';
import { Product, Transaction, TransactionType } from './types';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import InventoryReport from './components/InventoryReport';
import AIAdvisor from './components/AIAdvisor';
import { LayoutDashboard, ListPlus, FileText, Settings, Database } from 'lucide-react';

// Sample Initial Data
const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', sku: 'FG-001', name: 'Meja Kantor Kayu Jati', minStock: 5, category: 'Furniture' },
  { id: 'p2', sku: 'FG-002', name: 'Kursi Ergonomis A1', minStock: 10, category: 'Furniture' },
  { id: 'p3', sku: 'EL-101', name: 'Lampu Belajar LED', minStock: 20, category: 'Elektronik' },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  // Initial Stock (Production Results)
  { id: 't1', productId: 'p1', type: TransactionType.IN, quantity: 10, pricePerUnit: 1500000, date: '2023-10-01', reference: 'BATCH-001' },
  { id: 't2', productId: 'p1', type: TransactionType.IN, quantity: 5, pricePerUnit: 1600000, date: '2023-10-15', reference: 'BATCH-002' },
  { id: 't3', productId: 'p2', type: TransactionType.IN, quantity: 20, pricePerUnit: 750000, date: '2023-10-05', reference: 'BATCH-001' },
  // Sales
  { id: 't4', productId: 'p1', type: TransactionType.OUT, quantity: 3, pricePerUnit: 2500000, date: '2023-10-20', reference: 'INV-1001' },
];

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'report' | 'ai'>('dashboard');
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  const handleAddTransaction = (data: any) => {
    const newTx: Transaction = {
      id: `t${Date.now()}`,
      productId: data.productId,
      type: data.type,
      quantity: data.quantity,
      pricePerUnit: data.price, // For IN this is cost, for OUT this is selling price
      reference: data.reference,
      date: data.date
    };
    setTransactions(prev => [...prev, newTx]);
    alert("Transaksi berhasil disimpan!");
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-800">
            <h1 className="text-xl font-bold flex items-center gap-2">
                <Database className="text-emerald-400" />
                Smart<span className="text-emerald-400">Inventory</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Managed Inventory System</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
            <button 
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
                <LayoutDashboard size={20} /> Dashboard
            </button>
            <button 
                onClick={() => setActiveTab('transactions')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'transactions' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
                <ListPlus size={20} /> Transaksi (In/Out)
            </button>
            <button 
                onClick={() => setActiveTab('report')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'report' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
                <FileText size={20} /> Laporan & Valuasi
            </button>
            <button 
                onClick={() => setActiveTab('ai')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'ai' ? 'bg-indigo-600 text-white' : 'text-indigo-300 hover:bg-indigo-900/50 hover:text-white'}`}
            >
                <Settings size={20} /> AI Analysis
            </button>
        </nav>
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
            &copy; 2024 SmartInventory ID
        </div>
      </aside>

      {/* Mobile Nav Placeholder */}
      <div className="md:hidden fixed top-0 w-full bg-slate-900 text-white z-20 p-4 flex justify-between items-center shadow-md">
         <h1 className="font-bold flex items-center gap-2"><Database size={18} /> SmartInventory</h1>
         <div className="flex gap-4">
            <LayoutDashboard onClick={() => setActiveTab('dashboard')} />
            <ListPlus onClick={() => setActiveTab('transactions')} />
            <FileText onClick={() => setActiveTab('report')} />
         </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-8 mt-14 md:mt-0 overflow-y-auto">
        <header className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">
                {activeTab === 'dashboard' && 'Dashboard Overview'}
                {activeTab === 'transactions' && 'Pencatatan Transaksi'}
                {activeTab === 'report' && 'Laporan Valuasi Stok'}
                {activeTab === 'ai' && 'Analisis Cerdas (AI)'}
            </h2>
            <p className="text-slate-500 text-sm">
                {activeTab === 'dashboard' && 'Ringkasan performa dan nilai aset persediaan saat ini.'}
                {activeTab === 'transactions' && 'Catat hasil produksi (Masuk) atau pengiriman barang (Keluar).'}
                {activeTab === 'report' && 'Analisis nilai barang menggunakan metode FIFO, LIFO, atau Average.'}
                {activeTab === 'ai' && 'Dapatkan rekomendasi otomatis untuk efisiensi gudang.'}
            </p>
        </header>

        <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === 'dashboard' && (
                <>
                    <Dashboard products={products} transactions={transactions} />
                    <AIAdvisor products={products} transactions={transactions} />
                </>
            )}

            {activeTab === 'transactions' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <TransactionForm products={products} onSubmit={handleAddTransaction} />
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="font-semibold text-slate-800 mb-4">Riwayat Transaksi Terakhir</h3>
                        <div className="space-y-3">
                            {[...transactions].reverse().slice(0, 5).map(tx => (
                                <div key={tx.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg text-sm">
                                    <div>
                                        <div className="font-medium text-slate-800">
                                            {tx.type === TransactionType.IN ? 'MASUK' : 'KELUAR'} - {products.find(p => p.id === tx.productId)?.name}
                                        </div>
                                        <div className="text-slate-500 text-xs">{tx.date} • Ref: {tx.reference}</div>
                                    </div>
                                    <div className={`font-bold ${tx.type === TransactionType.IN ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {tx.type === TransactionType.IN ? '+' : '-'}{tx.quantity}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'report' && (
                <InventoryReport products={products} transactions={transactions} />
            )}

            {activeTab === 'ai' && (
                 <AIAdvisor products={products} transactions={transactions} />
            )}
        </div>
      </main>
    </div>
  );
}

export default App;