import { ChangeEvent, FormEvent } from "react";

export interface SummaryStatsTypes {
  totalSales: number;
  averageSales: number;
  bestSellingProduct: string;
  totalInventory: number;
  lowInventoryItems: number;
  monthOverMonthGrowth: number;
}

export interface DataFormProps {
  formData: SalesData;
  formErrors: FormErrors;
  editingId: number | null;
  categoryOptions: string[];
  regionOptions: string[];
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: FormEvent) => void;
  setEditingId: (id: number | null) => void;
  setFormData: React.Dispatch<React.SetStateAction<SalesData>>;
}

export interface DataTableProps {
  data: SalesData[];
  sortConfig: { key: keyof SalesData | null; direction: 'ascending' | 'descending' };
  requestSort: (key: keyof SalesData) => void;
  thresholdValue: number;
  handleEdit: (item: SalesData) => void;
  deleteEntry: (id: number) => void;
}

export interface SearchBarProps {
  searchTerm: string;
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface ExportControlsProps {
  exportFormat: 'csv' | 'json';
  setExportFormat: (format: 'csv' | 'json') => void;
  exportData: () => void;
}

export interface FilterState {
  dateRange: {
    start: string;
    end: string;
  };
  categories: string[];
  regions: string[];
}

export interface FilterControlsProps {
  activeFilter: string;
  handleFilterChange: (filter: string) => void;
  thresholdValue: number;
  handleThresholdChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface BarChartComponentProps {
  data: { name: string; value: number }[];
  title: string;
  color: string;
}

export interface LineChartComponentProps {
  data: { name: string; value: number }[];
  title: string;
}

export interface PieChartComponentProps {
  data: { name: string; value: number }[];
  title: string;
  colors: string[];
}

export interface CategoryMap {
  [key: string]: number;
}

export interface RegionMap {
  [key: string]: number;
}

export interface StackedBarEntry {
  [key: string]: string | number;
  region: string;
}

export interface SalesData {
  id: number;
  product: string;
  date: string;
  sales: number;
  inventory: number;
  category: string;
  region: string;
}

export interface AdvancedFiltersProps {
  filters: FilterState;
  categoryOptions: string[];
  regionOptions: string[];
  handleDateRangeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMultiSelect: (type: 'categories' | 'regions', value: string) => void;
}

export interface FormErrors {
  [key: string]: string;
}