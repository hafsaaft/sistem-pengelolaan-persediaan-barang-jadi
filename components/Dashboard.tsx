import React, { useMemo } from 'react';
import { Product, Transaction, ValuationMethod } from '../types';
import { generateValuationReport } from '../services/inventoryLogic';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, Package, TrendingUp, DollarSign } from 'lucide-react';

interface DashboardProps {
  products: Product[];
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ products, transactions }) => {
  // Default to Average for dashboard quick view
  const report = useMemo(() => 
    generateValuationReport(products, transactions, ValuationMethod.AVERAGE), 
  [products, transactions]);

  const totalValue = report.reduce((sum, item) => sum + item.totalValue, 0);
  const totalItems = report.reduce((sum, item) => sum + item.quantityOnHand, 0);
  
  const lowStockItems = report.filter(item => {
    const prod = products.find(p => p.id === item.productId);
    return prod && item.quantityOnHand <= prod.minStock;
  });

  const chartData = report.map(item => ({
    name: item.productName,
    value: item.totalValue,
    qty: item.quantityOnHand
  })).sort((a, b) => b.value - a.value).slice(0, 10); // Top 10 by value

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Nilai Persediaan (Avg)</p>
            <h3 className="text-2xl font-bold text-slate-800">
              Rp {totalValue.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Item Fisik</p>
            <h3 className="text-2xl font-bold text-slate-800">{totalItems} Unit</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Stok Menipis</p>
            <h3 className="text-2xl font-bold text-slate-800">{lowStockItems.length} SKU</h3>
          </div>
        </div>

         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Transaksi</p>
            <h3 className="text-2xl font-bold text-slate-800">{transactions.length}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Top 10 Aset Barang (Nilai Rupiah)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} interval={0} angle={-15} textAnchor="end" />
                <YAxis tickFormatter={(value) => `${value / 1000000}jt`} />
                <Tooltip 
                  formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Perlu Perhatian (Low Stock)</h3>
          <div className="space-y-4 overflow-y-auto max-h-64 pr-2">
            {lowStockItems.length === 0 ? (
              <p className="text-slate-400 text-sm italic">Semua stok aman.</p>
            ) : (
              lowStockItems.map(item => (
                <div key={item.productId} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                  <div>
                    <p className="font-medium text-slate-800">{item.productName}</p>
                    <p className="text-xs text-red-600">Sisa: {item.quantityOnHand} Unit</p>
                  </div>
                  <button className="text-xs font-semibold bg-white text-red-600 px-3 py-1 rounded border border-red-200 hover:bg-red-50">
                    Order
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;