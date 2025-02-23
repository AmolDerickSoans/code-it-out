import React, { useState, useMemo, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts';

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

const SalesDashboard = () => {
  const loadDataFromLocalStorage = () => {
    const savedData = localStorage.getItem('salesData');
    return savedData ? JSON.parse(savedData) : initialData;
  };

  const [data, setData] = useState(loadDataFromLocalStorage);
  const [formData, setFormData] = useState({
    product: '',
    date: '',
    sales: '',
    inventory: '',
    category: '',
    region: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [activeFilter, setActiveFilter] = useState('all');
  const [thresholdValue, setThresholdValue] = useState(1000);

  useEffect(() => {
    localStorage.setItem('salesData', JSON.stringify(data));
  }, [data]);

  const deleteEntry = (id) => {
    const newData = data.filter(item => item.id !== id);
    setData(newData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const salesValue = Number(formData.sales);
    const inventoryValue = Number(formData.inventory);
    
    if (salesValue < 0 || inventoryValue < 0) {
      alert("Sales and Inventory must be non-negative.");
      return;
    }

    if (editingId) {
      const updatedData = data.map(item => 
        item.id === editingId ? { ...formData, sales: salesValue, inventory: inventoryValue, id: editingId } : item
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

  const handleEdit = (item) => {
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleThresholdChange = (e) => {
    setThresholdValue(Number(e.target.value));
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const lineData = useMemo(() => data.map(entry => ({
    name: entry.date,
    value: entry.sales
  })), [data]);

  const getTopSellingProducts = useMemo(() => {
    const productMap = {};
    data.forEach(item => {
      productMap[item.product] = (productMap[item.product] || 0) + item.sales;
    });
    return Object.entries(productMap)
      .map(([product, totalSales]) => ({ product, totalSales }))
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 5); // Get top 5 products
  }, [data]);

  // New Product Performance Analysis feature
  const getProductPerformanceAnalysis = useMemo(() => {
    const performanceMap = {};
    data.forEach(item => {
      if (!performanceMap[item.product]) {
        performanceMap[item.product] = { totalSales: 0, count: 0 };
      }
      performanceMap[item.product].totalSales += item.sales;
      performanceMap[item.product].count += 1;
    });
    return Object.entries(performanceMap).map(([product, performance]) => ({
      product,
      averageSales: (performance.totalSales / performance.count).toFixed(2)
    }));
  }, [data]);

  const getCategoryData = useMemo(() => {
    const categoryMap = {};
    data.forEach(item => {
      categoryMap[item.category] = (categoryMap[item.category] || 0) + item.sales;
    });
    return Object.keys(categoryMap).map(category => ({
      name: category,
      value: categoryMap[category]
    }));
  }, [data]);

  const getRegionData = useMemo(() => {
    const regionMap = {};
    data.forEach(item => {
      regionMap[item.region] = (regionMap[item.region] || 0) + item.sales;
    });
    return Object.keys(regionMap).map(region => ({
      name: region,
      value: regionMap[region]
    }));
  }, [data]);

  let filteredData = data;

  if (activeFilter !== 'all') {
    if (activeFilter === 'highSales') {
      filteredData = data.filter(item => item.sales >= thresholdValue);
    } else if (activeFilter === 'lowSales') {
      filteredData = data.filter(item => item.sales < thresholdValue);
    } else if (activeFilter === 'lowInventory') {
      filteredData = data.filter(item => item.inventory < 30);  // Leaving the low inventory filter intact
    }
  }

  if (searchTerm) {
    filteredData = filteredData.filter(item => 
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.region.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (sortConfig.key) {
    filteredData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }

  return (
    <div className="sales-dashboard">
      <h1>Sales Dashboard</h1>
      <div className='content-section'>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search products, categories, regions..." 
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="filter-controls">
          <button className={activeFilter === 'all' ? 'active' : ''} onClick={() => handleFilterChange('all')}>All Data</button>
          <button className={activeFilter === 'highSales' ? 'active' : ''} onClick={() => handleFilterChange('highSales')}>High Sales</button>
          <button className={activeFilter === 'lowSales' ? 'active' : ''} onClick={() => handleFilterChange('lowSales')}>Low Sales</button>
          <button className={activeFilter === 'lowInventory' ? 'active' : ''} onClick={() => handleFilterChange('lowInventory')}>Low Inventory</button>
          <label>
            Threshold: 
            <input type="number" value={thresholdValue} onChange={handleThresholdChange} min="0" />
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="data-form">
        <h2>{editingId ? 'Edit Entry' : 'Add New Entry'}</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Product</label>
            <input type="text" name="product" value={formData.product} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Sales ($)</label>
            <input type="number" name="sales" value={formData.sales} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Inventory</label>
            <input type="number" name="inventory" value={formData.inventory} onChange={handleChange} required />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select a Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Appliances">Appliances</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
            </select>
          </div>
          <div className="form-group">
            <label>Region</label>
            <select name="region" value={formData.region} onChange={handleChange} required>
              <option value="">Select a Region</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="East">East</option>
              <option value="West">West</option>
            </select>
          </div>
        </div>
        
        <button type="submit">{editingId ? 'Update Entry' : 'Add Entry'}</button>
        {editingId && (
          <button type="button" onClick={() => {
            setEditingId(null);
            setFormData({
              product: '',
              date: '',
              sales: '',
              inventory: '',
              category: '',
              region: ''
            });
          }}>
            Cancel
          </button>
        )}
      </form>

      <div className="data-table-container">
        <h2>Sales Data</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => requestSort('product')}>Product {sortConfig.key === 'product' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
              <th onClick={() => requestSort('date')}>Date {sortConfig.key === 'date' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
              <th onClick={() => requestSort('sales')}>Sales ($) {sortConfig.key === 'sales' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
              <th onClick={() => requestSort('inventory')}>Inventory {sortConfig.key === 'inventory' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
              <th onClick={() => requestSort('category')}>Category {sortConfig.key === 'category' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
              <th onClick={() => requestSort('region')}>Region {sortConfig.key === 'region' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(entry => (
              <tr key={entry.id} className={entry.sales >= thresholdValue ? 'high-sales' : ''}>
                <td>{entry.product}</td>
                <td>{entry.date}</td>
                <td>{entry.sales}</td>
                <td>{entry.inventory}</td>
                <td>{entry.category}</td>
                <td>{entry.region}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(entry)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteEntry(entry.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="charts-section">
        <h2>Data Visualization</h2>
        
        <div className="chart-container">
          <h3>Sales Trend Over Time</h3>
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
        
        <div className="chart-container">
          <h3>Top Selling Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getTopSellingProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="product" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalSales" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Product Performance Analysis (Average Sales)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getProductPerformanceAnalysis}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="product" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="averageSales" fill="#FFBB28" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getCategoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Sales by Region</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={getRegionData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
                {getRegionData.map((entry, index) => (
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