// SummarySection.tsx
import React from 'react';
import { RegionData } from './SalesDashboard';

type Props = {
  totalSales: number;
  averageSales: number;
  bestSellingProduct: { product: string; sales: number };
  bestRegion: RegionData;
  salesPerformance: 'increase' | 'decrease' | 'no-change';
};

const SummarySection: React.FC<Props> = ({ totalSales, averageSales, bestSellingProduct, bestRegion, salesPerformance }) => {
  return (
    <div className="summary-section">
      <div className="summary-item">
        <h3>Total Sales</h3>
        <p>${totalSales.toLocaleString()}</p>
      </div>
      <div className="summary-item">
        <h3>Average Sales</h3>
        <p>${averageSales.toFixed(2)}</p>
      </div>
      <div className="summary-item">
        <h3>Best Selling Product</h3>
        <p>{bestSellingProduct.product} (${bestSellingProduct.sales})</p>
      </div>
      <div className="summary-item">
        <h3>Best Region</h3>
        <p>{bestRegion.region} (${bestRegion.sales})</p>
      </div>
      <div className="performance-change">
        <h3 id="salesper">Sales Performance</h3>
        <p className={`performance-indicator ${salesPerformance}`}>
          {salesPerformance === 'increase' && '📈 Sales Increased'}
          {salesPerformance === 'decrease' && '📉 Sales Decreased'}
          {salesPerformance === 'no-change' && '📊 No Change'}
        </p>
      </div>
    </div>
  );
};

export default SummarySection;
