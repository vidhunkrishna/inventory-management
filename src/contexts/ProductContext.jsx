import React, { createContext, useState, useEffect } from 'react';
import { initialProducts } from '../data/products';
import toast from 'react-hot-toast';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('inventory_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  useEffect(() => {
    localStorage.setItem('inventory_products', JSON.stringify(products));
  }, [products]);

  const getStatus = (quantity) => {
    if (quantity <= 0) return 'Out of Stock';
    if (quantity <= 10) return 'Low Stock';
    return 'In Stock';
  };

  const addProduct = (product) => {
    // SKU check
    if (products.some(p => p.sku.toLowerCase() === product.sku.toLowerCase())) {
      toast.error(`Product SKU ${product.sku} already exists.`);
      return false;
    }

    const newProduct = {
      ...product,
      id: `prod-${Date.now()}`,
      price: parseFloat(product.price),
      quantity: parseInt(product.quantity, 10),
      status: getStatus(parseInt(product.quantity, 10)),
      image: product.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60' // fallback placeholder
    };

    setProducts(prev => [newProduct, ...prev]);
    toast.success('Product added successfully!');
    return true;
  };

  const updateProduct = (id, updatedFields) => {
    // If SKU changed, check if new SKU is already taken
    if (updatedFields.sku) {
      const duplicate = products.find(p => p.id !== id && p.sku.toLowerCase() === updatedFields.sku.toLowerCase());
      if (duplicate) {
        toast.error(`Product SKU ${updatedFields.sku} already taken by another product.`);
        return false;
      }
    }

    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const qty = updatedFields.quantity !== undefined ? parseInt(updatedFields.quantity, 10) : p.quantity;
        return {
          ...p,
          ...updatedFields,
          price: updatedFields.price !== undefined ? parseFloat(updatedFields.price) : p.price,
          quantity: qty,
          status: getStatus(qty)
        };
      }
      return p;
    }));

    toast.success('Product updated successfully!');
    return true;
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.success('Product deleted successfully');
  };

  const resetProducts = () => {
    setProducts(initialProducts);
    toast.success('Products reset to demo data');
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, resetProducts, getStatus }}>
      {children}
    </ProductContext.Provider>
  );
};
