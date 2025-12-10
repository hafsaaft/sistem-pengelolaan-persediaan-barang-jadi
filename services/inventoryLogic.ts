import { Product, Transaction, TransactionType, ValuationMethod, ValuationResult } from '../types';

interface Batch {
  quantity: number;
  cost: number;
  date: string;
}

// Calculate Weighted Average Cost
export const calculateAverage = (transactions: Transaction[]): { quantity: number; value: number } => {
  let totalQty = 0;
  let totalValue = 0;

  // Sort by date to simulate running average
  const sortedTx = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  for (const tx of sortedTx) {
    if (tx.type === TransactionType.IN) {
      totalValue += tx.quantity * tx.pricePerUnit;
      totalQty += tx.quantity;
    } else {
      if (totalQty > 0) {
        const avgCost = totalValue / totalQty;
        totalValue -= tx.quantity * avgCost;
        totalQty -= tx.quantity;
      }
    }
  }

  return { quantity: Math.max(0, totalQty), value: Math.max(0, totalValue) };
};

// Calculate FIFO
export const calculateFIFO = (transactions: Transaction[]): { quantity: number; value: number } => {
  const batches: Batch[] = [];
  const sortedTx = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  for (const tx of sortedTx) {
    if (tx.type === TransactionType.IN) {
      batches.push({ quantity: tx.quantity, cost: tx.pricePerUnit, date: tx.date });
    } else {
      let qtyToRemove = tx.quantity;
      while (qtyToRemove > 0 && batches.length > 0) {
        const currentBatch = batches[0]; // Take from front (First In)
        if (currentBatch.quantity > qtyToRemove) {
          currentBatch.quantity -= qtyToRemove;
          qtyToRemove = 0;
        } else {
          qtyToRemove -= currentBatch.quantity;
          batches.shift(); // Remove empty batch
        }
      }
    }
  }

  const totalValue = batches.reduce((sum, b) => sum + (b.quantity * b.cost), 0);
  const totalQty = batches.reduce((sum, b) => sum + b.quantity, 0);

  return { quantity: totalQty, value: totalValue };
};

// Calculate LIFO
export const calculateLIFO = (transactions: Transaction[]): { quantity: number; value: number } => {
  const batches: Batch[] = [];
  const sortedTx = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  for (const tx of sortedTx) {
    if (tx.type === TransactionType.IN) {
      batches.push({ quantity: tx.quantity, cost: tx.pricePerUnit, date: tx.date });
    } else {
      let qtyToRemove = tx.quantity;
      while (qtyToRemove > 0 && batches.length > 0) {
        const currentBatch = batches[batches.length - 1]; // Take from back (Last In)
        if (currentBatch.quantity > qtyToRemove) {
          currentBatch.quantity -= qtyToRemove;
          qtyToRemove = 0;
        } else {
          qtyToRemove -= currentBatch.quantity;
          batches.pop(); // Remove empty batch
        }
      }
    }
  }

  const totalValue = batches.reduce((sum, b) => sum + (b.quantity * b.cost), 0);
  const totalQty = batches.reduce((sum, b) => sum + b.quantity, 0);

  return { quantity: totalQty, value: totalValue };
};

export const generateValuationReport = (
  products: Product[],
  transactions: Transaction[],
  method: ValuationMethod
): ValuationResult[] => {
  return products.map((product) => {
    const productTx = transactions.filter((t) => t.productId === product.id);
    let result = { quantity: 0, value: 0 };

    switch (method) {
      case ValuationMethod.FIFO:
        result = calculateFIFO(productTx);
        break;
      case ValuationMethod.LIFO:
        result = calculateLIFO(productTx);
        break;
      case ValuationMethod.AVERAGE:
        result = calculateAverage(productTx);
        break;
    }

    return {
      productId: product.id,
      productName: product.name,
      quantityOnHand: result.quantity,
      totalValue: result.value,
      unitValue: result.quantity > 0 ? result.value / result.quantity : 0,
      method: method,
    };
  });
};