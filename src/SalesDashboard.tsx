import React, { useState, ChangeEvent, FormEvent } from "react";
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
import { filterBySelectedValues } from "./utils/filterUtils";

interface SalesData {
  id: number;
  product: string;
  date: string;
  sales: number;
  inventory: number;
  category: string;
  region: string;
}

interface FormData {
  product: string;
  date: string;
  sales: string;
  inventory: string;
  category: string;
  region: string;
}

interface SortConfig {
  key: keyof SalesData | null;
  direction: "ascending" | "descending";
}

const initialData: SalesData[] = [
  {
    id: 1,
    product: "Laptop XZ-2000",
    date: "2024-01-01",
    sales: 1500,
    inventory: 32,
    category: "Electronics",
    region: "North",
  },
  {
    id: 2,
    product: "Smart Watch V3",
    date: "2024-01-02",
    sales: 900,
    inventory: 45,
    category: "Electronics",
    region: "East",
  },
  {
    id: 3,
    product: "Ergonomic Chair",
    date: "2024-01-03",
    sales: 2100,
    inventory: 18,
    category: "Furniture",
    region: "West",
  },
  {
    id: 4,
    product: "Wireless Earbuds",
    date: "2024-01-04",
    sales: 750,
    inventory: 55,
    category: "Electronics",
    region: "South",
  },
  {
    id: 5,
    product: "Office Desk",
    date: "2024-01-05",
    sales: 1200,
    inventory: 24,
    category: "Furniture",
    region: "North",
  },
  {
    id: 6,
    product: "Coffee Maker",
    date: "2024-01-06",
    sales: 600,
    inventory: 38,
    category: "Appliances",
    region: "East",
  },
  {
    id: 7,
    product: "Bluetooth Speaker",
    date: "2024-01-07",
    sales: 450,
    inventory: 62,
    category: "Electronics",
    region: "West",
  },
  {
    id: 8,
    product: "Standing Desk",
    date: "2024-01-08",
    sales: 1800,
    inventory: 15,
    category: "Furniture",
    region: "South",
  },
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
];

const SalesDashboard: React.FC = () => {
  const [data, setData] = useState<SalesData[]>(initialData);
  const [formData, setFormData] = useState<FormData>({
    product: "",
    date: "",
    sales: "",
    inventory: "",
    category: "",
    region: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "ascending",
  });
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [thresholdValue, setThresholdValue] = useState<number>(1000);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  const deleteEntry = (id: number) => {
    const newData = data.filter((item) => item.id !== id);
    setData(newData);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.product ||
      !formData.date ||
      !formData.sales ||
      !formData.inventory ||
      !formData.category ||
      !formData.region
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    const salesValue = Number(formData.sales);
    const inventoryValue = Number(formData.inventory);

    if (isNaN(salesValue) || isNaN(inventoryValue)) {
      alert("Sales and Inventory must be valid numbers.");
      return;
    }

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
      const newId = data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1;
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

  const handleEdit = (item: SalesData) => {
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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
    let direction: "ascending" | "descending" = "ascending";

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  const lineData = data.map((entry, index) => ({
    name: `Day ${index + 1}`,
    value: entry.sales,
  }));

  const getCategoryData = () => {
    const categoryMap: Record<string, number> = {};
    data.forEach((item) => {
      if (categoryMap[item.category]) {
        categoryMap[item.category] += item.sales;
      } else {
        categoryMap[item.category] = item.sales;
      }
    });

    return Object.keys(categoryMap).map((category) => ({
      name: category,
      value: categoryMap[category],
    }));
  };

  const getRegionData = () => {
    const regionMap: Record<string, number> = {};

    data.forEach((item) => {
      if (item.region && typeof item.sales === "number") {
        if (regionMap[item.region]) {
          regionMap[item.region] += item.sales;
        } else {
          regionMap[item.region] = item.sales;
        }
      }
    });

    return Object.keys(regionMap).map((region) => ({
      name: region,
      value: regionMap[region],
    }));
  };

  const getCategoryRegionData = () => {
    const categoryRegionMap: Record<string, Record<string, number>> = {};

    data.forEach((item) => {
      if (!categoryRegionMap[item.category]) {
        categoryRegionMap[item.category] = {};
      }
      if (categoryRegionMap[item.category][item.region]) {
        categoryRegionMap[item.category][item.region] += item.sales;
      } else {
        categoryRegionMap[item.category][item.region] = item.sales;
      }
    });

    return Object.keys(categoryRegionMap).map((category) => ({
      category,
      ...categoryRegionMap[category],
    }));
  };

  let filteredData = data;

  if (activeFilter !== "all") {
    if (activeFilter === "highSales") {
      filteredData = data.filter((item) => item.sales >= thresholdValue);
      filteredData.sort((a, b) => b.sales - a.sales);
    } else if (activeFilter === "lowSales") {
      filteredData = data.filter((item) => item.sales > thresholdValue);
      filteredData.sort((a, b) => a.sales - b.sales);
    } else if (activeFilter === "lowInventory") {
      filteredData = data.filter((item) => item.sales > thresholdValue);
      filteredData.sort((a, b) => a.inventory - b.inventory);
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

  if (sortConfig.key) {
    filteredData.sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key!] > b[sortConfig.key!]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }

  const totalSales = data.reduce((acc, item) => acc + item.sales, 0);
  const averageSales = data.length > 0 ? (totalSales / data.length).toFixed(2) : "0";
  const bestSellingProduct = data.reduce(
    (prev, current) => (prev.sales > current.sales ? prev : current),
    data[0]
  );

  filteredData = filterBySelectedValues(
    filteredData,
    selectedCategories,
    "category"
  );
  filteredData = filterBySelectedValues(
    filteredData,
    selectedRegions,
    "region"
  );

  const exportToCSV = () => {
    const csvRows = [];
    const headers = Object.keys(filteredData[0]);
    csvRows.push(headers.join(","));

    for (const row of filteredData) {
      csvRows.push(
        headers
          .map((fieldName) =>
            JSON.stringify(row[fieldName as keyof SalesData], (key, value) =>
              value === null ? "" : value
            )
          )
          .join(",")
      );
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "filtered_sales_data.csv");
    a.click();
  };

  const exportToJSON = () => {
    const jsonString = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "filtered_sales_data.json");
    a.click();
  };

  return (
    <div className="sales-dashboard">
      <h1>Sales Dashboard</h1>

      <div className="content-section">
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
            Threshold:
            <input
              type="number"
              value={thresholdValue}
              onChange={handleThresholdChange}
              min="0"
            />
          </label>
        </div>

        <div style={{ color: "black" }}>
          <h3>Filter by Category</h3>
          {["Electronics", "Furniture", "Appliances", "Clothing", "Books"].map(
            (category) => (
              <label key={category}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => {
                    setSelectedCategories((prev) =>
                      prev.includes(category)
                        ? prev.filter((c) => c !== category)
                        : [...prev, category]
                    );
                  }}
                />
                {category}
              </label>
            )
          )}
        </div>

        <div style={{ color: "black" }}>
          <h3>Filter by Region</h3>
          {["North", "South", "East", "West"].map((region) => (
            <label key={region}>
              <input
                type="checkbox"
                checked={selectedRegions.includes(region)}
                onChange={() => {
                  setSelectedRegions((prev) =>
                    prev.includes(region)
                      ? prev.filter((r) => r !== region)
                      : [...prev, region]
                  );
                }}
              />
              {region}
            </label>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="data-form">
        <h2>{editingId ? "Edit Entry" : "Add New Entry"}</h2>

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
            {filteredData.map((entry) => (
              <tr
                key={entry.id}
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
      <div className="export-buttons">
        <button onClick={exportToCSV}>Export to CSV</button>
        <button onClick={exportToJSON}>Export to JSON</button>
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
                label
              >
                {getRegionData().map((entry, index) => (
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

          <div className="summary-statistics">
            <h3>Summary Statistics</h3>
            <h1>Total Sales: ${totalSales}</h1>
            <h1>Average Sales: ${averageSales}</h1>
            <h1>
              Best-Selling Product: {bestSellingProduct.product} ($
              {bestSellingProduct.sales})
            </h1>
          </div>
        </div>

        <div className="chart-container">
          <h3>Sales by Category and Region</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getCategoryRegionData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="North" stackId="a" fill="#0088FE" />
              <Bar dataKey="South" stackId="a" fill="#FF8042" />
              <Bar dataKey="East" stackId="a" fill="#00C49F" />
              <Bar dataKey="West" stackId="a" fill="#FFBB28" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
