import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

interface SalesChartsProps {
  data: { id: number; product: string; date: string; sales: number; inventory: number; category: string; region: string }[];
}

const SalesCharts: React.FC<SalesChartsProps> = ({ data }) => {
  
  // ✅ Monthly Sales Trend Data
  const monthlySalesData = data.reduce((acc, item) => {
    const month = item.date.slice(0, 7); // Extract YYYY-MM
    acc[month] = (acc[month] || 0) + item.sales;
    return acc;
  }, {} as Record<string, number>);

  const trendData = Object.keys(monthlySalesData).map((month) => ({
    month,
    sales: monthlySalesData[month],
  }));

  // ✅ Stacked Bar Chart Data for Category & Region Comparison
  const stackedBarData = data.reduce((acc, item) => {
    const existing = acc.find((entry) => entry.category === item.category);
    if (existing) {
      existing[item.region] = (existing[item.region] || 0) + item.sales;
    } else {
      acc.push({ category: item.category, [item.region]: item.sales });
    }
    return acc;
  }, [] as any[]);

  // ✅ Pie Chart Data for Sales by Region
  const regionSalesData = data.reduce((acc, item) => {
    const region = acc.find((r) => r.name === item.region);
    if (region) {
      region.value += item.sales;
    } else {
      acc.push({ name: item.region, value: item.sales });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // ✅ Custom Tooltip for Bar & Line Charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-3 border shadow-md rounded">
          <h4 className="font-bold text-gray-700">{label}</h4>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-gray-600">
              <span className="font-semibold">{entry.name}:</span> ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="charts-section">
      <h2>Data Visualization</h2>

      {/* ✅ Line Chart - Monthly Sales Trend */}
      <div className="chart-container">
        <h3>Monthly Sales Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ Stacked Bar Chart - Category & Region Comparison */}
      <div className="chart-container">
        <h3>Category & Region Sales Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stackedBarData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="North" stackId="a" fill="#0088FE" />
            <Bar dataKey="South" stackId="a" fill="#00C49F" />
            <Bar dataKey="East" stackId="a" fill="#FFBB28" />
            <Bar dataKey="West" stackId="a" fill="#FF8042" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ Pie Chart - Sales by Region with Interactive Tooltip */}
      <div className="chart-container">
        <h3>Sales by Region</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={regionSalesData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {regionSalesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesCharts;