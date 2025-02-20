export interface SalesData {
    id: number;
    product: string;
    date: string;
    sales: number;
    inventory: number;
    category: string;
    region: string;
}

export interface SummaryStats {
    totalSales: number;
    averageSales: number;
    bestSellingProduct: string;
    totalInventory: number;
    lowInventoryItems: number;
    monthOverMonthGrowth: number;
}

export interface FilterState {
    dateRange: {
        start: string;
        end: string;
    };
    categories: string[];
    regions: string[];
}

export interface FormData {
    product: string;
    date: string;
    sales: string;
    inventory: string;
    category: string;
    region: string;
}

export interface FormErrors {
    product: string;
    date: string;
    sales: string;
    inventory: string;
    category: string;
    region: string;
}

export type SortDirection = 'ascending' | 'descending';

export interface SortConfig {
    key: keyof SalesData | null;
    direction: SortDirection;
} 