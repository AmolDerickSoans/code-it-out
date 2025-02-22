import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface RegionPieChartProps {
  data: { region: string; sales: number }[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#D66D75"];

const RegionPieChart: React.FC<RegionPieChartProps> = ({ data = [] }) => {
  // Memoized function to compute aggregated region sales
  const regionData = useMemo(() => {
    const regionMap: Record<string, number> = {};

    data.forEach((item) => {
      regionMap[item.region] = (regionMap[item.region] || 0) + item.sales;
    });

    return Object.keys(regionMap).map((region) => ({
      name: region,
      value: regionMap[region],
    }));
  }, [data]);

  return (
    <div className="chart-container">
      <h3>Sales by Region</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={regionData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {regionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(RegionPieChart);
