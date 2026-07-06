import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { SupplierProvider } from './contexts/SupplierContext';
import { InventoryProvider } from './contexts/InventoryContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ProductProvider>
            <SupplierProvider>
              <InventoryProvider>
                
                {/* Router Routes */}
                <AppRoutes />

                {/* Toast Dispatcher */}
                <Toaster 
                  position="top-right" 
                  toastOptions={{
                    className: 'go3958317564', // triggers matching styles in index.css
                    duration: 3500,
                  }} 
                />

              </InventoryProvider>
            </SupplierProvider>
          </ProductProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
