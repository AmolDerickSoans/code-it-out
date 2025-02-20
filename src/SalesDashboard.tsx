import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';
import SalesSummary from './SalesSummary';
import DataExport from './DataExport';
import SalesCharts from './SalesChart';
import ErrorBoundary from './ErrorBoundary';
const initialData: SalesData[] = [
  { id: 1, product: "Laptop XZ-2000", date: "2024-01-01", sales: 1500, inventory: 32, category: "Electronics", region: "North" },
  { id: 2, product: "Smart Watch V3", date: "2024-01-02", sales: 900, inventory: 45, category: "Electronics", region: "East" },
  { id: 3, product: "Ergonomic Chair", date: "2024-01-03", sales: 2100, inventory: 18, category: "Furniture", region: "West" },
  { id: 4, product: "Wireless Earbuds", date: "2024-01-04", sales: 750, inventory: 55, category: "Electronics", region: "South" },
  { id: 5, product: "Office Desk", date: "2024-01-05", sales: 1200, inventory: 24, category: "Furniture", region: "North" },
  { id: 6, product: "Coffee Maker", date: "2024-01-06", sales: 600, inventory: 38, category: "Appliances", region: "East" },
  { id: 7, product: "Bluetooth Speaker", date: "2024-01-07", sales: 450, inventory: 62, category: "Electronics", region: "West" },
  { id: 8, product: "Standing Desk", date: "2024-01-08", sales: 1800, inventory: 15, category: "Furniture", region: "South" },
  { id: 9, product: "Running Shoes", date: "2024-02-01", sales: 1300, inventory: 40, category: "Apparel", region: "North" },
  { id: 10, product: "Smartphone Pro", date: "2024-02-05", sales: 2700, inventory: 22, category: "Electronics", region: "East" },
  { id: 11, product: "Electric Kettle", date: "2024-03-10", sales: 900, inventory: 35, category: "Appliances", region: "West" },
  { id: 12, product: "Gaming Console", date: "2024-03-15", sales: 3200, inventory: 18, category: "Electronics", region: "South" },
  { id: 13, product: "Yoga Mat", date: "2024-04-01", sales: 750, inventory: 50, category: "Fitness", region: "North" },
  { id: 14, product: "Microwave Oven", date: "2024-04-07", sales: 1600, inventory: 20, category: "Appliances", region: "East" },
  { id: 15, product: "Office Chair", date: "2024-05-03", sales: 2100, inventory: 17, category: "Furniture", region: "West" },
  { id: 16, product: "Tablet X10", date: "2024-05-14", sales: 2800, inventory: 12, category: "Electronics", region: "South" },
  { id: 17, product: "Graphic Tablet", date: "2024-06-01", sales: 1400, inventory: 25, category: "Electronics", region: "North" },
  { id: 18, product: "Fitness Tracker", date: "2024-06-12", sales: 1000, inventory: 30, category: "Fitness", region: "East" },
  { id: 19, product: "Digital Camera", date: "2024-07-20", sales: 2300, inventory: 14, category: "Electronics", region: "West" },
  { id: 20, product: "Blender Pro", date: "2024-07-28", sales: 800, inventory: 37, category: "Appliances", region: "South" }
];

interface SalesData {
  id: number;
  product: string;
  date: string;
  sales: number;
  inventory: number;
  category: string;
  region: string;
}



const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

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
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    selectedCategories: [] as string[],
    selectedRegions: [] as string[],
    minSales: '',
    maxSales: '',
  });



  const totalSales = data.reduce((sum, item) => sum + item.sales, 0);
  const avgSales = (data.length > 0 ? (totalSales / data.length).toFixed(2) : "0.00");
  const bestSellingProduct = data.reduce((max, item) => (item.sales > max.sales ? item : max), data[0]);

  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [activeFilter, setActiveFilter] = useState('all');
  const [thresholdValue, setThresholdValue] = useState(1000);


  const deleteEntry = (id) => {
    setData(prevData => prevData.filter(item => item.id !== id));
  };


  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({}); // Clear errors if valid

    const salesValue = Number(formData.sales);
    const inventoryValue = Number(formData.inventory);

    setData(prevData => {
      if (editingId) {
        return prevData.map(item =>
          item.id === editingId
            ? { ...formData, sales: salesValue, inventory: inventoryValue, id: editingId }
            : item
        );
      }
      const newId = prevData.length > 0 ? Math.max(...prevData.map(item => item.id)) + 1 : 1;
      return [...prevData, { ...formData, sales: salesValue, inventory: inventoryValue, id: newId }];
    });

    setEditingId(null);
    setFormData({ product: '', date: '', sales: '', inventory: '', category: '', region: '' });
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

  const lineData = data.map((entry, index) => ({
    name: `Day ${index + 1}`,
    value: entry.sales
  }));

  const getCategoryData = () => {
    const categoryMap = {};
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
    const regionMap = {};

    data.forEach(item => {
      if (regionMap[item.region]) {
        regionMap[item.region] += item.sales;
      } else {
        regionMap[item.region] = item.sales;
      }
    });

    return Object.keys(regionMap).map(region => ({
      name: region,
      value: regionMap[region]
    }));
  };


  let filteredData = data.filter((item) => {
    const withinDateRange =
      (!filters.startDate || item.date >= filters.startDate) &&
      (!filters.endDate || item.date <= filters.endDate);
    const categoryMatch =
      filters.selectedCategories.length === 0 || filters.selectedCategories.includes(item.category);
    const regionMatch =
      filters.selectedRegions.length === 0 || filters.selectedRegions.includes(item.region);
    const withinSalesRange =
      (!filters.minSales || item.sales >= Number(filters.minSales)) &&
      (!filters.maxSales || item.sales <= Number(filters.maxSales));
    const searchMatch = item.product.toLowerCase().includes(searchTerm.toLowerCase());

    return withinDateRange && categoryMatch && regionMatch && withinSalesRange && searchMatch;
  });



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

  const validateForm = () => {
    const errors = {};

    if (!formData.product.trim()) errors.product = "Product name is required.";
    if (!formData.date) errors.date = "Date is required.";
    if (new Date(formData.date) > new Date()) errors.date = "Future dates are not allowed.";
    if (!formData.sales || Number(formData.sales) <= 0) errors.sales = "Sales must be a positive number.";
    if (!formData.inventory || Number(formData.inventory) < 0) errors.inventory = "Inventory cannot be negative.";
    if (!formData.category) errors.category = "Category is required.";
    if (!formData.region) errors.region = "Region is required.";

    return errors;
  };


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

        <div className="filter-controls bg-gray-900 p-4 rounded-lg border border-gray-700">
          <h2 className="text-lg font-semibold text-white">Filters</h2>

          {/* ✅ Date Range Filters */}
          <div className="flex space-x-4 my-2">
            <label className="text-white">
              Start Date:
              <input
                type="date"
                className="ml-2 p-1 border rounded bg-gray-800 text-white"
                value={filters.startDate}
                onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
              />
            </label>

            <label className="text-white">
              End Date:
              <input
                type="date"
                className="ml-2 p-1 border rounded bg-gray-800 text-white"
                value={filters.endDate}
                onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
              />
            </label>
          </div>

          {/* ✅ Min & Max Sales Filtering */}
          <div className="flex space-x-4 my-2">
            <label className="text-white">
              Min Sales ($):
              <input
                type="number"
                className="ml-2 p-1 border rounded bg-gray-800 text-white"
                placeholder="0"
                value={filters.minSales}
                onChange={(e) => setFilters((prev) => ({ ...prev, minSales: e.target.value }))}
              />
            </label>

            <label className="text-white">
              Max Sales ($):
              <input
                type="number"
                className="ml-2 p-1 border rounded bg-gray-800 text-white"
                placeholder="Unlimited"
                value={filters.maxSales}
                onChange={(e) => setFilters((prev) => ({ ...prev, maxSales: e.target.value }))}
              />
            </label>
          </div>

          {/* ✅ Category Multi-Select */}
          <div className="my-2">
            <h3 className="text-white text-sm font-bold">Filter by Category:</h3>
            <div className="flex flex-wrap gap-2">
              {["Electronics", "Furniture", "Appliances"].map((category) => (
                <label key={category} className="text-white flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.selectedCategories.includes(category)}
                    onChange={() =>
                      setFilters((prev) => ({
                        ...prev,
                        selectedCategories: prev.selectedCategories.includes(category)
                          ? prev.selectedCategories.filter((c) => c !== category)
                          : [...prev.selectedCategories, category],
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ✅ Region Multi-Select */}
          <div className="my-2">
            <h3 className="text-white text-sm font-bold">Filter by Region:</h3>
            <div className="flex flex-wrap gap-2">
              {["North", "South", "East", "West"].map((region) => (
                <label key={region} className="text-white flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.selectedRegions.includes(region)}
                    onChange={() =>
                      setFilters((prev) => ({
                        ...prev,
                        selectedRegions: prev.selectedRegions.includes(region)
                          ? prev.selectedRegions.filter((r) => r !== region)
                          : [...prev.selectedRegions, region],
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <span>{region}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

      </div>

      <form onSubmit={handleSubmit} className="data-form">
        <h2>{editingId ? 'Edit Entry' : 'Add New Entry'}</h2>

        <div className="form-row">
          <div className="form-group">
            <label>Product</label>
            <input
              type="text"
              name="product"
              value={formData.product}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Sales ($)</label>
            <input
              type="number"
              name="sales"
              value={formData.sales}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Inventory</label>
            <input
              type="number"
              name="inventory"
              value={formData.inventory}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
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
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
            >
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

      {/* Data Table */}
      <div className="data-table-container">
        <h2>Sales Data</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => requestSort('product')}>
                Product {sortConfig.key === 'product' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('date')}>
                Date {sortConfig.key === 'date' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('sales')}>
                Sales ($) {sortConfig.key === 'sales' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('inventory')}>
                Inventory {sortConfig.key === 'inventory' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('category')}>
                Category {sortConfig.key === 'category' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('region')}>
                Region {sortConfig.key === 'region' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>

            {filteredData.map((entry) => (
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
          <h3>Daily Sales Trend</h3>
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
          <h3>Sales by Category</h3>
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
    

        {/* ✅ Sales Charts Component */}
        <SalesCharts data={data} />

        <SalesSummary
          totalSales={totalSales}
          avgSales={avgSales}
          bestSellingProduct={bestSellingProduct}
        />

        {/* ✅ Data Export Component */}
        <DataExport data={data} />
      </div>
    </div>
  );
};

export default SalesDashboard;