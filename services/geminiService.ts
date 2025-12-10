import { GoogleGenAI, Type } from "@google/genai";
import { Product, Transaction, ValuationResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeInventory = async (
  products: Product[],
  transactions: Transaction[],
  valuationReport: ValuationResult[]
): Promise<any> => {
  
  if (!apiKey) {
      throw new Error("API Key missing");
  }

  // Prepare a summarized context to avoid token limits if data is huge (simplified for this demo)
  const context = {
    products: products.map(p => ({ name: p.name, minStock: p.minStock })),
    valuationSummary: valuationReport.map(v => ({
      product: v.productName,
      qty: v.quantityOnHand,
      totalValue: v.totalValue,
      method: v.method
    })),
    recentTransactionsCount: transactions.length,
    date: new Date().toISOString()
  };

  const prompt = `
    Anda adalah analis Supply Chain senior. Analisis data persediaan berikut dalam format JSON.
    Data: ${JSON.stringify(context)}

    Tugas:
    1. Berikan ringkasan kondisi stok.
    2. Identifikasi potensi Dead Stock (barang tidak bergerak) atau Overstock.
    3. Identifikasi risiko Stockout (barang hampir habis di bawah minStock).
    4. Berikan rekomendasi spesifik untuk efisiensi.

    Output dalam bahasa Indonesia.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            turnoverAnalysis: { type: Type.STRING },
            riskAssessment: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};