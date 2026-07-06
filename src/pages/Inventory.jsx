import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiPlusCircle, HiMinusCircle, HiClock, 
  HiArrowSmDown, HiArrowSmUp, HiUser
} from 'react-icons/hi';
import { useInventory } from '../hooks/useInventory';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../hooks/useAuth';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Dropdown } from '../components/ui/Dropdown';
import { EmptyState } from '../components/ui/EmptyState';
import { SearchBox } from '../components/ui/SearchBox';
import { TableSkeleton } from '../components/ui/Skeleton';
import { tableRowVariants, containerVariants, cardVariants } from '../animations/variants';

export const Inventory = () => {
  const { logs, adjustStock } = useInventory();
  const { products } = useProducts();
  const { user } = useAuth();
  const location = useLocation();

  // State
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [amount, setAmount] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Simulate API loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Pre-fill selected product if passed via navigation state (e.g. from low stock check widget)
  useEffect(() => {
    if (location.state && location.state.selectProduct) {
      setSelectedProductId(location.state.selectProduct);
    } else if (products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
    }
  }, [location.state, products, selectedProductId]);

  const handleStockAdjust = (type) => {
    if (!selectedProductId) return;
    const success = adjustStock(
      selectedProductId,
      type, // 'Stock In' | 'Stock Out'
      amount,
      user?.name || 'Admin User'
    );
    if (success) {
      setAmount('');
    }
  };

  // Filter logs by product name
  const filteredLogs = logs.filter(log => 
    log.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight font-sans">
          Stock Adjustments
        </h1>
        <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 mt-1">
          Adjust product stock levels manually and track ledger logs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 select-none">
        
        {/* Left Side: Manual Stock Adjust Form (1/3 width) */}
        <div className="space-y-6">
          <Card hoverable={false} className="border-primary-100 dark:border-primary-950/40 relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-bl-full pointer-events-none" />
            <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 mb-5 flex items-center space-x-2">
              <span className="w-1.5 h-6 rounded bg-primary-500" />
              <span>Modify Qty</span>
            </h3>

            <div className="space-y-5">
              {/* Product selector */}
              <Dropdown
                label="Select Product"
                options={products.map(p => ({ value: p.id, label: `${p.name} (Stock: ${p.quantity})` }))}
                value={selectedProductId}
                onChange={setSelectedProductId}
              />

              {/* Adjust Qty */}
              <Input
                label="Adjustment Qty"
                type="number"
                placeholder="Enter positive integer"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
              />

              {/* Actions Grid */}
              <div className="grid grid-cols-2 gap-3.5 pt-2">
                <Button
                  variant="primary"
                  onClick={() => handleStockAdjust('Stock In')}
                  icon={<HiPlusCircle size={18} />}
                  className="bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-400 shadow-emerald-500/10"
                >
                  Stock In
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleStockAdjust('Stock Out')}
                  icon={<HiMinusCircle size={18} />}
                  className="bg-rose-500 hover:bg-rose-600 focus:ring-rose-400 shadow-rose-500/10"
                >
                  Stock Out
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Quick Stats Summary Card */}
          <Card hoverable={false} className="bg-slate-50/50 dark:bg-slate-900/30">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">Quick Inventory Summary</h4>
            <div className="space-y-2.5 text-xs font-semibold text-slate-650 dark:text-slate-400">
              <div className="flex justify-between">
                <span>In Stock Items:</span>
                <span className="text-slate-800 dark:text-slate-200">{products.filter(p => p.quantity > 10).length}</span>
              </div>
              <div className="flex justify-between">
                <span>Low Stock Items:</span>
                <span className="text-amber-500">{products.filter(p => p.quantity > 0 && p.quantity <= 10).length}</span>
              </div>
              <div className="flex justify-between">
                <span>Out of Stock Items:</span>
                <span className="text-rose-500">{products.filter(p => p.quantity === 0).length}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Ledger history & vertical timeline (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <Card hoverable={false}>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
              <div>
                <h3 className="text-base font-bold text-slate-850 dark:text-slate-100">Movement Ledger</h3>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">ledger of all manual stock changes</p>
              </div>
              
              {/* Search filter for logs */}
              <SearchBox 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Filter logs by product..."
                className="w-full max-w-xs shadow-xs"
              />
            </div>

            {loading ? (
              <TableSkeleton rows={4} cols={5} />
            ) : filteredLogs.length > 0 ? (
              <div className="space-y-6">
                
                {/* --- VERTICAL TIMELINE --- */}
                <div className="relative pl-6 border-l-2 border-slate-100 dark:border-slate-800/80 space-y-8 py-2 text-left">
                  <AnimatePresence>
                    {filteredLogs.map((log) => {
                      const isStockIn = log.type === 'Stock In';
                      const delta = Math.abs(log.newQuantity - log.previousQuantity);
                      
                      return (
                        <motion.div
                          key={log.id}
                          variants={cardVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          className="relative flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-xs transition hover:shadow-md"
                        >
                          {/* Timeline dot */}
                          <div className={`
                            absolute -left-[33px] top-[26px] w-4.5 h-4.5 rounded-full border-4 border-white dark:border-slate-950 flex items-center justify-center
                            ${isStockIn ? 'bg-emerald-500' : 'bg-rose-500'}
                          `}>
                            {isStockIn ? <HiArrowSmUp className="text-white w-2.5 h-2.5" /> : <HiArrowSmDown className="text-white w-2.5 h-2.5" />}
                          </div>

                          {/* Log description */}
                          <div className="flex items-center space-x-3.5 overflow-hidden">
                            <div className="overflow-hidden">
                              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{log.productName}</h4>
                              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
                                <HiUser size={14} className="shrink-0" />
                                <span>{log.updatedBy}</span>
                                <span>•</span>
                                <HiClock size={14} className="shrink-0" />
                                <span>{new Date(log.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                              </div>
                            </div>
                          </div>

                          {/* Delta quantity indicators */}
                          <div className="mt-4 sm:mt-0 text-left sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-slate-50 dark:border-slate-800 pt-3 sm:pt-0">
                            <div className="flex items-center space-x-1.5">
                              <span className={`text-xs font-black ${isStockIn ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                {isStockIn ? '+' : '-'}{delta}
                              </span>
                              <span className="text-slate-400 dark:text-slate-550 text-xs">units</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mt-0.5">
                              New Level: {log.newQuantity}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <EmptyState
                title="No Ledger Entry"
                description="We couldn't locate any stock movement logs for this search query."
                actionText="Clear Filter"
                onActionClick={() => setSearchQuery('')}
                iconType="inventory"
              />
            )}
          </Card>
        </div>

      </div>
    </PageWrapper>
  );
};
export default Inventory;
