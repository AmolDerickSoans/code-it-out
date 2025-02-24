import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Define the type for each data item
type SalesData = {
  category: string;
  region: string;
  sales: number;
};

const getRegionColor = (region: string) => {
  const colorMap: Record<string, string> = {
    North: "#8884d8",
    South: "#82ca9d",
    East: "#ffc658",
    West: "#ff7300",
  };
  return colorMap[region] || "#ccc";
};

type Props = {
  data: SalesData[];
};

const CategorySalesBarGraph: React.FC<Props> = ({ data = [] }) => {
  // Get unique regions
  const regions = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.region)));
  }, [data]);

  // Memoize category-region sales aggregation
  const categoryRegionData = useMemo(() => {
    const categoryMap: Record<string, Record<string, number>> = {};

    data.forEach((item) => {
      if (!categoryMap[item.category]) {
        categoryMap[item.category] = {};
      }
      categoryMap[item.category][item.region] =
        (categoryMap[item.category][item.region] || 0) + item.sales;
    });

    return Object.keys(categoryMap).map((category) => {
      const categoryEntry: Record<string, string | number> = { name: category };
      Object.keys(categoryMap[category]).forEach((region) => {
        categoryEntry[region] = categoryMap[category][region];
      });
      return categoryEntry;
    });
  }, [data]); // Runs only when `data` changes

  return (
    <div className="chart-container">
      <h3>Sales by Category</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={categoryRegionData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {regions.map((region) => (
            <Bar key={region} dataKey={region} stackId="a" fill={getRegionColor(region)} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(CategorySalesBarGraph);
