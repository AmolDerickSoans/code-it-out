import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Define the expected shape of each data object
type SalesData = {
  date: string;
  sales: number;
};

type LineMonthlySalesProps = {
  data?: SalesData[];
};

const LineMonthlySales: React.FC<LineMonthlySalesProps> = ({ data = [] }) => {
  // Memoize the computed data to avoid unnecessary recalculations
  const trendData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const monthlySales = Array(12).fill(0);

    data.forEach((item) => {
      const date = new Date(item.date);
      if (!isNaN(date.getTime())) {
        const monthIndex = date.getMonth(); // 0-based index (Jan = 0)
        monthlySales[monthIndex] += item.sales;
      }
    });

    let prevSales = 0;
    return monthlySales.map((sales, i) => {
      const growth = prevSales > 0 ? ((sales - prevSales) / prevSales) * 100 : 0;
      prevSales = sales > 0 ? sales : prevSales;
      return { month: i + 1, sales, growth };
    });
  }, [data]); // Runs only when `data` changes

  return (
    <div className="chart-container">
      <h3>Monthly Sales Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trendData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#82ca9d" />
          <Line type="monotone" dataKey="growth" stroke="#ff7300" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(LineMonthlySales);
