import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiSearch, HiPlus, HiPencil, HiTrash, 
  HiChevronRight, HiMail, HiPhone, HiLocationMarker, HiX
} from 'react-icons/hi';
import { useSuppliers } from '../hooks/useSuppliers';
import { useProducts } from '../hooks/useProducts';
import { useModal } from '../hooks/useModal';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Dropdown } from '../components/ui/Dropdown';
import { Modal } from '../components/ui/Modal';
import { SearchBox } from '../components/ui/SearchBox';
import { EmptyState } from '../components/ui/EmptyState';
import { TableSkeleton } from '../components/ui/Skeleton';
import { drawerVariants, tableRowVariants } from '../animations/variants';

export const Suppliers = () => {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useSuppliers();
  const { products } = useProducts();

  // Modals hooks
  const addModal = useModal();
  const editModal = useModal();
  const deleteModal = useModal();
  const drawer = useModal(); // Supplier Drawer

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [formFields, setFormFields] = useState({
    name: '', email: '', phone: '', address: '', status: 'Active'
  });

  // Simulated API Loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Filter suppliers by name, email or phone
  const filteredSuppliers = suppliers.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.phone.includes(searchQuery);
    return matchSearch;
  });

  // Form submit handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormFields(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const success = addSupplier(formFields);
    if (success) {
      addModal.close();
      setFormFields({ name: '', email: '', phone: '', address: '', status: 'Active' });
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const success = updateSupplier(editModal.data.id, formFields);
    if (success) {
      editModal.close();
      // If the drawer is open for this supplier, update its data too
      if (drawer.isOpen && drawer.data.id === editModal.data.id) {
        drawer.open({ ...drawer.data, ...formFields });
      }
    }
  };

  const openEditModal = (supplier) => {
    setFormFields({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      status: supplier.status
    });
    editModal.open(supplier);
  };

  const confirmDelete = () => {
    deleteSupplier(deleteModal.data.id);
    deleteModal.close();
    if (drawer.isOpen && drawer.data.id === deleteModal.data.id) {
      drawer.close();
    }
  };

  // Find products supplied by this supplier
  const getSuppliedProducts = (supplierName) => {
    return products.filter(p => p.supplier.toLowerCase() === supplierName.toLowerCase());
  };

  return (
    <PageWrapper className="relative">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight font-sans">
            Suppliers Roster
          </h1>
          <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 mt-1">
            Displaying {filteredSuppliers.length} of {suppliers.length} active partnerships.
          </p>
        </div>
        
        <Button 
          variant="primary" 
          onClick={() => {
            setFormFields({ name: '', email: '', phone: '', address: '', status: 'Active' });
            addModal.open();
          }}
          icon={<HiPlus size={18} />}
        >
          Add Supplier
        </Button>
      </div>

      {/* Searchbar */}
      <div className="mb-6 select-none">
        <SearchBox 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search suppliers by name, email, or phone..."
          className="w-full max-w-md shadow-sm"
        />
      </div>

      {/* Suppliers Table display */}
      {loading ? (
        <TableSkeleton rows={4} cols={5} />
      ) : filteredSuppliers.length > 0 ? (
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden select-none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/40 text-left border-b border-slate-100 dark:border-slate-800/60">
                  <th className="px-6 py-4.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Supplier Name</th>
                  <th className="px-6 py-4.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Email Address</th>
                  <th className="px-6 py-4.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Supplied Items</th>
                  <th className="px-6 py-4.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4.5 text-xs font-bold text-slate-400 dark:text-slate-500 text-right uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredSuppliers.map((s) => {
                    const suppliedCount = getSuppliedProducts(s.name).length;
                    return (
                      <motion.tr
                        key={s.id}
                        variants={tableRowVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        whileHover={window.document.documentElement.classList.contains('dark') ? "hoverDark" : "hover"}
                        className="border-b border-slate-100 dark:border-slate-800 last:border-0 cursor-pointer"
                        onClick={() => drawer.open(s)}
                      >
                        <td className="px-6 py-4">
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{s.name}</h4>
                          <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-550 truncate max-w-[200px] block mt-0.5">{s.address}</span>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400">{s.email}</td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-450 font-sans">{s.phone}</td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">
                            {suppliedCount} products
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={s.status === 'Active' ? 'green' : 'red'}>{s.status}</Badge>
                        </td>
                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => openEditModal(s)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition"
                            >
                              <HiPencil size={16} />
                            </button>
                            <button
                              onClick={() => deleteModal.open(s)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition"
                            >
                              <HiTrash size={16} />
                            </button>
                            <button
                              onClick={() => drawer.open(s)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition"
                            >
                              <HiChevronRight size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty view */
        <EmptyState 
          title="No Suppliers Found"
          description="We couldn't match any supplier to your search parameter. Adjust query or register a new partner."
          actionText="Clear Search"
          onActionClick={() => setSearchQuery('')}
          iconType="suppliers"
        />
      )}

      {/* --- DETAILS SIDE DRAWER --- */}
      <AnimatePresence>
        {drawer.isOpen && drawer.data && (
          <>
            {/* Drawer Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={drawer.close}
              className="fixed inset-0 bg-slate-900 z-40"
            />
            
            {/* Slide-out Drawer content */}
            <motion.div
              variants={drawerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="
                fixed top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 
                border-l border-slate-100 dark:border-slate-800 shadow-2xl z-50 overflow-hidden flex flex-col select-none
              "
            >
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-150">Supplier Profile</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">ID: {drawer.data.id}</p>
                </div>
                <button
                  onClick={drawer.close}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  <HiX size={18} />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Details Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{drawer.data.name}</h2>
                    <Badge variant={drawer.data.status === 'Active' ? 'green' : 'red'}>{drawer.data.status}</Badge>
                  </div>

                  <div className="space-y-3 pt-2 text-left">
                    <div className="flex items-start text-xs font-semibold text-slate-600 dark:text-slate-400">
                      <HiMail size={16} className="text-slate-400 mr-3 mt-0.5" />
                      <div>
                        <span className="block font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Email</span>
                        <a href={`mailto:${drawer.data.email}`} className="text-primary-500 hover:underline">{drawer.data.email}</a>
                      </div>
                    </div>
                    
                    <div className="flex items-start text-xs font-semibold text-slate-600 dark:text-slate-400">
                      <HiPhone size={16} className="text-slate-400 mr-3 mt-0.5" />
                      <div>
                        <span className="block font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Phone</span>
                        <span className="font-sans">{drawer.data.phone}</span>
                      </div>
                    </div>

                    <div className="flex items-start text-xs font-semibold text-slate-650 dark:text-slate-400">
                      <HiLocationMarker size={16} className="text-slate-400 mr-3 mt-0.5" />
                      <div>
                        <span className="block font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">HQ Address</span>
                        <span className="leading-relaxed">{drawer.data.address}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Supplied Products List */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-5 text-left">
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
                    Supplied Products ({getSuppliedProducts(drawer.data.name).length})
                  </h4>
                  
                  <div className="space-y-3.5">
                    {getSuppliedProducts(drawer.data.name).length > 0 ? (
                      getSuppliedProducts(drawer.data.name).map(p => (
                        <div 
                          key={p.id}
                          className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80"
                        >
                          <div className="flex items-center space-x-3 overflow-hidden">
                            <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover" />
                            <div className="overflow-hidden">
                              <h5 className="text-xs font-bold text-slate-850 dark:text-slate-200 truncate">{p.name}</h5>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">SKU: {p.sku}</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs font-black text-slate-800 dark:text-slate-200">${p.price.toFixed(2)}</div>
                            <span className="text-[10px] font-semibold text-slate-450">{p.quantity} units</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                        <HiOutlineInbox className="w-8 h-8 text-slate-400 mb-1" />
                        <p className="text-xs font-semibold text-slate-400">No products linked to this supplier.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Drawer Footer Actions */}
              <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40 grid grid-cols-2 gap-3.5">
                <Button variant="secondary" onClick={() => openEditModal(drawer.data)}>
                  Edit Partner
                </Button>
                <Button variant="outline" onClick={drawer.close}>
                  Close Drawer
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- ADD SUPPLIER MODAL --- */}
      <Modal isOpen={addModal.isOpen} onClose={addModal.close} title="Add New Supplier">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input 
            label="Supplier Name" 
            name="name" 
            placeholder="e.g. Acme Industries" 
            value={formFields.name}
            onChange={handleFormChange}
            required 
          />
          <Input 
            label="Email Address" 
            name="email" 
            type="email"
            placeholder="contact@acme.com" 
            value={formFields.email}
            onChange={handleFormChange}
            required 
          />
          <Input 
            label="Phone Number" 
            name="phone" 
            placeholder="e.g. +1 (555) 123-4567" 
            value={formFields.phone}
            onChange={handleFormChange}
            required 
          />
          <Input 
            label="HQ Address" 
            name="address" 
            placeholder="Street address, City, ZIP" 
            value={formFields.address}
            onChange={handleFormChange}
            required 
          />
          <Dropdown
            label="Status"
            options={[
              { value: 'Active', label: 'Active Partner' },
              { value: 'Inactive', label: 'Inactive / Suspended' }
            ]}
            value={formFields.status}
            onChange={(val) => setFormFields(prev => ({ ...prev, status: val }))}
          />
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={addModal.close}>Cancel</Button>
            <Button variant="primary" type="submit">Create Supplier</Button>
          </div>
        </form>
      </Modal>

      {/* --- EDIT SUPPLIER MODAL --- */}
      <Modal isOpen={editModal.isOpen} onClose={editModal.close} title="Edit Supplier">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input 
            label="Supplier Name" 
            name="name" 
            value={formFields.name}
            onChange={handleFormChange}
            required 
          />
          <Input 
            label="Email Address" 
            name="email" 
            type="email"
            value={formFields.email}
            onChange={handleFormChange}
            required 
          />
          <Input 
            label="Phone Number" 
            name="phone" 
            value={formFields.phone}
            onChange={handleFormChange}
            required 
          />
          <Input 
            label="HQ Address" 
            name="address" 
            value={formFields.address}
            onChange={handleFormChange}
            required 
          />
          <Dropdown
            label="Status"
            options={[
              { value: 'Active', label: 'Active Partner' },
              { value: 'Inactive', label: 'Inactive / Suspended' }
            ]}
            value={formFields.status}
            onChange={(val) => setFormFields(prev => ({ ...prev, status: val }))}
          />
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={editModal.close}>Cancel</Button>
            <Button variant="primary" type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* --- DELETE SUPPLIER MODAL --- */}
      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.close} title="Confirm Deletion">
        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Are you sure you want to delete supplier <span className="text-slate-800 dark:text-slate-200 font-bold">{deleteModal.data?.name}</span>? Doing so will dissociate them from their products, but products will remain in your catalog.
          </p>
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={deleteModal.close}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete Supplier</Button>
          </div>
        </div>
      </Modal>

    </PageWrapper>
  );
};
export default Suppliers;
