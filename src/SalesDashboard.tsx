import React, { useState,useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts';
import { saveAs } from 'file-saver';
import { FaFilter } from "react-icons/fa";




const initialData = [
  { id: 1, product: "Laptop XZ-2000", date: "2024-01-01", sales: 1500, inventory: 32, category: "Electronics", region: "North" },
  { id: 2, product: "Smart Watch V3", date: "2024-01-02", sales: 900, inventory: 45, category: "Electronics", region: "East" },
  { id: 3, product: "Ergonomic Chair", date: "2024-01-03", sales: 2100, inventory: 18, category: "Furniture", region: "West" },
  { id: 4, product: "Wireless Earbuds", date: "2024-01-04", sales: 750, inventory: 55, category: "Electronics", region: "South" },
  { id: 5, product: "Office Desk", date: "2024-01-05", sales: 1200, inventory: 24, category: "Furniture", region: "North" },
  { id: 6, product: "Coffee Maker", date: "2024-01-06", sales: 600, inventory: 38, category: "Appliances", region: "East" },
  { id: 7, product: "Bluetooth Speaker", date: "2024-01-07", sales: 450, inventory: 62, category: "Electronics", region: "West" },
  { id: 8, product: "Standing Desk", date: "2024-03-08", sales: 1800, inventory: 15, category: "Furniture", region: "South" },
];

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
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [activeFilter, setActiveFilter] = useState('all');
  const [thresholdValue, setThresholdValue] = useState(1000);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [displayedData, setDisplayedData] = useState(initialData);

  const [filters, setFilters] = useState<{ category: string[]; region: string[] }>({
    category: [],
    region: [],
  });
  
  const handleFilterColor = (filter) => {
    setActiveFilter(filter);
  };

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  
  const handleMultiSelect = (type: "category" | "region", value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: prevFilters[type].includes(value)
        ? prevFilters[type].filter((item) => item !== value) 
        : [...prevFilters[type], value],
    }));
  };

  const handleDoubleClick = (type, value) => {
    if (type === "category") {
      setSelectedCategories((prev) =>
        prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
      );
    } else if (type === "region") {
      setSelectedRegions((prev) =>
        prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
      );
    }
  };
  
  
  
  
  const applyFilter = () => {
    let filtered = initialData;
  
    if (filters.category.length > 0) {
      filtered = filtered.filter(item => filters.category.includes(item.category));
    }
    if (filters.region.length > 0) {
      filtered = filtered.filter(item => filters.region.includes(item.region));
    }
  
    setDisplayedData(filtered);
    setData(filtered);
  };
  

  const getCategoryRegionData = () => {
    const categoryRegionMap: Record<string, Record<string, number>> = {};
  
    data.forEach((item) => {
      const category = item.category;
      const region = item.region;
  
      if (!categoryRegionMap[category]) {
        categoryRegionMap[category] = {};
      }
      categoryRegionMap[category][region] = (categoryRegionMap[category][region] || 0) + item.sales;
    });
  
    const result = [];
    for (const category in categoryRegionMap) {
      const regionData = categoryRegionMap[category];
      const categoryEntry: Record<string, string | number> = { category };
      for (const region in regionData) {
        categoryEntry[region] = regionData[region];
      }
      result.push(categoryEntry);
    }
    return result;
  };
  

  const categoryRegionData = getCategoryRegionData();
  const regions = ["North", "East", "West", "South"]; 

  const toggleDateDropdown = () => {
    setShowDateDropdown((prev) => !prev);
  };
  
  const closeDropdown = (e) => {
    if (!e.target.closest(".dropdown-box") && !e.target.closest(".date-dropdown")) {
      setShowDateDropdown(false);
    }
  };
  
  useEffect(() => {
    document.addEventListener("click", closeDropdown);
    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, []);
  
  const toggleCategoryDropdown = () => {
    setShowCategoryDropdown((prev) => !prev);
  };
  
  const toggleRegionDropdown = () => {
    setShowRegionDropdown((prev) => !prev);
  };
  

  const closeDropdowns = (e) => {
    if (!e.target.closest(".dropdown-box") && !e.target.closest(".category-dropdown")) {
      setShowCategoryDropdown(false);
    }
    if (!e.target.closest(".dropdown-box") && !e.target.closest(".region-dropdown")) {
      setShowRegionDropdown(false);
    }
  };
  
  useEffect(() => {
    document.addEventListener("click", closeDropdowns);
    return () => {
      document.removeEventListener("click", closeDropdowns);
    };
  }, []);
  
  const requestSort = (key) => {
    let direction = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  const deleteEntry = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
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
  };

  const totalSales = data.reduce((sum, item) => sum + item.sales, 0);
  const averageSales = (totalSales / data.length).toFixed(2);
  const bestSellingProduct = data.length > 0 
  ? data.reduce((max, item) => (item.sales > max.sales ? item : max), data[0]) 
  : { product: "N/A", sales: 0 };


  const lastPeriodSales = data.slice(-5).reduce((sum, item) => sum + item.sales, 0);
  const salesTrend = totalSales > lastPeriodSales ? '⬆ Increasing' : '⬇ Decreasing';

  const exportData = (format) => {
    let exportContent;
    let fileType;
    let fileName;
    const dataToExport = filteredData.length > 0 ? filteredData : data;
    
    if (format === 'json') {
      exportContent = JSON.stringify(dataToExport, null, 2);
      fileType = 'application/json';
      fileName = 'sales_data.json';
    } else {
      const csvHeaders = "Product,Date,Sales,Inventory,Category,Region";
      const csvRows = dataToExport.map(item => 
        `${item.product},${item.date},${item.sales},${item.inventory},${item.category},${item.region}`
      );
      exportContent = [csvHeaders, ...csvRows].join("\n");
      fileType = 'text/csv';
      fileName = 'sales_data.csv';
    }
    
    const blob = new Blob([exportContent], { type: fileType });
    saveAs(blob, fileName);
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



  const handleThresholdChange = (e) => {
    setThresholdValue(Number(e.target.value));
  };


  const handleDateChange = (e) => {
    setDateRange((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };


  let filteredData = [...data];


  if (dateRange.start && dateRange.end) {
    filteredData = filteredData.filter(
      (item) => item.date >= dateRange.start && item.date <= dateRange.end
    );
  }
  if (selectedCategories.length > 0) {
    filteredData = filteredData.filter((item) => selectedCategories.includes(item.category));
  }
  if (selectedRegions.length > 0) {
    filteredData = filteredData.filter((item) => selectedRegions.includes(item.region));
  }
  if (activeFilter !== "all") {
    if (activeFilter === "highSales") {
      filteredData = filteredData.filter((item) => item.sales >= thresholdValue);
    } else if (activeFilter === "lowSales") {
      filteredData = filteredData.filter((item) => item.sales < thresholdValue);
    } else if (activeFilter === "lowInventory") {
      filteredData = filteredData.filter((item) => item.inventory < 30);
    }
  }
  if (searchTerm) {
    filteredData = filteredData.filter(
      (item) =>
        item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.region.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  if (activeFilter === "highSales") {
    filteredData.sort((a, b) => b.sales - a.sales);
  } else if (activeFilter === "lowSales") {
    filteredData.sort((a, b) => a.sales - b.sales); 
  } else if (activeFilter == "lowInventory") {
    filteredData.sort((a,b) =>a.inventory - b.inventory);
  }

  
  
 

const handleMultiSelectChange = (e, type) => {
  const values = Array.from(e.target.selectedOptions, (option) => option.value);

  if (type === "category") {
    setSelectedCategories(values);
  } else {
    setSelectedRegions(values);
  }
};


  const lineData = data.map((entry, index) => ({
    name: `Day ${index + 1}`,
    value: entry.sales
  }));

  const monthData = Object.values(
    data.reduce((acc, entry) => {
      const month = new Date(entry.date).toLocaleString("default", { month: "long" });
  
      if (!acc[month]) {
        acc[month] = { name: month, value: 0 };
      }
  
      acc[month].value += entry.sales;
      return acc;
    }, {} as Record<string, { name: string; value: number }>)
  ).map((entry, index, arr) => {
    if (index === 0) {
      return { ...entry, growth: null }; 
    }
  
    const prevMonthValue = arr[index - 1].value;
    const growth = ((entry.value - prevMonthValue) / prevMonthValue) * 100; 
    return { ...entry, growth: growth.toFixed(2) }; 
  });

  
  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;
  
    const { value, growth } = payload[0].payload;
    const growthText = growth !== null ? `${growth}%` : "N/A";
    const growthColor = growth !== null && growth > 0 ? "green" : "red"; 
  
    return (
      <div className="custom-tooltip" style={{ background: "white", padding: "10px", border: "1px solid #ccc", borderRadius: "8px", boxShadow: "0px 2px 5px rgba(0,0,0,0.2)" }}>
        <p style={{ fontWeight: "bold", color: "#333" }}>Month: {label}</p>
        <p style={{ fontWeight: "bold", color: "#555" }}>Sales: ${value}</p>
        <p style={{ color: growthColor }}>MoM Growth: {growthText}</p>
      </div>
    );
  };
  

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
  

  let filteredData1 = data;
  
  if (activeFilter !== 'all') {
    if (activeFilter === 'highSales') {
      filteredData1 = data.filter(item => item.sales >= thresholdValue);
    } else if (activeFilter === 'lowSales') {
      filteredData1 = data.filter(item => item.sales < thresholdValue);
    } else if (activeFilter === 'lowInventory') {
      filteredData1 = data.filter(item => item.inventory < 30);
    }
  }
  
  if (searchTerm) {
    filteredData1 = filteredData1.filter(item => 
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.region.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  if (sortConfig.key) {
    filteredData1.sort((a, b) => {
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
    <div className="container">
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
            onClick={() => handleFilterColor('all')}
          >
            All Data
          </button>
          <button 
            className={activeFilter === 'highSales' ? 'active' : ''} 
            onClick={() => handleFilterColor('highSales')}
          >
            High Sales
          </button>
          <button 
            className={activeFilter === 'lowSales' ? 'active' : ''} 
            onClick={() => handleFilterColor('lowSales')}
          >
            Low Sales
          </button>
          <button 
            className={activeFilter === 'lowInventory' ? 'active' : ''} 
            onClick={() => handleFilterColor('lowInventory')}
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
          

          <div className="expt">
            <button onClick={() => exportData('csv')}>Export CSV</button>
            <button onClick={() => exportData('json')}>Export JSON</button>
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

      {/*Summary Sec*/}
      <div className="data-table-container summary-section visible-summary">
          <h2>Summary Statistics</h2>
          <p className='p1'><strong>Total Sales:</strong> ${totalSales} 
            <span className={salesTrend.includes('⬆') ? 'positive-indicator' : 'negative-indicator'}>
              {salesTrend}
            </span>
          </p>
          <p className='p1'><strong>Average Sales:</strong> ${averageSales}</p>
          <p className='p1'><strong>Best Selling Product:</strong> {bestSellingProduct.product} (${bestSellingProduct.sales})</p>
      </div>

      {/* Data Table */}

    <div className="data-table-container">
      <div className="sales-data-header">
        <h2 className="sales-data-header">
          Sales Data
        </h2>
        <span className="filter-icon" onClick={toggleFilter}>
            <FaFilter />
          </span>
      </div> 

 {isFilterOpen && (
  <div className="filter-container">
    <div className="selected-filters">
      {filters.category.length > 0 && (
        <span>Category: {filters.category.map((item) => `+${item}`).join(", ")}</span>
      )}
      {filters.region.length > 0 && (
        <span>Region: {filters.region.map((item) => `+${item}`).join(", ")}</span>
      )}
    </div>

    <label>Category:</label>
    <div className="category-filters">
      {["Electronics", "Furniture", "Appliances"].map((category) => (
        <button 
          key={category} 
          className={filters.category.includes(category) ? "selected" : ""} 
          onClick={() => handleMultiSelect("category", category)}
        >
          {filters.category.includes(category) ? `➖${category}` : `➕${category}`}
        </button>
      ))}
    </div>

    <label>Region:</label>
    <div className="region-filters">
      {["North", "East", "West", "South"].map((region) => (
        <button 
          key={region} 
          className={filters.region.includes(region) ? "selected" : ""} 
          onClick={() => handleMultiSelect("region", region)}
        >
          {filters.region.includes(region) ? `➖${region}` : `➕${region}`}
        </button>
      ))}
    </div>
        <button onClick={applyFilter}>Apply Filter</button>
    </div>
      )}
        
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => requestSort('product')}>
                Product {sortConfig.key === 'product' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th className="date-dropdown" onClick={toggleDateDropdown}>
                Date {sortConfig.key === "date" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                  {showDateDropdown && (
                  <div className="dropdown-box" onClick={(e) => e.stopPropagation()}>
                  <label>Start Date:</label>
                  <input 
                    type="date" 
                    name="start" 
                    value={dateRange.start} 
                    onChange={handleDateChange} 
                    onClick={(e) => { e.stopPropagation(); e.target.showPicker(); }} 
                  />

                  <label>End Date:</label>
                  <input 
                    type="date" 
                    name="end" 
                    value={dateRange.end} 
                    onChange={handleDateChange} 
                    onClick={(e) => { e.stopPropagation(); e.target.showPicker(); }}
                  />
                </div>
                )}
              </th>

              <th onClick={() => requestSort('sales')}>
                Sales ($) {sortConfig.key === 'sales' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('inventory')}>
                Inventory {sortConfig.key === 'inventory' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th className="category-dropdown" onClick={toggleCategoryDropdown}>
                Category {sortConfig.key === "category" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                
              {showCategoryDropdown && (
                <div className="dropdown-box" onClick={(e) => e.stopPropagation()}>
                    <label>Select Categories:</label>
                    <select 
                      multiple 
                      value={selectedCategories} 
                      onChange={(e) => handleMultiSelectChange(e, "category")}
                    >
                      {["Electronics", "Furniture", "Appliances", "Clothing", "Books"].map((category) => (
                        <option 
                          key={category} 
                          value={category} 
                          className="p1"
                          onDoubleClick={() => handleDoubleClick("category", category)} 
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </th>

              <th className="region-dropdown" onClick={toggleRegionDropdown}>
                Region {sortConfig.key === "region" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                
                {showRegionDropdown && (
                  <div className="dropdown-box" onClick={(e) => e.stopPropagation()}>
                    <label>Select Regions:</label>
                    <select 
                      multiple 
                      value={selectedRegions} 
                      onChange={(e) => handleMultiSelectChange(e, "region")}
                    >
                      {["North", "East", "West", "South"].map((region) => (
                        <option 
                          key={region} 
                          value={region} 
                          className="p1"
                          onDoubleClick={() => handleDoubleClick("region", region)} 
                        >
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
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
          
                  <button className="delete-btn" onClick={() => deleteEntry(index)}>Delete</button>
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
                nameKey="name" 
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

        <div className="chart-container">
          <h3>Sales by Category and Region</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryRegionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" angle={0} textAnchor="end" interval={0} label={{ position: 'bottom', offset: 0 }} />
              <YAxis label={{angle: -90, position: 'insideLeft' }} />
              <Tooltip/>
              <Legend />
              {regions.map((region, index) => (
                <Bar key={region} dataKey={region} stackId="1" fill={COLORS[index % COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Month over month growth</h3>
          <ResponsiveContainer width="100%" height={300}>
  <LineChart data={monthData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip content={<CustomTooltip />} />
    <Legend />
    <Line type="monotone" dataKey="value" stroke="#8884d8" />
  </LineChart>
</ResponsiveContainer>

        </div>

        </div>

    </div>
    </div>
    
  );
};

export default SalesDashboard;