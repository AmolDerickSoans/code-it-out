import React, { useState, useMemo, useCallback, FormEvent, ChangeEvent } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';
import { SalesData } from './types';

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
  bestSellingProduct: string;
  totalInventory: number;
  lowInventoryItems: number;
  monthOverMonthGrowth: number;
}

interface FilterState {
  dateRange: {
    start: string;
    end: string;
  };
  categories: string[];
  regions: string[];
}

interface CategoryMap {
  [key: string]: number;
}

interface RegionMap {
  [key: string]: number;
}

interface StackedBarEntry {
  [key: string]: string | number;
  region: string;
}

const calculateSummaryStats = (data: SalesData[]): SummaryStats => {
  const totalSales = data.reduce((sum, item) => sum + item.sales, 0);
  const averageSales = totalSales / data.length;

  const productSales = data.reduce((acc, item) => {
    acc[item.product] = (acc[item.product] || 0) + item.sales;
    return acc;
  }, {} as Record<string, number>);

  const bestSellingProduct = Object.entries(productSales)
    .sort(([, a], [, b]) => b - a)[0][0];

  const totalInventory = data.reduce((sum, item) => sum + item.inventory, 0);
  const lowInventoryItems = data.filter(item => item.inventory < 30).length;

  // Calculate month-over-month growth
  const sortedData = [...data].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const currentMonth = new Date(sortedData[sortedData.length - 1].date).getMonth();
  const currentMonthSales = data
    .filter(item => new Date(item.date).getMonth() === currentMonth)
    .reduce((sum, item) => sum + item.sales, 0);

  const previousMonthSales = data
    .filter(item => new Date(item.date).getMonth() === currentMonth - 1)
    .reduce((sum, item) => sum + item.sales, 0);

  const monthOverMonthGrowth = previousMonthSales ?
    ((currentMonthSales - previousMonthSales) / previousMonthSales) * 100 : 0;

  return {
    totalSales,
    averageSales,
    bestSellingProduct,
    totalInventory,
    lowInventoryItems,
    monthOverMonthGrowth
  };
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
  const [sortConfig, setSortConfig] = useState<{ key: keyof SalesData | null; direction: 'ascending' | 'descending' }>({ key: null, direction: 'ascending' });
  const [activeFilter, setActiveFilter] = useState('all');
  const [thresholdValue, setThresholdValue] = useState(1000);
  const [formErrors, setFormErrors] = useState({
    product: '',
    date: '',
    sales: '',
    inventory: '',
    category: '',
    region: ''
  });
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      start: '',
      end: ''
    },
    categories: [],
    regions: []
  });

  const summaryStats = useMemo(() => calculateSummaryStats(data), [data]);

  const deleteEntry = (id: number) => {
    const newData = data.filter((item) => item.id !== id);
    setData(newData);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Reset errors
    setFormErrors({
      product: '',
      date: '',
      sales: '',
      inventory: '',
      category: '',
      region: ''
    });

    // Validate
    let hasErrors = false;
    const newErrors = { ...formErrors };

    if (!formData.product.trim()) {
      newErrors.product = 'Product name is required';
      hasErrors = true;
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
      hasErrors = true;
    }

    const salesValue = Number(formData.sales);
    if (isNaN(salesValue) || salesValue < 0) {
      newErrors.sales = 'Sales must be a positive number';
      hasErrors = true;
    }

    const inventoryValue = Number(formData.inventory);
    if (isNaN(inventoryValue) || inventoryValue < 0) {
      newErrors.inventory = 'Inventory must be a positive number';
      hasErrors = true;
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
      hasErrors = true;
    }

    if (!formData.region) {
      newErrors.region = 'Region is required';
      hasErrors = true;
    }

    if (hasErrors) {
      setFormErrors(newErrors);
      return;
    }

    // Proceed with form submission
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

    // Reset form
    setFormData({
      product: '',
      date: '',
      sales: '',
      inventory: '',
      category: '',
      region: ''
    });
  };

  const handleEdit = (item: SalesData) => {
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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleThresholdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setThresholdValue(Number(e.target.value));
  };

  const requestSort = (key: keyof SalesData) => {
    let direction = 'ascending';

    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    setSortConfig({ key, direction: direction as 'ascending' | 'descending' });
  };

  const lineData = data
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((entry) => ({
      name: entry.date,
      value: entry.sales
    }));

  const getCategoryData = () => {
    const categoryMap: CategoryMap = {};
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
    const regionMap: RegionMap = {};

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

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [e.target.name]: e.target.value
      }
    });
  };

  const handleMultiSelect = (type: 'categories' | 'regions', value: string) => {
    setFilters(prev => {
      const currentValues = prev[type];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [type]: newValues
      };
    });
  };

  const getFilteredData = useCallback(() => {
    let result = [...data];

    // Date range filter
    if (filters.dateRange.start && filters.dateRange.end) {
      result = result.filter(item => {
        const itemDate = new Date(item.date);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    // Categories filter
    if (filters.categories.length > 0) {
      result = result.filter(item => filters.categories.includes(item.category));
    }

    // Regions filter
    if (filters.regions.length > 0) {
      result = result.filter(item => filters.regions.includes(item.region));
    }

    // Apply existing filters
    if (activeFilter !== 'all') {
      if (activeFilter === 'highSales') {
        result = result.filter(item => item.sales >= thresholdValue);
      } else if (activeFilter === 'lowSales') {
        result = result.filter(item => item.sales < thresholdValue);
      } else if (activeFilter === 'lowInventory') {
        result = result.filter(item => item.inventory < 30);
      }
    }

    // Apply search term
    if (searchTerm) {
      result = result.filter(item =>
        item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return result;
  }, [data, filters, activeFilter, thresholdValue, searchTerm]);

  const filteredData = useMemo(() => getFilteredData(), [getFilteredData]);

  const renderAdvancedFilters = () => (
    <div className="advanced-filters">
      <h3>Advanced Filters</h3>

      <div className="date-range-filters">
        <div className="filter-group">
          <label>Start Date:</label>
          <input
            type="date"
            name="start"
            value={filters.dateRange.start}
            onChange={handleDateRangeChange}
          />
        </div>
        <div className="filter-group">
          <label>End Date:</label>
          <input
            type="date"
            name="end"
            value={filters.dateRange.end}
            onChange={handleDateRangeChange}
          />
        </div>
      </div>

      <div className="multi-select-filters">
        <div className="filter-group">
          <label>Categories:</label>
          <div className="checkbox-group">
            {categoryOptions.map(category => (
              <label key={category} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={() => handleMultiSelect('categories', category)}
                />
                {category}
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Regions:</label>
          <div className="checkbox-group">
            {regionOptions.map(region => (
              <label key={region} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.regions.includes(region)}
                  onChange={() => handleMultiSelect('regions', region)}
                />
                {region}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const getStackedBarData = () => {
    const result: StackedBarEntry[] = [];
    const categories = [...new Set(data.map(item => item.category))];

    regionOptions.forEach(region => {
      const entry: StackedBarEntry = { region };
      categories.forEach(category => {
        entry[category] = data
          .filter(item => item.region === region && item.category === category)
          .reduce((sum, item) => sum + item.sales, 0);
      });
      result.push(entry);
    });

    return result;
  };

  const exportData = () => {
    const dataToExport = filteredData;

    if (exportFormat === 'csv') {
      const headers = ['product', 'date', 'sales', 'inventory', 'category', 'region'];
      const csvContent = [
        headers.join(','),
        ...dataToExport.map(item =>
          headers.map(header => item[header as keyof SalesData]).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sales-data.csv';
      a.click();
    } else {
      const jsonContent = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sales-data.json';
      a.click();
    }
  };

  const categoryOptions = ["Electronics", "Furniture", "Appliances", "Clothing", "Books"];
  const regionOptions = ["North", "South", "East", "West"];

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
          <button
            className={activeFilter === 'all' ? 'active' : ''}
            onClick={() => handleFilterChange('all')}
          >
            All Data
          </button>
          <button
            className={activeFilter === 'highSales' ? 'active' : ''}
            onClick={() => handleFilterChange('highSales')}
          >
            High Sales
          </button>
          <button
            className={activeFilter === 'lowSales' ? 'active' : ''}
            onClick={() => handleFilterChange('lowSales')}
          >
            Low Sales
          </button>
          <button
            className={activeFilter === 'lowInventory' ? 'active' : ''}
            onClick={() => handleFilterChange('lowInventory')}
          >
            Low Inventory
          </button>

          <label>
            Threshold:
            <input
              type="number"
              value={thresholdValue}
              onChange={handleThresholdChange}
              min="0"
            />
          </label>
        </div>
      </div>

      {renderAdvancedFilters()}

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
              className={formErrors.product ? 'error' : ''}
            />
            {formErrors.product && <span className="error-message">{formErrors.product}</span>}
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className={formErrors.date ? 'error' : ''}
            />
            {formErrors.date && <span className="error-message">{formErrors.date}</span>}
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
              className={formErrors.sales ? 'error' : ''}
            />
            {formErrors.sales && <span className="error-message">{formErrors.sales}</span>}
          </div>

          <div className="form-group">
            <label>Inventory</label>
            <input
              type="number"
              name="inventory"
              value={formData.inventory}
              onChange={handleChange}
              required
              className={formErrors.inventory ? 'error' : ''}
            />
            {formErrors.inventory && <span className="error-message">{formErrors.inventory}</span>}
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
              className={formErrors.category ? 'error' : ''}
            >
              <option value="">Select a Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Appliances">Appliances</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
            </select>
            {formErrors.category && <span className="error-message">{formErrors.category}</span>}
          </div>

          <div className="form-group">
            <label>Region</label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
              className={formErrors.region ? 'error' : ''}
            >
              <option value="">Select a Region</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="East">East</option>
              <option value="West">West</option>
            </select>
            {formErrors.region && <span className="error-message">{formErrors.region}</span>}
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

            {filteredData.map((entry, index) => (
              <tr key={index} className={entry.sales >= thresholdValue ? 'high-sales' : ''}>
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

      {/* Add Summary Statistics Section */}
      <div className="summary-stats">
        <h2>Dashboard Summary</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Sales</h3>
            <p>${summaryStats.totalSales.toLocaleString()}</p>
          </div>
          <div className="stat-card">
            <h3>Average Sales</h3>
            <p>${summaryStats.averageSales.toLocaleString()}</p>
          </div>
          <div className="stat-card">
            <h3>Best Selling Product</h3>
            <p>{summaryStats.bestSellingProduct}</p>
          </div>
          <div className="stat-card">
            <h3>Total Inventory</h3>
            <p>{summaryStats.totalInventory.toLocaleString()} units</p>
          </div>
          <div className="stat-card">
            <h3>Low Inventory Items</h3>
            <p>{summaryStats.lowInventoryItems} products</p>
          </div>
          <div className="stat-card">
            <h3>Month-over-Month Growth</h3>
            <p className={summaryStats.monthOverMonthGrowth >= 0 ? 'positive' : 'negative'}>
              {summaryStats.monthOverMonthGrowth.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Add Export Controls */}
      <div className="export-controls">
        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value as 'csv' | 'json')}
        >
          <option value="csv">CSV</option>
          <option value="json">JSON</option>
        </select>
        <button onClick={exportData}>Export Data</button>
      </div>

      <div className="charts-section">
        <h2>Data Visualization</h2>

        <div className="chart-container">
          <h3>Daily Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip
                formatter={(value) => [`$${value}`, 'Sales']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
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

        <div className="chart-container">
          <h3>Sales by Region</h3>
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
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Sales by Region and Category</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={getStackedBarData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Legend />
              {categoryOptions.map((category, index) => (
                <Bar
                  key={category}
                  dataKey={category}
                  stackId="a"
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default SalesDashboard;