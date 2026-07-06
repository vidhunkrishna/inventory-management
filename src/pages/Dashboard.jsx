import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, 
  BarChart, Bar, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  HiCube, 
  HiUserGroup, 
  HiClipboardList, 
  HiExclamationCircle, 
  HiArrowSmRight,
  HiChevronRight
} from 'react-icons/hi';
import { useProducts } from '../hooks/useProducts';
import { useSuppliers } from '../hooks/useSuppliers';
import { useInventory } from '../hooks/useInventory';
import { useTheme } from '../hooks/useTheme';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { CountUp } from '../components/ui/CountUp';
import { CardSkeleton, ChartSkeleton } from '../components/ui/Skeleton';
import { inventoryTrendData, categoryDistributionData, supplierPerformanceData } from '../data/dashboard';

export const Dashboard = () => {
  const { products } = useProducts();
  const { suppliers } = useSuppliers();
  const { logs } = useInventory();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  // Simulate dashboard load API request
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Compute live statistics based on context data
  const totalProducts = products.length;
  const totalSuppliers = suppliers.length;
  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
  const lowStockAlerts = products.filter(p => p.quantity > 0 && p.quantity <= 10).length;

  // Custom data computations for charts
  const getCategoryChartData = () => {
    const counts = {};
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    const colors = ['#38bdf8', '#fbbf24', '#34d399', '#f472b6', '#a78bfa'];
    return Object.keys(counts).map((cat, idx) => ({
      name: cat,
      value: counts[cat],
      color: colors[idx % colors.length]
    }));
  };

  const getLowStockChartData = () => {
    return products
      .filter(p => p.quantity <= 10)
      .slice(0, 5)
      .map(p => ({
        name: p.name.length > 15 ? `${p.name.substring(0, 12)}...` : p.name,
        quantity: p.quantity
      }));
  };

  const categoryData = getCategoryChartData();
  const lowStockBarData = getLowStockChartData();

  if (loading) {
    return (
      <PageWrapper>
        <CardSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </PageWrapper>
    );
  }

  // Live activity logs list (first 5 logs)
  const recentLogs = logs.slice(0, 5);

  // Low stock products list (first 5 low stock products)
  const lowStockProducts = products.filter(p => p.quantity <= 10).slice(0, 5);

  const stats = [
    {
      name: 'Total Products',
      value: totalProducts,
      icon: HiCube,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30',
      glow: true
    },
    {
      name: 'Total Suppliers',
      value: totalSuppliers,
      icon: HiUserGroup,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30',
      glow: true
    },
    {
      name: 'Total Stock Volume',
      value: totalStock,
      icon: HiClipboardList,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30',
      glow: true
    },
    {
      name: 'Low Stock Alerts',
      value: lowStockAlerts,
      icon: HiExclamationCircle,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30',
      glow: lowStockAlerts > 0
    }
  ];

  return (
    <PageWrapper>
      {/* Welcome banner */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight font-sans">
          Overview Dashboard
        </h1>
        <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 mt-1">
          Monitor your real-time inventory assets and suppliers.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} glow={stat.glow} className="relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${stat.color} group-hover:scale-110`}>
                  <Icon size={24} />
                </div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Demo Live</span>
              </div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 font-sans">
                {stat.name}
              </p>
              <h2 className="text-3xl font-black text-slate-850 dark:text-slate-50 tracking-tight">
                <CountUp value={stat.value} />
              </h2>
            </Card>
          );
        })}
      </div>

      {/* Row 1: Area Chart (Inventory trend) & Pie Chart (Category distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Trend Area Chart (2/3 width) */}
        <Card hoverable={false} className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Stock Movements Trend</h3>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Monthly stock ins and stock outs</p>
            </div>
            <Badge variant="blue">Updated Monthly</Badge>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={inventoryTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStockIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorStockOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.6)'} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                    borderColor: theme === 'dark' ? '#1e293b' : '#f1f5f9',
                    borderRadius: '12px',
                    color: theme === 'dark' ? '#f8fafc' : '#0f172a'
                  }} 
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="stockIn" name="Incoming Stock" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorStockIn)" />
                <Area type="monotone" dataKey="stockOut" name="Outgoing Stock" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorStockOut)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category distribution Pie Chart (1/3 width) */}
        <Card hoverable={false} className="flex flex-col">
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Category Mix</h3>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Distribution of items by category</p>
          </div>
          <div className="flex-1 h-56 flex flex-col justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                    borderColor: theme === 'dark' ? '#1e293b' : '#f1f5f9',
                    borderRadius: '12px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center label */}
            <div className="absolute top-[37%] left-1/2 -translate-x-1/2 text-center pointer-events-none">
              <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{totalProducts}</span>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Items</p>
            </div>
          </div>
          {/* Custom Legends list */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold">
            {categoryData.slice(0, 4).map((cat) => (
              <div key={cat.name} className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-slate-600 dark:text-slate-400 truncate">{cat.name} ({cat.value})</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 2: Radar Chart (Supplier Ratings) & Bar Chart (Low stock items) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Supplier Ratings Radar Chart */}
        <Card hoverable={false}>
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Supplier Capability Map</h3>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Performance ratings on time and quality</p>
          </div>
          <div className="h-64 flex justify-center">
            {supplierPerformanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={supplierPerformanceData.slice(0, 4)}>
                  <PolarGrid stroke={theme === 'dark' ? '#334155' : '#cbd5e1'} />
                  <PolarAngleAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" fontSize={9} />
                  <Radar name="On-Time Delivery" dataKey="onTime" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                  <Radar name="Product Quality" dataKey="quality" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                      borderColor: theme === 'dark' ? '#1e293b' : '#f1f5f9',
                      borderRadius: '12px'
                    }} 
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm font-semibold text-slate-400">No Supplier Performance Data Available.</p>
            )}
          </div>
        </Card>

        {/* Low Stock Items Bar Chart */}
        <Card hoverable={false}>
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Critical Stock Quantities</h3>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Remaining quantities of low stock items</p>
            </div>
            <Badge variant="orange">Attention Required</Badge>
          </div>
          <div className="h-64">
            {lowStockBarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lowStockBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.6)'} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                      borderColor: theme === 'dark' ? '#1e293b' : '#f1f5f9',
                      borderRadius: '12px'
                    }} 
                  />
                  <Bar dataKey="quantity" name="Stock Qty" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={35} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <span className="text-sm font-bold text-emerald-500">✓ All products are fully stocked!</span>
              </div>
            )}
          </div>
        </Card>

      </div>

      {/* Row 3: Recent Activity (logs) & Low Stock Products list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity widget (2/3 width) */}
        <Card hoverable={false} className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Recent Movements</h3>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Latest stock activity log</p>
            </div>
            <button 
              onClick={() => navigate('/inventory')}
              className="text-xs font-bold text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 flex items-center space-x-1"
            >
              <span>View Full Logs</span>
              <HiArrowSmRight size={14} />
            </button>
          </div>

          <div className="space-y-4">
            {recentLogs.length > 0 ? (
              recentLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 hover:scale-[1.005] transition"
                >
                  <div className="flex items-center space-x-3.5 overflow-hidden">
                    <Badge variant={log.type === 'Stock In' ? 'green' : 'red'}>
                      {log.type}
                    </Badge>
                    <div className="overflow-hidden">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{log.productName}</h4>
                      <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                        By {log.updatedBy} • {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {log.previousQuantity} → {log.newQuantity}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Qty Delta: {Math.abs(log.newQuantity - log.previousQuantity)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm font-semibold text-slate-400 py-6 text-center">No Stock Movements Logged.</p>
            )}
          </div>
        </Card>

        {/* Low Stock Alerts widget (1/3 width) */}
        <Card hoverable={false} className="flex flex-col">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Low Stock Check</h3>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Items requiring manual refill</p>
            </div>
            <Badge variant="orange">{lowStockAlerts} items</Badge>
          </div>

          <div className="flex-1 space-y-3.5">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((p) => (
                <div 
                  key={p.id} 
                  className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/5 border border-amber-200/20"
                >
                  <div className="flex items-center space-x-2.5 overflow-hidden">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-10 h-10 rounded-xl object-cover" 
                    />
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{p.name}</h4>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">SKU: {p.sku}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-amber-600 dark:text-amber-400">{p.quantity} left</span>
                    <button
                      onClick={() => navigate('/inventory', { state: { selectProduct: p.id } })}
                      className="block text-[10px] font-bold text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 mt-0.5"
                    >
                      Refill Stock
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <svg className="w-16 h-16 text-emerald-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-350 mb-1">Perfect Status</h4>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">All products are fully stocked above limit.</p>
              </div>
            )}
          </div>
        </Card>
      </div>

    </PageWrapper>
  );
};
export default Dashboard;
