export const initialData = [
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

export const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
];

export interface Item {
  id: number;
  product: string;
  date: string;
  sales: number;
  inventory: number;
  category: string;
  region: string;
}

export const calculateKeyMetrics = (data: Item[]) => {
  const totalSales = data.reduce((acc, item) => acc + item.sales, 0);
  const averageSales = totalSales / data.length || 0;

  const salesByProduct: Record<string, number> = data.reduce((acc, item) => {
    acc[item.product] = (acc[item.product] || 0) + item.sales;
    return acc;
  }, {} as Record<string, number>);

  const bestSellingProduct = Object.keys(salesByProduct).reduce((a, b) =>
    salesByProduct[a] > salesByProduct[b] ? a : b
  );

  return {
    totalSales,
    averageSales,
    bestSellingProduct,
  };
};

export const getCategoryData = (data: Item[]) => {
  const categoryMap: { [key: string]: number } = {};
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

export const getMonthlyGrowthData = (data:Item[]) => {
    const monthlyData: { month: string; sales: number }[] = [];

    data.forEach((item) => {
      const month = item.date.slice(0, 7); // Get YYYY-MM
      const existingEntry = monthlyData.find((entry) => entry.month === month);
      if (existingEntry) {
        existingEntry.sales += item.sales;
      } else {
        monthlyData.push({ month, sales: item.sales });
      }
    });

    const growthData = monthlyData.map((entry, index) => {
      const previousSales = index > 0 ? monthlyData[index - 1].sales : 0;
      const growth = previousSales
        ? ((entry.sales - previousSales) / previousSales) * 100
        : 0;
      return { ...entry, growth };
    });

    return growthData;
  };

export const getRegionData = (data:Item[]) => {
    const regionMap: { [key: string]: number } = {};

    data.forEach((item) => {
      if (regionMap[item.region]) {
        regionMap[item.region] += item.sales;
      } else {
        regionMap[item.region] = item.sales;
      }
    });

    return Object.keys(regionMap).map((region) => ({
      name: region,
      value: regionMap[region],
    }));
  };