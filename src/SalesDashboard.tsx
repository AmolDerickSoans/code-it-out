import * as React from 'react';
import { useState, useCallback } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Package, DollarSign,
  Download, FileJson, FileSpreadsheet
} from 'lucide-react';

const initialData = [
  { id: 1, product: "Laptop XZ-2000", date: "2024-01-01", sales: 1500, inventory: 32, category: "Electronics", region: "North" },
  { id: 2, product: "Smart Watch V3", date: "2024-01-02", sales: 900, inventory: 45, category: "Electronics", region: "East" },
  { id: 3, product: "Ergonomic Chair", date: "2024-01-03", sales: 2100, inventory: 18, category: "Furniture", region: "West" },
  { id: 4, product: "Wireless Earbuds", date: "2024-01-04", sales: 750, inventory: 55, category: "Electronics", region: "South" },
  { id: 5, product: "Office Desk", date: "2024-01-05", sales: 1200, inventory: 24, category: "Furniture", region: "North" },
  { id: 6, product: "Coffee Maker", date: "2024-01-06", sales: 600, inventory: 38, category: "Appliances", region: "East" },
  { id: 7, product: "Bluetooth Speaker", date: "2024-01-07", sales: 450, inventory: 62, category: "Electronics", region: "West" },
  { id: 8, product: "Standing Desk", date: "2024-01-08", sales: 1800, inventory: 15, category: "Furniture", region: "South" },
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

  const escapeCSV = (str: string) => {
    if (typeof str !== 'string') return str;
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

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
      link.download = `sales-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const headers = ['Product', 'Date', 'Sales', 'Inventory', 'Category', 'Region'];
      const csvContent = [
        headers.join(','),
        ...exportData.map(item => [
          escapeCSV(item.product),
          item.date,
          item.sales,
          item.inventory,
          escapeCSV(item.category),
          escapeCSV(item.region)
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sales-data-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThresholdValue(Number(e.target.value));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      validateFormData(formData);
      const salesValue = Number(formData.sales);
      const inventoryValue = Number(formData.inventory);
      
      if (editingId) {
        const updatedData = data.map(item => 
          item.id === editingId ? 
          {...formData, sales: salesValue, inventory: inventoryValue, id: editingId} : 
          item
        );
        setData(updatedData);
        setEditingId(null);
      } else {
        const newId = data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
        setData([...data, {...formData, sales: salesValue, inventory: inventoryValue, id: newId}]);
      }
      
      setFormData({
        product: '',
        date: '',
        sales: '',
        inventory: '',
        category: '',
        region: ''
      });
    } catch (error) {
      alert('Error saving data: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
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

  const lineData = data.map((entry, index) => ({
    name: `Day ${index + 1}`,
    value: entry.sales
  }));

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

  const getFilteredAndSortedData = useCallback(() => {
    let result = [...data];
    
    if (activeFilter !== 'all') {
      if (activeFilter === 'highSales') {
        result = result.filter(item => item.sales >= thresholdValue);
      } else if (activeFilter === 'lowSales') {
        result = result.filter(item => item.sales < thresholdValue);
      } else if (activeFilter === 'lowInventory') {
        result = result.filter(item => item.inventory < 30);
      }
    }
    
    if (searchTerm) {
      result = result.filter(item => 
        item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
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
  }, [data, activeFilter, thresholdValue, searchTerm, sortConfig]);

  const stats = calculateSummaryStats();

  const validateFormData = (data: typeof formData) => {
    if (!data.product.trim()) throw new Error('Product name is required');
    if (!data.date) throw new Error('Date is required');
    if (Number(data.sales) < 0) throw new Error('Sales cannot be negative');
    if (Number(data.inventory) < 0) throw new Error('Inventory cannot be negative');
    if (!data.category) throw new Error('Category is required');
    if (!data.region) throw new Error('Region is required');
  };

  const filteredData = getFilteredAndSortedData();

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

      <div className="bg-white rounded-lg shadow-md p-6 mb-8 mx-6">
        <div className="mb-6">
          <input 
            type="text" 
            placeholder="Search products, categories, regions..." 
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex flex-wrap gap-4 items-center">
          <button 
            className={`px-4 py-2 rounded-md transition-colors ${
              activeFilter === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleFilterChange('all')}
          >
            All Data
          </button>
          <button 
            className={`px-4 py-2 rounded-md transition-colors ${
              activeFilter === 'highSales' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleFilterChange('highSales')}
          >
            High Sales
          </button>
          <button 
            className={`px-4 py-2 rounded-md transition-colors ${
              activeFilter === 'lowSales' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleFilterChange('lowSales')}
          >
            Low Sales
          </button>
          <button 
            className={`px-4 py-2 rounded-md transition-colors ${
              activeFilter === 'lowInventory' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleFilterChange('lowInventory')}
          >
            Low Inventory
          </button>
          
          <label className="flex items-center gap-2">
            <span className="text-gray-700">Threshold:</span>
            <input 
              type="number" 
              value={thresholdValue} 
              onChange={handleThresholdChange}
              min="0"
              className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8 mx-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {editingId ? 'Edit Entry' : 'Add New Entry'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
            <input 
              type="text" 
              name="product" 
              value={formData.product} 
              onChange={handleChange} 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange} 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sales ($)</label>
            <input 
              type="number" 
              name="sales" 
              value={formData.sales} 
              onChange={handleChange} 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Inventory</label>
            <input 
              type="number" 
              name="inventory" 
              value={formData.inventory} 
              onChange={handleChange} 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Appliances">Appliances</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
            <select 
              name="region" 
              value={formData.region} 
              onChange={handleChange} 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a Region</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="East">East</option>
              <option value="West">West</option>
            </select>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
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
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8 mx-6 overflow-x-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sales Data</h2>
        <table className="w-full">
          <thead>
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
          <tbody>
            {filteredData.map((entry, index) => (
              <tr 
                key={entry.id} 
                className={`border-t border-gray-200 ${
                  entry.sales >= thresholdValue ? 'bg-green-50' : 'hover:bg-gray-50'
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
      
      <div className="bg-white rounded-lg shadow-md p-6 mx-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Data Visualization</h2>
        
        <div className="mb-8">
          <h3 className="text-xl font-medium text-gray-700 mb-4">Daily Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-medium text-gray-700 mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
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
                {getRegionData().map((entry, index) => (
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