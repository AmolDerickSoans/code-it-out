import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function LineDailySales({ data = [] }) {
  // Ensure `data` is valid before mapping
  const lineData = data.map((entry, index) => ({
    name: `Day ${index + 1}`,
    value: entry.sales,
  }));

  return (
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
  );
}
