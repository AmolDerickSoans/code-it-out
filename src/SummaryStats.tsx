import { useState, useEffect } from "react";
import "./SummaryStats.css"; // Import the CSS file for styling

const SummaryStats = ({ data, prevData }) => {
  if (!data || data.length === 0) {
    return <p>No data available.</p>;
  }

  const totalSales = data.reduce((sum, item) => sum + item.sales, 0);
  const averageSales = (totalSales / data.length).toFixed(2);
  const bestSellingProduct = data.reduce((max, item) =>
    item.sales > max.sales ? item : max,
    data[0]
  );

  // Calculate previous period metrics for comparison
  const prevTotalSales = prevData?.reduce((sum, item) => sum + item.sales, 0) || 0;
  const prevAverageSales = prevData?.length ? (prevTotalSales / prevData.length).toFixed(2) : 0;

  // Helper function for percentage change
  const getPercentageChange = (current, previous) => {
    if (previous === 0) return "∞"; // Prevent division by zero
    return (((current - previous) / previous) * 100).toFixed(2);
  };

  // Calculate performance changes
  const totalSalesChange = getPercentageChange(totalSales, prevTotalSales);
  const avgSalesChange = getPercentageChange(averageSales, prevAverageSales);

  return (
    <div className="summary-container">
      <h2 className="summary-title">Summary Statistics</h2>

      <div className="summary-grid">
        {/* Total Sales */}
        <div className="summary-card">
          <p className="summary-label">Total Sales</p>
          <p className="summary-value">${totalSales}</p>
          <p className={`summary-change ${totalSalesChange >= 0 ? "positive" : "negative"}`}>
            {totalSalesChange >= 0 ? "▲" : "▼"} {totalSalesChange}%
          </p>
        </div>

        {/* Average Sales */}
        <div className="summary-card">
          <p className="summary-label">Average Sales</p>
          <p className="summary-value">${averageSales}</p>
          <p className={`summary-change ${avgSalesChange >= 0 ? "positive" : "negative"}`}>
            {avgSalesChange >= 0 ? "▲" : "▼"} {avgSalesChange}%
          </p>
        </div>

        {/* Best-Selling Product */}
        <div className="summary-card">
          <p className="summary-label">Best-Selling Product</p>
          <p className="summary-product">{bestSellingProduct.product}</p>
          <p className="summary-sales">(${bestSellingProduct.sales})</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryStats;
