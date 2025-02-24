import "./SummaryStats.css";

type SalesData = {
  product: string;
  sales: number;
};

type SummaryStatsProps = {
  data: SalesData[];
  prevData?: SalesData[];
};

const SummaryStats: React.FC<SummaryStatsProps> = ({ data, prevData }) => {
  if (!data || data.length === 0) {
    return <p>No data available.</p>;
  }

  const totalSales: number = data.reduce((sum, item) => sum + item.sales, 0);
  const averageSales: number = parseFloat((totalSales / data.length).toFixed(2));
  const bestSellingProduct: SalesData = data.reduce(
    (max, item) => (item.sales > max.sales ? item : max),
    data[0]
  );

  // Previous period metrics
  const prevTotalSales: number = prevData?.reduce((sum, item) => sum + item.sales, 0) || 0;
  const prevAverageSales: number = prevData?.length
    ? parseFloat((prevTotalSales / prevData.length).toFixed(2))
    : 0;

  // Helper function for percentage change
  const getPercentageChange = (current: number, previous: number): string => {
    if (previous === 0) return "∞"; // Prevent division by zero
    return (((current - previous) / previous) * 100).toFixed(2);
  };

  // Calculate performance changes
  const totalSalesChange = parseFloat(getPercentageChange(totalSales, prevTotalSales));
  const avgSalesChange = parseFloat(getPercentageChange(averageSales, prevAverageSales));

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
