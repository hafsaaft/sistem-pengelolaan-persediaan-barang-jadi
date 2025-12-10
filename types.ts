export enum TransactionType {
  IN = 'MASUK', // Production Result
  OUT = 'KELUAR', // Sales/Shipment
}

export enum ValuationMethod {
  FIFO = 'FIFO',
  LIFO = 'LIFO',
  AVERAGE = 'AVERAGE',
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  minStock: number;
  category: string;
}

export interface Transaction {
  id: string;
  productId: string;
  date: string; // ISO String
  type: TransactionType;
  quantity: number;
  pricePerUnit: number; // Cost for IN, Selling Price for OUT (optional, usually cost is tracked)
  reference: string; // Batch ID or Order ID
}

export interface ValuationResult {
  productId: string;
  productName: string;
  quantityOnHand: number;
  totalValue: number;
  unitValue: number;
  method: ValuationMethod;
}

export interface AIAnalysisResult {
  summary: string;
  turnoverAnalysis: string;
  recommendations: string[];
  riskAssessment: string;
}