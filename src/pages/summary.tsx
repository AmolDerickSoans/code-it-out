import React,{useState} from 'react'
import { initialData,Item, calculateKeyMetrics,getCategoryData,getRegionData,getMonthlyGrowthData,COLORS } from '../server/services';
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

const Summary = () => {

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
    
      const deleteEntry = (id: number) => {
        const newData = data.filter((item) => item.id !== id);
        setData(newData);
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
    
      const { totalSales, averageSales, bestSellingProduct } =
        calculateKeyMetrics(data);

  return (
    <div className='container'>
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
                    <h3>Sales by category</h3>
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
                            dataKey={Object.keys(getRegionData(data)[0] || {})[index + 1]}
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
  )
}

export default Summary
