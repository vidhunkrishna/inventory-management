import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  HiDownload, HiTrendingUp, HiCurrencyDollar, HiTemplate, HiStar
} from 'react-icons/hi';
import { useProducts } from '../hooks/useProducts';
import { useSuppliers } from '../hooks/useSuppliers';
import { useTheme } from '../hooks/useTheme';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ChartSkeleton } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';
import { inventoryTrendData, categoryDistributionData, supplierPerformanceData, monthlyMovementData } from '../data/dashboard';

export const Reports = () => {
  const { products } = useProducts();
  const { suppliers } = useSuppliers();
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);

  // Simulated API loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Compute live report stats
  const totalCatalogValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const avgItemPrice = products.length > 0 
    ? products.reduce((sum, p) => sum + p.price, 0) / products.length 
    : 0;

  // Find most stocked category
  const getMostStockedCategory = () => {
    if (products.length === 0) return 'None';
    const counts = {};
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + p.quantity;
    });
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };

  // Find top supplier based on rating
  const getTopSupplier = () => {
    if (suppliers.length === 0) return 'None';
    const active = suppliers.filter(s => s.status === 'Active');
    if (active.length === 0) return 'None';
    // Apex Technologies is a good default or find supplier with most rating
    return active[0].name;
  };

  const mostStockedCategory = getMostStockedCategory();
  const topSupplierName = getTopSupplier();

  // Export handlers (mock)
  const handleExport = (format) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: `Generating ${format} report bundle...`,
        success: `Report compiled! ${format} download started automatically.`,
        error: 'Export failed. Please try again.'
      }
    );
  };

  // Live category distribution counts
  const categoryMixData = () => {
    const counts = {};
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + p.quantity;
    });
    const colors = ['#38bdf8', '#fbbf24', '#34d399', '#f472b6', '#a78bfa'];
    return Object.keys(counts).map((cat, idx) => ({
      name: cat,
      value: counts[cat],
      color: colors[idx % colors.length]
    }));
  };

  const categoryPieData = categoryMixData();

  if (loading) {
    return (
      <PageWrapper>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-white dark:bg-slate-900 rounded-2xl animate-pulse border border-slate-100 dark:border-slate-800" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </PageWrapper>
    );
  }

  const reportStats = [
    {
      name: 'Total Catalog Valuation',
      value: `$${totalCatalogValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: HiCurrencyDollar,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30'
    },
    {
      name: 'Average Unit Price',
      value: `$${avgItemPrice.toFixed(2)}`,
      icon: HiTrendingUp,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30'
    },
    {
      name: 'Most Stocked Class',
      value: mostStockedCategory,
      icon: HiTemplate,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30'
    },
    {
      name: 'Top Supplier Partner',
      value: topSupplierName,
      icon: HiStar,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30'
    }
  ];

  return (
    <PageWrapper>
      {/* Header with mock export dropdown actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0 select-none">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight font-sans">
            Reports & Analytics
          </h1>
          <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 mt-1">
            Analyze warehouse stock distribution and export summaries.
          </p>
        </div>
        
        {/* Export options */}
        <div className="flex items-center space-x-2.5">
          <Button variant="outline" size="sm" onClick={() => handleExport('CSV')} icon={<HiDownload size={15} />}>
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('Excel')} icon={<HiDownload size={15} />}>
            Export XLS
          </Button>
          <Button variant="primary" size="sm" onClick={() => handleExport('PDF')} icon={<HiDownload size={15} />}>
            Export PDF
          </Button>
        </div>
      </div>

      {/* Valuation Stat Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 select-none">
        {reportStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} hoverable={true} className="flex items-center space-x-4 border border-slate-100 dark:border-slate-800/80">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div className="overflow-hidden text-left">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">{stat.name}</p>
                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 truncate">{stat.value}</h3>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Row 1: Line Chart (Inventory value trend) & Bar Chart (Movement detail) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Valuation Trend over Time (Line Chart) */}
        <Card hoverable={false}>
          <div className="mb-6 text-left">
            <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 font-sans">Valuation Growth Trend</h3>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Cumulative catalog valuation over month cycle</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={inventoryTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.6)'} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Valuation']}
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                    borderColor: theme === 'dark' ? '#1e293b' : '#f1f5f9',
                    borderRadius: '12px'
                  }} 
                />
                <Line type="monotone" dataKey="totalValue" name="Valuation ($)" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Weekly movement detail (Bar Chart) */}
        <Card hoverable={false}>
          <div className="mb-6 text-left">
            <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 font-sans">Weekly Qty Turnaround</h3>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Incoming vs outgoing product quantity movements</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyMovementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="incoming" name="Received Stock" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outgoing" name="Shipped Stock" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 2: Radar Chart (Supplier capabilities) & Pie Chart (Category distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category distribution (Pie Chart) - takes 1/3 width */}
        <Card hoverable={false} className="flex flex-col">
          <div className="mb-6 text-left">
            <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 font-sans">Category Qty Mix</h3>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Stock quantity shares by category</p>
          </div>
          <div className="flex-1 h-56 flex flex-col justify-center relative">
            {categoryPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryPieData.map((entry, index) => (
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
            ) : (
              <p className="text-sm font-semibold text-slate-400">No Category Data Available.</p>
            )}
            
            {/* Inner label */}
            <div className="absolute top-[37%] left-1/2 -translate-x-1/2 text-center pointer-events-none">
              <span className="text-xl font-black text-slate-800 dark:text-slate-100">Mix</span>
              <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Volume</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-semibold text-left">
            {categoryPieData.slice(0, 4).map((cat) => (
              <div key={cat.name} className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-slate-600 dark:text-slate-400 truncate">{cat.name} ({cat.value})</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Supplier ratings details (Radar Chart) - takes 2/3 width */}
        <Card hoverable={false} className="lg:col-span-2">
          <div className="mb-6 text-left">
            <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 font-sans">Supplier Delivery & Quality Matrix</h3>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Ratings benchmark mapping across key partners</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={supplierPerformanceData}>
                <PolarGrid stroke={theme === 'dark' ? '#334155' : '#cbd5e1'} />
                <PolarAngleAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" fontSize={10} />
                <Radar name="On-Time Delivery" dataKey="onTime" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
                <Radar name="Quality Rating" dataKey="quality" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.15} />
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
          </div>
        </Card>
      </div>

    </PageWrapper>
  );
};
export default Reports;
