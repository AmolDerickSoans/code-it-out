import React from 'react';
import { SummaryStats as SummaryStatsType } from '../types';

interface Props {
    stats: SummaryStatsType;
}

const SummaryStats: React.FC<Props> = ({ stats }) => {
    return (
        <div className="summary-stats">
            <h2>Dashboard Summary</h2>
            <div className="stats-grid">
                <div className="stat-card" role="status">
                    <h3>Total Sales</h3>
                    <p>${stats.totalSales.toLocaleString()}</p>
                </div>
                <div className="stat-card" role="status">
                    <h3>Average Sales</h3>
                    <p>${stats.averageSales.toLocaleString()}</p>
                </div>
                <div className="stat-card" role="status">
                    <h3>Best Selling Product</h3>
                    <p>{stats.bestSellingProduct}</p>
                </div>
                <div className="stat-card" role="status">
                    <h3>Total Inventory</h3>
                    <p>{stats.totalInventory.toLocaleString()} units</p>
                </div>
                <div className="stat-card" role="status">
                    <h3>Low Inventory Items</h3>
                    <p>{stats.lowInventoryItems} products</p>
                </div>
                <div className="stat-card" role="status">
                    <h3>Month-over-Month Growth</h3>
                    <p className={stats.monthOverMonthGrowth >= 0 ? 'positive' : 'negative'}>
                        {stats.monthOverMonthGrowth.toFixed(1)}%
                        <span className="trend-icon">
                            {stats.monthOverMonthGrowth >= 0 ? '↑' : '↓'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default React.memo(SummaryStats); 