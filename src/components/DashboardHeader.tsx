import React from 'react';

interface Props {
    totalSales: number;
    salesGrowth: number;
}

const DashboardHeader: React.FC<Props> = ({ totalSales, salesGrowth }) => {
    return (
        <header className="dashboard-header">
            <div className="header-content">
                <div className="header-title">
                    <h1>Sales Dashboard</h1>
                    <p className="subtitle">Real-time sales analytics and insights</p>
                </div>
                <div className="header-stats">
                    <div className="quick-stat">
                        <span className="stat-label">Total Sales</span>
                        <span className="stat-value">${totalSales.toLocaleString()}</span>
                    </div>
                    <div className="quick-stat">
                        <span className="stat-label">Growth</span>
                        <span className={`stat-value ${salesGrowth >= 0 ? 'positive' : 'negative'}`}>
                            {salesGrowth >= 0 ? '↑' : '↓'} {Math.abs(salesGrowth).toFixed(1)}%
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader; 