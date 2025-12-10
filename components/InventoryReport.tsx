import React, { useState } from 'react';
import { Product, Transaction, ValuationMethod } from '../types';
import { generateValuationReport } from '../services/inventoryLogic';
import { Download } from 'lucide-react';

interface InventoryReportProps {
  products: Product[];
  transactions: Transaction[];
}

const InventoryReport: React.FC<InventoryReportProps> = ({ products, transactions }) => {
  const [method, setMethod] = useState<ValuationMethod>(ValuationMethod.AVERAGE);

  const report = generateValuationReport(products, transactions, method);
  const totalValue = report.reduce((sum, item) => sum + item.totalValue, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-lg font-semibold text-slate-800">Laporan Valuasi Persediaan</h2>
            <p className="text-sm text-slate-500">Hitung nilai aset berdasarkan metode akuntansi.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <select 
                value={method}
                onChange={(e) => setMethod(e.target.value as ValuationMethod)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            >
                <option value={ValuationMethod.FIFO}>FIFO (First-In, First-Out)</option>
                <option value={ValuationMethod.LIFO}>LIFO (Last-In, First-Out)</option>
                <option value={ValuationMethod.AVERAGE}>Average (Rata-rata)</option>
            </select>
            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200">
                <Download size={20} />
            </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
            <tr>
              <th className="px-6 py-3">Produk</th>
              <th className="px-6 py-3 text-right">Qty Akhir</th>
              <th className="px-6 py-3 text-right">Nilai Satuan ({method})</th>
              <th className="px-6 py-3 text-right">Total Nilai</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {report.map((item) => (
              <tr key={item.productId} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3 font-medium text-slate-800">{item.productName}</td>
                <td className="px-6 py-3 text-right">{item.quantityOnHand}</td>
                <td className="px-6 py-3 text-right text-slate-600">
                    Rp {item.unitValue.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                </td>
                <td className="px-6 py-3 text-right font-semibold text-slate-800">
                    Rp {item.totalValue.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 font-semibold text-slate-800">
            <tr>
                <td colSpan={3} className="px-6 py-3 text-right">Total Aset Barang Jadi</td>
                <td className="px-6 py-3 text-right">Rp {totalValue.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default InventoryReport;