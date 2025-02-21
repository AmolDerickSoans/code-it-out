import React, { useState } from "react";
import {
  initialData,
  getCategoryData,
  getMonthlyGrowthData,
  getRegionData,
  COLORS,
  categoryOptions,
  regionOptions,
} from "./server/services";
import Select from 'react-select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { calculateKeyMetrics } from "./server/services";

interface Item {
  id: number;
  product: string;
  date: string;
  sales: number;
  inventory: number;
  category: string;
  region: string;
}

const SalesDashboard = () => {
  const [data, setData] = useState(initialData);
  const [formData, setFormData] = useState({
    product: "",
    date: "",
    sales: "",
    inventory: "",
    category: "",
    region: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: string;
  }>({
    key: null,
    direction: "ascending",
  });
  const [activeFilter, setActiveFilter] = useState("all");
  const [thresholdValue, setThresholdValue] = useState(1000);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const deleteEntry = (id: number) => {
    const newData = data.filter((item) => item.id !== id);
    setData(newData);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    const salesValue = Number(formData.sales);
    const inventoryValue = Number(formData.inventory);

    if (editingId) {
      const updatedData = data.map((item) =>
        item.id === editingId
          ? {
              ...formData,
              sales: salesValue,
              inventory: inventoryValue,
              id: editingId,
            }
          : item
      );
      setData(updatedData);
      setEditingId(null);
    } else {
      const newId =
        data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1;
      setData([
        ...data,
        {
          ...formData,
          sales: salesValue,
          inventory: inventoryValue,
          id: newId,
        },
      ]);
    }

    setFormData({
      product: "",
      date: "",
      sales: "",
      inventory: "",
      category: "",
      region: "",
    });
  };

  const handleEdit = (item: Item) => {
    setFormData({
      product: item.product,
      date: item.date,
      sales: item.sales.toString(),
      inventory: item.inventory.toString(),
      category: item.category,
      region: item.region,
    });
    setEditingId(item.id);
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

  const requestSort = (key: string | null) => {
    let direction = "ascending";

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  const lineData = data.map((entry, index) => ({
    name: `Day ${index + 1}`,
    value: entry.sales,
  }));

  let filteredData = data;

  if (activeFilter !== "all") {
    if (activeFilter === "highSales") {
      filteredData = data.filter((item) => item.sales >= thresholdValue);
    } else if (activeFilter === "lowSales") {
      filteredData = data.filter((item) => item.sales < thresholdValue);
    } else if (activeFilter === "lowInventory") {
      filteredData = data.filter((item) => item.inventory < 30);
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

  if (selectedCategories.length > 0) {
    filteredData = filteredData.filter((item) =>
      selectedCategories.includes(item.category)
    );
  }

  if (selectedRegions.length > 0) {
    filteredData = filteredData.filter((item) =>
      selectedRegions.includes(item.region)
    );
  }

  if (startDate || endDate) {
    filteredData = filteredData.filter((item) => {
      const itemDate = new Date(item.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      return (
        (!start || itemDate >= start) &&
        (!end || itemDate <= end)
      );
    });
  }

  if (sortConfig.key) {
    filteredData.sort((a, b) => {
      const key = sortConfig.key as keyof typeof a;
      if (a[key] < b[key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }

  const { totalSales, averageSales, bestSellingProduct } =
    calculateKeyMetrics(data);

  return (
    <div className="App">
      <div className="sales-dashboard">
        <div className="content-section">
          <div className="search-bar">
            <input
              id="Search"
              type="text"
              placeholder="Search products, categories, regions..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="filter-controls">
            <button
              className={activeFilter === "all" ? "active" : ""}
              onClick={() => handleFilterChange("all")}
            >
              All Data
            </button>
            <button
              className={activeFilter === "highSales" ? "active" : ""}
              onClick={() => handleFilterChange("highSales")}
            >
              High Sales
            </button>
            <button
              className={activeFilter === "lowSales" ? "active" : ""}
              onClick={() => handleFilterChange("lowSales")}
            >
              Low Sales
            </button>
            <button
              className={activeFilter === "lowInventory" ? "active" : ""}
              onClick={() => handleFilterChange("lowInventory")}
            >
              Low Inventory
            </button>

            <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e)=>{setStartDate(e.target.value)}}
            />
          </label>

          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e)=>{setEndDate(e.target.value)}}
            />
          </label>

            <label>
              Categories:
              <Select
              isMulti
              options={categoryOptions}
              value={categoryOptions.filter(option => selectedCategories.includes(option.value))}
              onChange={(e) => setSelectedCategories(e.map(option => option.value as string))}
              className="text-sm"
            />
            </label>

            <label>
              Regions:
              <Select
              isMulti
              options={regionOptions}
              value={regionOptions.filter(option => selectedRegions.includes(option.value))}
              onChange={(e) => setSelectedRegions(e.map(option => option.value as string))}
              className="text-sm"
            />
            </label>

            <label>
              Threshold:
              <input
                id="thresholdvalue"
                type="number"
                value={thresholdValue}
                onChange={handleThresholdChange}
                min="0"
              />
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="data-form">
          <h2>{editingId ? "Edit Entry" : "Add New Entry"}</h2>

          <div className="form-row">
            <div className="form-group">
              <label>
                Product
                <input
                  type="text"
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <div className="form-group">
              <label>
                Date
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Sales ($)
                <input
                  type="number"
                  name="sales"
                  value={formData.sales}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <div className="form-group">
              <label>
                Inventory
                <input
                  type="number"
                  name="inventory"
                  value={formData.inventory}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
          </div>


          <div className="form-row">
            <div className="form-group">
              <label>
                Category
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
              </label>
            </div>

            <div className="form-group">
              <label>
                Region
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
              </label>
            </div>
          </div>

          <button type="submit">
            {editingId ? "Update Entry" : "Add Entry"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  product: "",
                  date: "",
                  sales: "",
                  inventory: "",
                  category: "",
                  region: "",
                });
              }}
            >
              Cancel
            </button>
          )}
        </form>

        <div className="data-table-container">
          <h2>Sales Data</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => requestSort("product")}>
                  Product{" "}
                  {sortConfig.key === "product" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th onClick={() => requestSort("date")}>
                  Date{" "}
                  {sortConfig.key === "date" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th onClick={() => requestSort("sales")}>
                  Sales ($){" "}
                  {sortConfig.key === "sales" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th onClick={() => requestSort("inventory")}>
                  Inventory{" "}
                  {sortConfig.key === "inventory" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th onClick={() => requestSort("category")}>
                  Category{" "}
                  {sortConfig.key === "category" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th onClick={() => requestSort("region")}>
                  Region{" "}
                  {sortConfig.key === "region" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((entry, index) => (
                <tr
                  key={index}
                  className={entry.sales >= thresholdValue ? "high-sales" : ""}
                >
                  <td>{entry.product}</td>
                  <td>{entry.date}</td>
                  <td>{entry.sales}</td>
                  <td>{entry.inventory}</td>
                  <td>{entry.category}</td>
                  <td>{entry.region}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(entry)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
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

        <div className="sales-dashboard">
          <h1>Dashboard Summary</h1>

          {/* Summary Section */}
          <div className="summary-section">
            <h2>Key Metrics</h2>
            <div className="metric">
              <span>Total Sales:</span>
              <span>${totalSales.toFixed(2)}</span>
            </div>
            <div className="metric">
              <span>Average Sales:</span>
              <span>${averageSales.toFixed(2)}</span>
            </div>
            <div className="metric">
              <span>Best-Selling Product:</span>
              <span>{bestSellingProduct}</span>
            </div>
          </div>

          {/* Rest of your dashboard components */}
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
              <BarChart data={getCategoryData(data)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#1a461a" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3>Sales by Region</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getRegionData(data)}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3>Sales by Region</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getRegionData(data)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {COLORS.map((color, index) => (
                  <Bar
                    key={index}
                    dataKey={
                      Object.keys(getRegionData(data)[0] || {})[index + 1]
                    }
                    fill={color}
                    stackId="a"
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>

            <div className="chart-container">
              <h3>Monthly Sales Growth</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getMonthlyGrowthData(data)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#fae900" />
                  <Line type="monotone" dataKey="growth" stroke="#00ffe5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
