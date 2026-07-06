import React, { createContext, useState, useEffect, useContext } from 'react';
import { initialInventoryLogs } from '../data/inventory';
import { ProductContext } from './ProductContext';
import toast from 'react-hot-toast';

export const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const { products, updateProduct } = useContext(ProductContext);
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('inventory_logs');
    return saved ? JSON.parse(saved) : initialInventoryLogs;
  });

  useEffect(() => {
    localStorage.setItem('inventory_logs', JSON.stringify(logs));
  }, [logs]);

  const adjustStock = (productId, type, amount, updatedBy = 'Admin User') => {
    const product = products.find(p => p.id === productId);
    if (!product) {
      toast.error('Product not found.');
      return false;
    }

    const qtyAmount = parseInt(amount, 10);
    if (isNaN(qtyAmount) || qtyAmount <= 0) {
      toast.error('Please enter a valid positive quantity.');
      return false;
    }

    const previousQuantity = product.quantity;
    let newQuantity = previousQuantity;

    if (type === 'Stock In') {
      newQuantity = previousQuantity + qtyAmount;
    } else if (type === 'Stock Out') {
      if (previousQuantity < qtyAmount) {
        toast.error(`Insufficient stock! Only ${previousQuantity} available.`);
        return false;
      }
      newQuantity = previousQuantity - qtyAmount;
    } else {
      toast.error('Invalid movement type.');
      return false;
    }

    // Update product quantity (which updates its status automatically in ProductContext)
    const updated = updateProduct(productId, { quantity: newQuantity });
    if (!updated) return false;

    // Create log entry
    const newLog = {
      id: `log-${Date.now()}`,
      productId,
      productName: product.name,
      type, // 'Stock In' | 'Stock Out'
      previousQuantity,
      newQuantity,
      date: new Date().toISOString(),
      updatedBy
    };

    setLogs(prev => [newLog, ...prev]);
    toast.success(`Stock ${type === 'Stock In' ? 'increased' : 'decreased'} by ${qtyAmount}`);
    return true;
  };

  const resetLogs = () => {
    setLogs(initialInventoryLogs);
    toast.success('Logs reset to demo data');
  };

  return (
    <InventoryContext.Provider value={{ logs, adjustStock, resetLogs }}>
      {children}
    </InventoryContext.Provider>
  );
};
