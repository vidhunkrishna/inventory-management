import React, { createContext, useState, useEffect } from 'react';
import { initialSuppliers } from '../data/suppliers';
import toast from 'react-hot-toast';

export const SupplierContext = createContext();

export const SupplierProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState(() => {
    const saved = localStorage.getItem('inventory_suppliers');
    return saved ? JSON.parse(saved) : initialSuppliers;
  });

  useEffect(() => {
    localStorage.setItem('inventory_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  const addSupplier = (supplier) => {
    const newSupplier = {
      ...supplier,
      id: `sup-${Date.now()}`,
      productsSupplied: supplier.productsSupplied || [],
      status: supplier.status || 'Active'
    };

    setSuppliers(prev => [newSupplier, ...prev]);
    toast.success('Supplier added successfully!');
    return true;
  };

  const updateSupplier = (id, updatedFields) => {
    setSuppliers(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          ...updatedFields
        };
      }
      return s;
    }));

    toast.success('Supplier updated successfully!');
    return true;
  };

  const deleteSupplier = (id) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
    toast.success('Supplier deleted successfully');
  };

  const resetSuppliers = () => {
    setSuppliers(initialSuppliers);
    toast.success('Suppliers reset to demo data');
  };

  return (
    <SupplierContext.Provider value={{ suppliers, addSupplier, updateSupplier, deleteSupplier, resetSuppliers }}>
      {children}
    </SupplierContext.Provider>
  );
};
