import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiSearch, HiPlus, HiPencil, HiTrash, 
  HiViewGrid, HiViewList, HiFilter, HiX, HiOutlineInbox
} from 'react-icons/hi';
import { useProducts } from '../hooks/useProducts';
import { useSuppliers } from '../hooks/useSuppliers';
import { useModal } from '../hooks/useModal';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Dropdown } from '../components/ui/Dropdown';
import { Modal } from '../components/ui/Modal';
import { Pagination } from '../components/ui/Pagination';
import { SearchBox } from '../components/ui/SearchBox';
import { EmptyState } from '../components/ui/EmptyState';
import { TableSkeleton } from '../components/ui/Skeleton';
import { containerVariants, cardVariants, tableRowVariants } from '../animations/variants';

export const Products = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { suppliers } = useSuppliers();

  // Modal Hooks
  const addModal = useModal();
  const editModal = useModal();
  const deleteModal = useModal();
  const detailsModal = useModal();

  // State
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [supplierFilter, setSupplierFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('name-asc'); // name-asc | price-asc | price-desc | qty-desc

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Form Fields State
  const [formFields, setFormFields] = useState({
    name: '', sku: '', category: 'Electronics', price: '', quantity: '', supplier: '', image: ''
  });

  // Simulated API loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Set default supplier when modals open
  useEffect(() => {
    if (suppliers.length > 0 && !formFields.supplier) {
      setFormFields(prev => ({ ...prev, supplier: suppliers[0].name }));
    }
  }, [suppliers, formFields.supplier]);

  // Extract unique categories for filter select options
  const categories = ['All', ...new Set(products.map(p => p.category))];
  const supplierNames = ['All', ...new Set(suppliers.map(s => s.name))];

  // Filters and Sorting Logic
  const filteredProducts = products
    .filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCategory = categoryFilter === 'All' || p.category === categoryFilter;
      const matchSupplier = supplierFilter === 'All' || p.supplier === supplierFilter;
      const matchStatus = statusFilter === 'All' || p.status === statusFilter;
      
      const priceNum = parseFloat(p.price);
      const matchMinPrice = !minPrice || priceNum >= parseFloat(minPrice);
      const matchMaxPrice = !maxPrice || priceNum <= parseFloat(maxPrice);

      return matchSearch && matchCategory && matchSupplier && matchStatus && matchMinPrice && matchMaxPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'qty-desc':
          return b.quantity - a.quantity;
        case 'name-asc':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, supplierFilter, statusFilter, minPrice, maxPrice, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Form Handling
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormFields(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const success = addProduct(formFields);
    if (success) {
      addModal.close();
      setFormFields({
        name: '', sku: '', category: 'Electronics', price: '', quantity: '', supplier: suppliers[0]?.name || '', image: ''
      });
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const success = updateProduct(editModal.data.id, formFields);
    if (success) {
      editModal.close();
    }
  };

  const openEditModal = (product) => {
    setFormFields({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      supplier: product.supplier,
      image: product.image
    });
    editModal.open(product);
  };

  const confirmDelete = () => {
    deleteProduct(deleteModal.data.id);
    deleteModal.close();
  };

  return (
    <PageWrapper>
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight font-sans">
            Product Catalog
          </h1>
          <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 mt-1">
            Displaying {filteredProducts.length} of {products.length} products.
          </p>
        </div>
        
        {/* Add Product Button */}
        <Button 
          variant="primary" 
          onClick={() => {
            setFormFields({
              name: '', 
              sku: `PROD-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`, 
              category: 'Electronics', 
              price: '', 
              quantity: '', 
              supplier: suppliers[0]?.name || '', 
              image: ''
            });
            addModal.open();
          }}
          icon={<HiPlus size={18} />}
        >
          Add Product
        </Button>
      </div>

      {/* Search, view switches, and filters toggle */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4 select-none">
        
        {/* Search */}
        <SearchBox 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name or SKU..."
          className="w-full max-w-md shadow-sm"
        />

        {/* Action Controls */}
        <div className="flex items-center space-x-2.5">
          {/* Advanced filters button */}
          <Button
            variant={showFilters ? "primary" : "outline"}
            size="md"
            onClick={() => setShowFilters(!showFilters)}
            className="flex-1 md:flex-none"
            icon={<HiFilter size={16} />}
          >
            Filters
          </Button>

          {/* Table / Grid view toggles */}
          <div className="hidden md:flex items-center border border-slate-200 dark:border-slate-800 rounded-xl p-1 bg-white dark:bg-slate-900/50">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition ${viewMode === 'table' ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
            >
              <HiViewList size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
            >
              <HiViewGrid size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Advanced filters drawer container */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <Card hoverable={false} className="bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/60 dark:border-slate-800/80">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Advanced Filters</h4>
                <button 
                  onClick={() => {
                    setCategoryFilter('All');
                    setSupplierFilter('All');
                    setStatusFilter('All');
                    setMinPrice('');
                    setMaxPrice('');
                    setSortBy('name-asc');
                  }}
                  className="text-xs font-bold text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Clear Filters
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                {/* Category */}
                <Dropdown
                  label="Category"
                  options={categories.map(cat => ({ value: cat, label: cat }))}
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                />
                
                {/* Supplier */}
                <Dropdown
                  label="Supplier"
                  options={supplierNames.map(sup => ({ value: sup, label: sup }))}
                  value={supplierFilter}
                  onChange={setSupplierFilter}
                />

                {/* Status */}
                <Dropdown
                  label="Status"
                  options={[
                    { value: 'All', label: 'All Statuses' },
                    { value: 'In Stock', label: 'In Stock' },
                    { value: 'Low Stock', label: 'Low Stock' },
                    { value: 'Out of Stock', label: 'Out of Stock' }
                  ]}
                  value={statusFilter}
                  onChange={setStatusFilter}
                />

                {/* Min Price */}
                <Input
                  label="Min Price"
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />

                {/* Max Price */}
                <Input
                  label="Max Price"
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />

                {/* Sorting */}
                <Dropdown
                  label="Sort By"
                  options={[
                    { value: 'name-asc', label: 'Name: A-Z' },
                    { value: 'price-asc', label: 'Price: Low to High' },
                    { value: 'price-desc', label: 'Price: High to Low' },
                    { value: 'qty-desc', label: 'Qty: High to Low' }
                  ]}
                  value={sortBy}
                  onChange={setSortBy}
                />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main product display area */}
      {loading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : paginatedProducts.length > 0 ? (
        <>
          {viewMode === 'table' ? (
            /* Table View */
            <div className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden select-none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/40 text-left border-b border-slate-100 dark:border-slate-800/60">
                      <th className="px-6 py-4.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-4.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">SKU</th>
                      <th className="px-6 py-4.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-4.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Stock Qty</th>
                      <th className="px-6 py-4.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4.5 text-xs font-bold text-slate-400 dark:text-slate-500 text-right uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {paginatedProducts.map((p) => (
                        <motion.tr
                          key={p.id}
                          variants={tableRowVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          whileHover={window.document.documentElement.classList.contains('dark') ? "hoverDark" : "hover"}
                          className="border-b border-slate-100 dark:border-slate-800 last:border-0"
                        >
                          <td className="px-6 py-4 cursor-pointer" onClick={() => detailsModal.open(p)}>
                            <div className="flex items-center space-x-3.5">
                              <img 
                                src={p.image} 
                                alt={p.name} 
                                className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-100 dark:ring-slate-800 shrink-0" 
                              />
                              <div className="overflow-hidden max-w-[180px]">
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{p.name}</h4>
                                <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-500 truncate block mt-0.5">{p.supplier}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 font-sans">{p.sku}</td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-350">{p.category}</td>
                          <td className="px-6 py-4 text-sm font-black text-slate-800 dark:text-slate-100">${p.price.toFixed(2)}</td>
                          <td className="px-6 py-4 text-sm font-extrabold text-slate-700 dark:text-slate-300">{p.quantity}</td>
                          <td className="px-6 py-4"><Badge>{p.status}</Badge></td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-1">
                              <button
                                onClick={() => openEditModal(p)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition"
                              >
                                <HiPencil size={16} />
                              </button>
                              <button
                                onClick={() => deleteModal.open(p)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition"
                              >
                                <HiTrash size={16} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          ) : (
            /* Grid View */
            <div className="space-y-6">
              <motion.div 
                variants={containerVariants}
                animate="animate"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {paginatedProducts.map((p) => (
                  <Card 
                    key={p.id} 
                    className="relative flex flex-col h-full group"
                    onClick={() => detailsModal.open(p)}
                  >
                    <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute top-3 right-3">
                        <Badge>{p.status}</Badge>
                      </div>
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-1 text-left">
                      <div className="flex items-start justify-between mb-1.5 overflow-hidden">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate flex-1 pr-2">{p.name}</h4>
                        <span className="text-sm font-black text-primary-500">${p.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">SKU: {p.sku}</span>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{p.category}</span>
                      </div>
                      
                      <div className="border-t border-slate-50 dark:border-slate-800/80 pt-3 flex justify-between items-center text-xs font-semibold text-slate-400 dark:text-slate-500">
                        <span>Supplier: <span className="text-slate-600 dark:text-slate-300">{p.supplier}</span></span>
                        <span>Stock: <span className="text-slate-700 dark:text-slate-200 font-extrabold">{p.quantity}</span></span>
                      </div>
                    </div>
                    
                    {/* Action buttons inside Card */}
                    <div className="border-t border-slate-50 dark:border-slate-800/80 mt-4 pt-3 flex items-center justify-end space-x-1.5" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded-lg text-slate-450 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
                      >
                        <HiPencil size={15} />
                      </button>
                      <button
                        onClick={() => deleteModal.open(p)}
                        className="p-1.5 rounded-lg text-slate-450 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
                      >
                        <HiTrash size={15} />
                      </button>
                    </div>
                  </Card>
                ))}
              </motion.div>
              
              {/* Pagination */}
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <EmptyState 
          title="No Products Match"
          description="We couldn't find any products matching your query. Adjust your search or clear some filters."
          actionText="Clear All Filters"
          onActionClick={() => {
            setSearchQuery('');
            setCategoryFilter('All');
            setSupplierFilter('All');
            setStatusFilter('All');
            setMinPrice('');
            setMaxPrice('');
            setSortBy('name-asc');
          }}
          iconType="box"
        />
      )}

      {/* --- ADD PRODUCT MODAL --- */}
      <Modal isOpen={addModal.isOpen} onClose={addModal.close} title="Add New Product">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input 
            label="Product Name" 
            name="name" 
            placeholder="e.g. Mechanical Keyboard" 
            value={formFields.name}
            onChange={handleFormChange}
            required 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="SKU" 
              name="sku" 
              value={formFields.sku}
              onChange={handleFormChange}
              required 
            />
            <Dropdown 
              label="Category" 
              options={[
                { value: 'Electronics', label: 'Electronics' },
                { value: 'Furniture', label: 'Furniture' },
                { value: 'Accessories', label: 'Accessories' },
                { value: 'Appliances', label: 'Appliances' }
              ]}
              value={formFields.category}
              onChange={(val) => setFormFields(prev => ({ ...prev, category: val }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Unit Price ($)" 
              name="price" 
              type="number" 
              step="0.01" 
              placeholder="e.g. 99.99"
              value={formFields.price}
              onChange={handleFormChange}
              required 
            />
            <Input 
              label="Initial Quantity" 
              name="quantity" 
              type="number" 
              placeholder="e.g. 50"
              value={formFields.quantity}
              onChange={handleFormChange}
              required 
            />
          </div>
          <Dropdown 
            label="Preferred Supplier" 
            options={suppliers.map(s => ({ value: s.name, label: s.name }))}
            value={formFields.supplier}
            onChange={(val) => setFormFields(prev => ({ ...prev, supplier: val }))}
          />
          <Input 
            label="Product Image URL (Optional)" 
            name="image" 
            placeholder="https://example.com/image.jpg"
            value={formFields.image}
            onChange={handleFormChange}
          />
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={addModal.close}>Cancel</Button>
            <Button variant="primary" type="submit">Create Product</Button>
          </div>
        </form>
      </Modal>

      {/* --- EDIT PRODUCT MODAL --- */}
      <Modal isOpen={editModal.isOpen} onClose={editModal.close} title="Edit Product">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input 
            label="Product Name" 
            name="name" 
            value={formFields.name}
            onChange={handleFormChange}
            required 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="SKU" 
              name="sku" 
              value={formFields.sku}
              onChange={handleFormChange}
              required 
            />
            <Dropdown 
              label="Category" 
              options={[
                { value: 'Electronics', label: 'Electronics' },
                { value: 'Furniture', label: 'Furniture' },
                { value: 'Accessories', label: 'Accessories' },
                { value: 'Appliances', label: 'Appliances' }
              ]}
              value={formFields.category}
              onChange={(val) => setFormFields(prev => ({ ...prev, category: val }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Unit Price ($)" 
              name="price" 
              type="number" 
              step="0.01" 
              value={formFields.price}
              onChange={handleFormChange}
              required 
            />
            <Input 
              label="Stock Quantity" 
              name="quantity" 
              type="number" 
              value={formFields.quantity}
              onChange={handleFormChange}
              required 
            />
          </div>
          <Dropdown 
            label="Preferred Supplier" 
            options={suppliers.map(s => ({ value: s.name, label: s.name }))}
            value={formFields.supplier}
            onChange={(val) => setFormFields(prev => ({ ...prev, supplier: val }))}
          />
          <Input 
            label="Product Image URL" 
            name="image" 
            value={formFields.image}
            onChange={handleFormChange}
          />
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={editModal.close}>Cancel</Button>
            <Button variant="primary" type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.close} title="Confirm Deletion">
        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Are you sure you want to delete <span className="text-slate-800 dark:text-slate-200 font-bold">{deleteModal.data?.name}</span>? This action is permanent and cannot be undone.
          </p>
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={deleteModal.close}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete Product</Button>
          </div>
        </div>
      </Modal>

      {/* --- PRODUCT DETAILS DRAWER MODAL --- */}
      <Modal isOpen={detailsModal.isOpen} onClose={detailsModal.close} title="Product Profile">
        {detailsModal.data && (
          <div className="space-y-6">
            <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-850">
              <img src={detailsModal.data.image} alt={detailsModal.data.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4">
                <Badge>{detailsModal.data.status}</Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Product Name</h4>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{detailsModal.data.name}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">SKU</h4>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 font-sans">{detailsModal.data.sku}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Category</h4>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-350">{detailsModal.data.category}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Stock Level</h4>
                <p className="text-sm font-extrabold text-slate-700 dark:text-slate-300">{detailsModal.data.quantity} units</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Unit Value</h4>
                <p className="text-sm font-black text-slate-800 dark:text-slate-100">${detailsModal.data.price.toFixed(2)}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Total Stock Value</h4>
                <p className="text-sm font-black text-primary-500">${(detailsModal.data.price * detailsModal.data.quantity).toFixed(2)}</p>
              </div>
            </div>

            <div className="text-left border-t border-slate-100 dark:border-slate-800/80 pt-5">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Supplier Profile</h4>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{detailsModal.data.supplier}</p>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="secondary" onClick={detailsModal.close}>Close Details</Button>
            </div>
          </div>
        )}
      </Modal>

    </PageWrapper>
  );
};
export default Products;
