import * as React from 'react';
import { useState, useCallback, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis,YAxis,CartesianGrid,Tooltip, Legend,
  ResponsiveContainer, Cell, ComposedChart, Area
} from 'recharts';
import {
  TrendingUp, TrendingDown, Package, DollarSign, FileJson, FileSpreadsheet, Filter, Calendar
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import ErrorBoundary from './components/ErrorBoundary';

const initialData = [
  { id: 1, product: "Laptop XZ-2000", date: "2024-03-12", sales: 1500, inventory: 32, category: "Electronics", region: "North" },
  { id: 2, product: "Smart Watch V3", date: "2024-05-25", sales: 900, inventory: 45, category: "Electronics", region: "East" },
  { id: 3, product: "Ergonomic Chair", date: "2024-07-08", sales: 2100, inventory: 18, category: "Furniture", region: "West" },
  { id: 4, product: "Wireless Earbuds", date: "2024-02-17", sales: 750, inventory: 55, category: "Electronics", region: "South" },
  { id: 5, product: "Office Desk", date: "2024-06-29", sales: 1200, inventory: 24, category: "Furniture", region: "North" },
  { id: 6, product: "Coffee Maker", date: "2024-10-05", sales: 600, inventory: 38, category: "Appliances", region: "East" },
  { id: 7, product: "Bluetooth Speaker", date: "2024-08-14", sales: 450, inventory: 62, category: "Electronics", region: "West" },
  { id: 8, product: "Standing Desk", date: "2024-04-21", sales: 1800, inventory: 15, category: "Furniture", region: "South" },
  { id: 9, product: "Gaming Mouse", date: "2024-09-11", sales: 1300, inventory: 30, category: "Electronics", region: "East" },
  { id: 10, product: "Mechanical Keyboard", date: "2024-11-03", sales: 1400, inventory: 27, category: "Electronics", region: "North" },
  { id: 11, product: "Air Purifier", date: "2024-12-19", sales: 1100, inventory: 20, category: "Appliances", region: "South" },
  { id: 12, product: "Electric Kettle", date: "2024-01-07", sales: 800, inventory: 35, category: "Appliances", region: "West" },
  { id: 13, product: "4K Monitor", date: "2024-05-15", sales: 1900, inventory: 22, category: "Electronics", region: "North" },
  { id: 14, product: "Fitness Tracker", date: "2024-07-30", sales: 950, inventory: 40, category: "Electronics", region: "East" },
  { id: 15, product: "Recliner Sofa", date: "2024-09-22", sales: 2300, inventory: 10, category: "Furniture", region: "South" },
  { id: 16, product: "Smart TV 55-inch", date: "2024-02-10", sales: 2600, inventory: 12, category: "Electronics", region: "West" },
  { id: 17, product: "Microwave Oven", date: "2024-06-06", sales: 1350, inventory: 28, category: "Appliances", region: "North" },
  { id: 18, product: "Noise Cancelling Headphones", date: "2024-03-18", sales: 1700, inventory: 21, category: "Electronics", region: "South" },
  { id: 19, product: "Robot Vacuum", date: "2024-11-27", sales: 2000, inventory: 14, category: "Appliances", region: "East" },
  { id: 20, product: "Adjustable Bed Frame", date: "2024-08-09", sales: 2400, inventory: 8, category: "Furniture", region: "West" },
];


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

interface SummaryStats {
  totalSales: number;
  averageSales: number;
  bestSellingProduct: {
    name: string;
    sales: number;
  };
  totalInventory: number;
  salesChange: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: {
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded shadow">
        <p className="font-medium">{`Date: ${label}`}</p>
        {payload.map((pld, index) => (
          <p key={`tooltip-${index}`} style={{ color: pld.color }}>
            {`${pld.name}: $${pld.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface ValidationError {
  field: string;
  message: string;
}

interface FormData {
  product: string;
  date: string;
  sales: string;
  inventory: string;
  category: string;
  region: string;
}

const validateFormData = (formData: FormData, editingId: number | null, existingData: typeof initialData): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!formData.product.trim()) {
    errors.push({ field: 'product', message: 'Product name is required' });
  }
  
  if (!formData.date) {
    errors.push({ field: 'date', message: 'Date is required' });
  } else {
    const dateValue = new Date(formData.date);
    if (isNaN(dateValue.getTime())) {
      errors.push({ field: 'date', message: 'Invalid date format' });
    }
  }
  
  const salesValue = Number(formData.sales);
  if (isNaN(salesValue) || salesValue < 0) {
    errors.push({ field: 'sales', message: 'Sales must be a positive number' });
  }
  
  const inventoryValue = Number(formData.inventory);
  if (isNaN(inventoryValue) || inventoryValue < 0) {
    errors.push({ field: 'inventory', message: 'Inventory must be a positive number' });
  }
  
  if (!formData.category) {
    errors.push({ field: 'category', message: 'Category is required' });
  }
  
  if (!formData.region) {
    errors.push({ field: 'region', message: 'Region is required' });
  }
  
  if (!editingId && formData.product.trim()) {
    const isDuplicate = existingData.some(item => 
      item.product.toLowerCase() === formData.product.toLowerCase()
    );
    if (isDuplicate) {
      errors.push({ field: 'product', message: 'Product name already exists' });
    }
  }
  
  return errors;
};

const SalesDashboard = () => {
  const [data, setData] = useState(initialData);
  const [formData, setFormData] = useState({
    product: '',
    date: '',
    sales: '',
    inventory: '',
    category: '',
    region: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string | null, direction: 'ascending' | 'descending' }>({ key: null, direction: 'ascending' });
  const [activeFilter, setActiveFilter] = useState('all');
  const [thresholdValue, setThresholdValue] = useState(1000);
  const [dateRange, setDateRange] = useState<{start: Date | null; end: Date | null}>({
    start: null,
    end: null
  });
  const [selectedCategories, setSelectedCategories] = useState<Array<{value: string; label: string}>>([]);
  const [selectedRegions, setSelectedRegions] = useState<Array<{value: string; label: string}>>([]);

  const calculateSummaryStats = useCallback((): SummaryStats => {
    const totalSales = data.reduce((sum, item) => sum + item.sales, 0);
    const averageSales = totalSales / data.length;

    const bestSeller = data.reduce((best, current) =>
      current.sales > (best?.sales || 0) ? current : best
      , data[0]);

    const totalInventory = data.reduce((sum, item) => sum + item.inventory, 0);

    const sortedByDate = [...data].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const latestSales = sortedByDate[0]?.sales || 0;
    const previousSales = sortedByDate[1]?.sales || 0;
    const salesChange = previousSales ? ((latestSales - previousSales) / previousSales) * 100 : 0;

    return {
      totalSales,
      averageSales,
      bestSellingProduct: {
        name: bestSeller.product,
        sales: bestSeller.sales
      },
      totalInventory,
      salesChange
    };
  }, [data]);

  const handleExport = (format: 'csv' | 'json') => {
    const exportData = filteredData.map(item => ({
      ...item,
      sales: `$${item.sales.toLocaleString()}`
    }));

    if (format === 'json') {
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sales-data.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const headers = ['Product', 'Date', 'Sales', 'Inventory', 'Category', 'Region'];
      const csvContent = [
        headers.join(','),
        ...exportData.map(item => [
          item.product,
          item.date,
          item.sales,
          item.inventory,
          item.category,
          item.region
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sales-data.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateFormData(formData, editingId, data);

    if (errors.length > 0) {
      console.error('Form validation errors:', errors);
      return;
    }

    const salesValue = Number(formData.sales);
    const inventoryValue = Number(formData.inventory);

    if (editingId) {
      const updatedData = data.map(item =>
        item.id === editingId ?
          { ...formData, sales: salesValue, inventory: inventoryValue, id: editingId } :
          item
      );
      setData(updatedData);
      setEditingId(null);
    } else {
      const newId = data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
      setData([...data, { ...formData, sales: salesValue, inventory: inventoryValue, id: newId }]);
    }

    setFormData({
      product: '',
      date: '',
      sales: '',
      inventory: '',
      category: '',
      region: ''
    });
  };

  const handleEdit = (item: typeof initialData[0]) => {
    setFormData({
      product: item.product,
      date: item.date,
      sales: item.sales.toString(),
      inventory: item.inventory.toString(),
      category: item.category,
      region: item.region
    });
    setEditingId(item.id);
  };

  const deleteEntry = (id: number) => {
    const newData = data.filter(item => item.id !== id);
    setData(newData);
  };

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';

    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    setSortConfig({ key, direction });
  };

  const lineData = useMemo(() => {
    try {
      return data.map((entry, index) => ({
        name: `Day ${index + 1}`,
        value: entry.sales
      }));
    } catch (error) {
      console.error('Error processing data:', error);
      throw new Error('Failed to process sales data');
    }
  }, [data]);


  const getCategoryData = () => {
    const categoryMap: { [key: string]: number } = {};
    data.forEach(item => {
      if (categoryMap[item.category]) {
        categoryMap[item.category] += item.sales;
      } else {
        categoryMap[item.category] = item.sales;
      }
    });

    return Object.keys(categoryMap).map(category => ({
      name: category,
      value: categoryMap[category]
    }));
  };

  const getRegionData = () => {
    const regionMap: { [key: string]: number } = {};
    data.forEach(item => {
      if (regionMap[item.region]) {
        regionMap[item.region] += item.sales;
      } else {
        regionMap[item.region] = item.sales;
      }
    });

    return Object.entries(regionMap).map(([name, value]) => ({
      name,
      value
    }));
  };

  const getStackedBarData = () => {
    const categoryRegionMap: { [key: string]: { [key: string]: number } } = {};
    data.forEach(item => {
      if (!categoryRegionMap[item.category]) {
        categoryRegionMap[item.category] = {};
      }
      if (categoryRegionMap[item.category][item.region]) {
        categoryRegionMap[item.category][item.region] += item.sales;
      } else {
        categoryRegionMap[item.category][item.region] = item.sales;
      }
    });

    return Object.keys(categoryRegionMap).map(category => {
      const regionSales = categoryRegionMap[category];
      return {
        name: category,
        ...regionSales
      };
    });
  };

  const getMonthlyTrends = () => {
    const monthlyData: { [key: string]: number } = {};

    data.forEach(item => {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (monthlyData[monthKey]) {
        monthlyData[monthKey] += item.sales;
      } else {
        monthlyData[monthKey] = item.sales;
      }
    });

    const sortedMonths = Object.keys(monthlyData).sort();
    const trends = sortedMonths.map((month, index) => {
      const currentSales = monthlyData[month];
      const previousSales = index > 0 ? monthlyData[sortedMonths[index - 1]] : currentSales;
      const growthRate = ((currentSales - previousSales) / previousSales) * 100;

      return {
        month,
        sales: currentSales,
        growth: index === 0 ? 0 : growthRate
      };
    });

    return trends;
  };

  const getFilteredAndSortedData = useCallback(() => {
    let result = [...data];
    
    if (searchTerm) {
      result = result.filter(item => 
        item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Date range filter
    if (dateRange.start && dateRange.end) {
      result = result.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= dateRange.start! && itemDate <= dateRange.end!;
      });
    }
    
    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(item =>
        selectedCategories.some(cat => cat.value === item.category)
      );
    }
    
    // Region filter
    if (selectedRegions.length > 0) {
      result = result.filter(item =>
        selectedRegions.some(region => region.value === item.region)
      );
    }
    
    // Existing filters
    if (activeFilter !== 'all') {
      if (activeFilter === 'highSales') {
        result = result.filter(item => item.sales >= thresholdValue);
      } else if (activeFilter === 'lowSales') {
        result = result.filter(item => item.sales < thresholdValue);
      } else if (activeFilter === 'lowInventory') {
        result = result.filter(item => item.inventory < 30);
      }
    }
    
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [data, dateRange, selectedCategories, selectedRegions, activeFilter, thresholdValue, searchTerm, sortConfig]);

  let filteredData = getFilteredAndSortedData();

  const stats = calculateSummaryStats();

  const categoryOptions = [
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Furniture', label: 'Furniture' },
    { value: 'Appliances', label: 'Appliances' },
    { value: 'Clothing', label: 'Clothing' }
  ];

  const regionOptions = [
    { value: 'North', label: 'North' },
    { value: 'South', label: 'South' },
    { value: 'East', label: 'East' },
    { value: 'West', label: 'West' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-8 pt-8">Sales Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mx-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">Total Sales</h3>
            <DollarSign className="text-green-500" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-900">${stats.totalSales.toLocaleString()}</p>
          <div className="flex items-center mt-2">
            {stats.salesChange >= 0 ? (
              <TrendingUp className="text-green-500 mr-2" size={20} />
            ) : (
              <TrendingDown className="text-red-500 mr-2" size={20} />
            )}
            <span className={`text-sm ${stats.salesChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(stats.salesChange).toFixed(1)}% from previous day
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">Average Sales</h3>
            <Package className="text-blue-500" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${stats.averageSales.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-500 mt-2">Per product</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">Best Selling Product</h3>
            <TrendingUp className="text-purple-500" size={24} />
          </div>
          <p className="text-xl font-bold text-gray-900">{stats.bestSellingProduct.name}</p>
          <p className="text-sm text-gray-500 mt-2">
            ${stats.bestSellingProduct.sales.toLocaleString()} in sales
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">Total Inventory</h3>
            <Package className="text-orange-500" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalInventory.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-2">Units in stock</p>
        </div>
      </div>

      <div className="flex justify-end gap-4 mb-8 mx-6">
        <button
          onClick={() => handleExport('csv')}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          <FileSpreadsheet className="mr-2" size={20} />
          Export CSV
        </button>
        <button
          onClick={() => handleExport('json')}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <FileJson className="mr-2" size={20} />
          Export JSON
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6 mx-6">
        <h3 className="text-lg font-medium mb-4">Advanced Filters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products, categories, regions..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <div className="flex gap-2">
              <DatePicker
                selected={dateRange.start}
                onChange={(date: Date | null) => setDateRange(prev => ({ ...prev, start: date }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                placeholderText="Start Date"
              />
              <DatePicker
                selected={dateRange.end}
                onChange={(date: Date | null) => setDateRange(prev => ({ ...prev, end: date }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                placeholderText="End Date"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
            <Select
              isMulti
              options={categoryOptions}
              value={selectedCategories}
              onChange={(selected) => setSelectedCategories(selected as typeof selectedCategories)}
              className="text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Regions</label>
            <Select
              isMulti
              options={regionOptions}
              value={selectedRegions}
              onChange={(selected) => setSelectedRegions(selected as typeof selectedRegions)}
              className="text-sm"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setDateRange({ start: null, end: null });
                setSelectedCategories([]);
                setSelectedRegions([]);
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8 mx-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {editingId ? 'Edit Entry' : 'Add New Entry'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
            <input
              type="text"
              name="product"
              value={formData.product}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Sales</label>
            <input
              type="number"
              name="sales"
              value={formData.sales}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Inventory</label>
            <input
              type="number"
              name="inventory"
              value={formData.inventory}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Appliances">Appliances</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
            </select>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a Region</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="East">East</option>
              <option value="West">West</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button
            type="submit"
            className="w-full sm:w-auto px-4 md:px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm md:text-base"
          >
            {editingId ? 'Update Entry' : 'Add Entry'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  product: '',
                  date: '',
                  sales: '',
                  inventory: '',
                  category: '',
                  region: ''
                });
              }}
              className="w-full sm:w-auto px-4 md:px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm md:text-base"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8 mx-2 md:mx-6 overflow-x-auto">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">Sales Data</h2>
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100" onClick={() => requestSort('product')}>
                    Product {sortConfig.key === 'product' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100" onClick={() => requestSort('date')}>
                    Date {sortConfig.key === 'date' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100" onClick={() => requestSort('sales')}>
                    Sales ($) {sortConfig.key === 'sales' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100" onClick={() => requestSort('inventory')}>
                    Inventory {sortConfig.key === 'inventory' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100" onClick={() => requestSort('category')}>
                    Category {sortConfig.key === 'category' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100" onClick={() => requestSort('region')}>
                    Region {sortConfig.key === 'region' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredData.map((entry) => (
                  <tr
                    key={entry.id}
                    className={`border-t border-gray-200 ${entry.sales >= thresholdValue ? 'bg-green-50' : 'hover:bg-gray-50'
                      }`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">{entry.product}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{entry.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">${entry.sales.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{entry.inventory}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{entry.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{entry.region}</td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                        onClick={() => handleEdit(entry)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        onClick={() => deleteEntry(entry.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mx-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Data Visualization</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          <ErrorBoundary>
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-medium text-gray-700 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                  Daily Sales Trend
                </div>
              </h3>
              <div className="h-[300px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={lineData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#666' }}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      tick={{ fill: '#666' }}
                      label={{ value: 'Sales ($)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ paddingTop: '10px' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ fill: '#8884d8' }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </ErrorBoundary>

          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-medium text-gray-700 mb-4">Sales by Category</h3>
            <div className="h-[300px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getCategoryData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-medium text-gray-700 mb-4">Sales by Category and Region</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={getStackedBarData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="North" fill="#8884d8" stroke="#8884d8" />
              <Bar dataKey="South" fill="#82ca9d" />
              <Bar dataKey="East" fill="#ffc658" />
              <Bar dataKey="West" fill="#ff8042" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-medium text-gray-700 mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} />
              Monthly Sales Growth
              <Filter className="ml-auto cursor-pointer" size={20} />
            </div>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={getMonthlyTrends()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fill: '#666' }}
                label={{
                  value: 'Month',
                  position: 'bottom',
                  offset: 0,
                  style: { fill: '#666', fontSize: 12 } // Optional: Add styling for the label
                }}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: '#666' }}
                label={{
                  value: 'Sales ($)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: '#666', fontSize: 12 } // Optional: Add styling for the label
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: '#666' }}
                label={{
                  value: 'Growth Rate (%)',
                  angle: 90,
                  position: 'insideRight',
                  style: { fill: '#666', fontSize: 12 } // Optional: Add styling for the label
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                wrapperStyle={{ paddingTop: '10px' }}
              />
              <Bar
                dataKey="sales"
                fill="#8884d8"
                yAxisId="left"
                name="Total Sales"
                radius={[4, 4, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="growth"
                stroke="#82ca9d"
                yAxisId="right"
                name="Growth Rate %"
                dot={{ r: 4 }}
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-xl font-medium text-gray-700 mb-4">Sales by Region</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getRegionData()}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {getRegionData().map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;