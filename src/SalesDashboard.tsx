import React, { useState, useEffect } from 'react';
import SalesForm from './SalesForm';
import SalesTable from './SalesTable';
import FilterControls from './FilterControls';
import AdvancedFilters from './AdvancedFilter'; 
import SummarySection from './SummarySection';
import ChartsSection from './ChartsSection';
import './SalesDashboard.css';


export type SalesData = {
  id: number;
  product: string;
  date: string;
  sales: number;
  inventory: number;
  category: string;
  region: string;
};

export type FormData = {
  product: string;
  date: string;
  sales: string;
  inventory: string;
  category: string;
  region: string;
};

export type RegionData = {
  region: string;
  sales: number;
};

const initialData: SalesData[] = [
  { id: 1, product: "Laptop XZ-2000", date: "2024-01-01", sales: 1500, inventory: 32, category: "Electronics", region: "North" },
  { id: 2, product: "Smart Watch V3", date: "2024-01-02", sales: 900, inventory: 45, category: "Electronics", region: "East" },
  { id: 3, product: "Ergonomic Chair", date: "2024-01-03", sales: 2100, inventory: 18, category: "Furniture", region: "West" },
  { id: 4, product: "Wireless Earbuds", date: "2024-01-04", sales: 750, inventory: 55, category: "Electronics", region: "South" },
  { id: 5, product: "Office Desk", date: "2024-01-05", sales: 1200, inventory: 24, category: "Furniture", region: "North" },
  { id: 6, product: "Coffee Maker", date: "2024-01-06", sales: 600, inventory: 38, category: "Appliances", region: "East" },
  { id: 7, product: "Bluetooth Speaker", date: "2024-01-07", sales: 450, inventory: 62, category: "Electronics", region: "West" },
  { id: 8, product: "Standing Desk", date: "2024-01-08", sales: 1800, inventory: 15, category: "Furniture", region: "South" },
];

export const allCategories = ["Electronics", "Furniture", "Appliances", "Clothing", "Books"];
export const allRegions = ["North", "South", "East", "West"];
export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const SalesDashboard: React.FC = () => {
  const [data, setData] = useState<SalesData[]>(initialData);
  const [formData, setFormData] = useState<FormData>({
    product: '',
    date: '',
    sales: '',
    inventory: '',
    category: '',
    region: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [thresholdValue, setThresholdValue] = useState(1000);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [filteredSalesData, setFilteredSalesData] = useState<SalesData[]>(data);

  const totalSales = data.reduce((acc, curr) => acc + curr.sales, 0);
  const averageSales = data.length ? totalSales / data.length : 0;
  const bestSellingProduct = data.reduce((max, curr) => (curr.sales > max.sales ? curr : max), data[0]);
  const getRegionData = () => {
    const regionMap: { [key: string]: number } = {};
    data.forEach(item => {
      regionMap[item.region] = (regionMap[item.region] || 0) + item.sales;
    });
    return Object.keys(regionMap).map(region => ({ region, sales: regionMap[region] }));
  };
  const bestRegion = getRegionData().reduce((max, curr) => (curr.sales > max.sales ? curr : max), getRegionData()[0]);

  const [previousPeriodSales, setPreviousPeriodSales] = useState<number | null>(null);
  const [salesPerformance, setSalesPerformance] = useState<'increase' | 'decrease' | 'no-change'>('no-change');

  useEffect(() => {
    if (previousPeriodSales !== null) {
      if (totalSales > previousPeriodSales) setSalesPerformance('increase');
      else if (totalSales < previousPeriodSales) setSalesPerformance('decrease');
      else setSalesPerformance('no-change');
    }
    setPreviousPeriodSales(totalSales);
  }, [totalSales]);

  let basicFilteredData = data;
  if (activeFilter !== 'all') {
    if (activeFilter === 'highSales') {
      basicFilteredData = data.filter(item => item.sales >= thresholdValue);
    } else if (activeFilter === 'lowSales') {
      basicFilteredData = data.filter(item => item.sales < thresholdValue);
    } else if (activeFilter === 'lowInventory') {
      basicFilteredData = data.filter(item => item.inventory < 30);
    }
  }
  if (searchTerm) {
    basicFilteredData = basicFilteredData.filter(item =>
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.region.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const finalTableData = basicFilteredData.filter(item => {
    if (!startDate && !endDate && selectedCategories.length === 0 && selectedRegions.length === 0) {
      return true;
    }
    const matchesDate = (startDate && endDate)
      ? new Date(item.date) >= new Date(startDate) && new Date(item.date) <= new Date(endDate)
      : true;
    const matchesCategory = selectedCategories.length
      ? selectedCategories.includes(item.category)
      : true;
    const matchesRegion = selectedRegions.length
      ? selectedRegions.includes(item.region)
      : true;
    return matchesDate && matchesCategory && matchesRegion;
  });

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedCategories(prev =>
      prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
    );
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedRegions(prev =>
      prev.includes(value) ? prev.filter(r => r !== value) : [...prev, value]
    );
  };

  const computeRegionSalesData = (): RegionData[] => {
    const regionMap: { [key: string]: number } = {};
    data.forEach(item => {
      regionMap[item.region] = (regionMap[item.region] || 0) + item.sales;
    });
    return Object.keys(regionMap).map(region => ({ region, sales: regionMap[region] }));
  };

  const getStackedBarData = (): { category: string; [region: string]: number | string }[] => {
    const result: { category: string; [region: string]: number | string }[] = [];
    allCategories.forEach(category => {
      const row: any = { category };
      allRegions.forEach(region => {
        row[region] = data
          .filter(item => item.category === category && item.region === region)
          .reduce((sum, item) => sum + item.sales, 0);
      });
      result.push(row);
    });
    return result;
  };

  const getMonthlyTrendData = (): { month: string; sales: number }[] => {
    const monthMap: { [key: string]: number } = {};
    data.forEach(item => {
      const dateObj = new Date(item.date);
      const monthYear = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
      monthMap[monthYear] = (monthMap[monthYear] || 0) + item.sales;
    });
    const trendData = Object.keys(monthMap).map(month => ({ month, sales: monthMap[month] }));
    trendData.sort((a, b) => a.month.localeCompare(b.month));
    return trendData;
  };

  const regionData = computeRegionSalesData();
  // const stackedBarData = getStackedBarData();
  // const monthlyTrendData = getMonthlyTrendData();

  const deleteEntry = (id: number) => setData(data.filter(item => item.id !== id));
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const salesValue = Number(formData.sales);
    const inventoryValue = Number(formData.inventory);
    if (editingId) {
      setData(data.map(item => item.id === editingId ? { ...formData, sales: salesValue, inventory: inventoryValue, id: editingId } : item));
      setEditingId(null);
    } else {
      const newId = data.length ? Math.max(...data.map(item => item.id)) + 1 : 1;
      setData([...data, { ...formData, sales: salesValue, inventory: inventoryValue, id: newId }]);
    }
    setFormData({ product: '', date: '', sales: '', inventory: '', category: '', region: '' });
  };
  const handleEdit = (item: SalesData) => {
    setFormData({ product: item.product, date: item.date, sales: item.sales.toString(), inventory: item.inventory.toString(), category: item.category, region: item.region });
    setEditingId(item.id);
  };
  const handleCancel = () => {
    setEditingId(null);
    setFormData({ product: '', date: '', sales: '', inventory: '', category: '', region: '' });
  };

  type SortKey = 'product' | 'date' | 'sales' | 'inventory' | 'category' | 'region' | null;
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' }>({
    key: null,
    direction: 'ascending'
  });

  const handleExportCSV = () => {
    const formatDate = (date: string | Date): string => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${month}/${day}/${dateObj.getFullYear()}`;
    };
    // Export using finalTableData
    const exportData = finalTableData.map(item => ({
      product: item.product,
      date: formatDate(item.date),
      sales: item.sales,
      inventory: item.inventory,
      category: item.category,
      region: item.region,
    }));
    const headers = Object.keys(exportData[0]).join(',');
    const rows = exportData.map(row => Object.values(row).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sales_data.csv';
    link.click();
  };
  const applyFilters = () => {
    const filtered = data.filter(item => {
      const matchesDate = (startDate && endDate)
        ? new Date(item.date) >= new Date(startDate) && new Date(item.date) <= new Date(endDate)
        : true;
  
      const matchesCategory = selectedCategories.length
        ? selectedCategories.includes(item.category)
        : true;
  
      const matchesRegion = selectedRegions.length
        ? selectedRegions.includes(item.region)
        : true;
  
      return matchesDate && matchesCategory && matchesRegion;
    });
  
    setFilteredSalesData(filtered);
  };
  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSelectedCategories([]);
    setSelectedRegions([]);
    setFilteredSalesData(data);
  };
    

  return (
    <div className="sales-dashboard">
      <h1>Sales Dashboard</h1>
      <FilterControls 
        searchTerm={searchTerm} 
        handleSearch={(e) => setSearchTerm(e.target.value)}
        activeFilter={activeFilter}
        handleFilterChange={setActiveFilter}
        thresholdValue={thresholdValue}
        handleThresholdChange={(e) => setThresholdValue(Number(e.target.value))}
      />
      
      <SalesForm 
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        editingId={editingId}
        handleCancel={handleCancel}
      />
      
      <AdvancedFilters
        startDate={startDate} 
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        selectedCategories={selectedCategories}
        handleCategoryChange={handleCategoryChange}
        selectedRegions={selectedRegions}
        handleRegionChange={handleRegionChange}
        allCategories={allCategories}
        allRegions={allRegions}
        applyFilters={applyFilters} 
        resetFilters={resetFilters}
      />

      <SalesTable 
        data={finalTableData} 
        sortConfig={sortConfig} 
        requestSort={() => {}}
        deleteEntry={deleteEntry}
        handleEdit={handleEdit}
        thresholdValue={thresholdValue}
      />
 
      <SummarySection 
        totalSales={totalSales}
        averageSales={averageSales}
        bestSellingProduct={bestSellingProduct}
        bestRegion={bestRegion}
        salesPerformance={salesPerformance}
      />
      
      <div className="export-buttons">
        <button onClick={handleExportCSV}>Export CSV</button>
      </div>
      
      <ChartsSection 
        regionData={regionData}
        stackedBarData={getStackedBarData()}
        monthlyTrendData={getMonthlyTrendData()}
        allRegions={allRegions}
        COLORS={COLORS}
      />
    </div>
  );
};

export default SalesDashboard;
