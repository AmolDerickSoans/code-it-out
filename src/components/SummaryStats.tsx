import React from 'react';
import { SummaryStatsTypes } from '../types';

interface SummaryStatsProps {
  summaryStats: SummaryStatsTypes;
}

const SummaryStats: React.FC<SummaryStatsProps> = ({ summaryStats }) => {
  return (
    <div className="summary-stats">
      <h2>Dashboard Summary</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Sales</h3>
          <p>${summaryStats.totalSales.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Average Sales</h3>
          <p>${summaryStats.averageSales.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Best Selling Product</h3>
          <p>{summaryStats.bestSellingProduct}</p>
        </div>
        <div className="stat-card">
          <h3>Total Inventory</h3>
          <p>{summaryStats.totalInventory.toLocaleString()} units</p>
        </div>
        <div className="stat-card">
          <h3>Low Inventory Items</h3>
          <p>{summaryStats.lowInventoryItems} products</p>
        </div>
        <div className="stat-card">
          <h3>Month-over-Month Growth</h3>
          <p className={summaryStats.monthOverMonthGrowth >= 0 ? 'positive' : 'negative'}>
            {summaryStats.monthOverMonthGrowth.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryStats;