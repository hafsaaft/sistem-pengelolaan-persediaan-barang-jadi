import React, { useState } from 'react';
import { Product, Transaction, ValuationMethod } from '../types';
import { generateValuationReport } from '../services/inventoryLogic';
import { analyzeInventory } from '../services/geminiService';
import { Sparkles, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

interface AIAdvisorProps {
  products: Product[];
  transactions: Transaction[];
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ products, transactions }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use Average for general analysis context
      const report = generateValuationReport(products, transactions, ValuationMethod.AVERAGE);
      const result = await analyzeInventory(products, transactions, report);
      setAnalysis(result);
    } catch (err) {
      setError("Gagal menghubungi AI Assistant. Pastikan API Key valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-200">
                <Sparkles size={20} />
            </div>
            <div>
                <h2 className="text-lg font-bold text-indigo-900">AI Inventory Analyst</h2>
                <p className="text-xs text-indigo-600">Didukung oleh Gemini 2.5 Flash</p>
            </div>
        </div>
        <button 
          onClick={handleAnalyze}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md"
        >
          {loading ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
          {loading ? 'Menganalisis...' : 'Analisis Stok'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2 mb-4">
            <AlertCircle size={18} />
            {error}
        </div>
      )}

      {analysis && !loading && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-indigo-100">
            <h3 className="font-semibold text-indigo-900 mb-2">Ringkasan Eksekutif</h3>
            <p className="text-slate-700 text-sm leading-relaxed">{analysis.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-red-100">
                <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                    <AlertCircle size={16} /> Risiko & Isu
                </h3>
                <p className="text-slate-700 text-sm">{analysis.riskAssessment}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <RefreshCw size={16} /> Perputaran Stok
                </h3>
                <p className="text-slate-700 text-sm">{analysis.turnoverAnalysis}</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-emerald-100">
            <h3 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                <CheckCircle size={16} /> Rekomendasi Tindakan
            </h3>
            <ul className="space-y-2">
                {analysis.recommendations?.map((rec: string, idx: number) => (
                    <li key={idx} className="flex gap-2 text-sm text-slate-700">
                        <span className="text-emerald-500 font-bold">•</span>
                        {rec}
                    </li>
                ))}
            </ul>
          </div>
        </div>
      )}

      {!analysis && !loading && !error && (
        <div className="text-center py-8 text-indigo-300">
            <p>Klik "Analisis Stok" untuk mendapatkan insight cerdas tentang persediaan Anda.</p>
        </div>
      )}
    </div>
  );
};

export default AIAdvisor;