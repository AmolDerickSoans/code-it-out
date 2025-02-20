import React from "react";

interface SalesSummaryProps {
  totalSales: number;
  avgSales: string;
  bestSellingProduct: {
    product: string;
    sales: number;
  };
  prevTotalSales?: number;  // Optional for tracking performance
  prevAvgSales?: string;
}

const SalesSummary: React.FC<SalesSummaryProps> = ({ totalSales, avgSales, bestSellingProduct, prevTotalSales = 0, prevAvgSales = "0.00" }) => {
  // Helper function to determine performance change
  const getIndicator = (current: number, previous: number) => {
    if (current > previous) return <span className="text-green-400">🔼</span>;
    if (current < previous) return <span className="text-red-400">🔽</span>;
    return <span className="text-gray-400">➖</span>;
  };

  return (
    <div className="bg-gray-900 shadow-lg rounded-lg p-6 w-full max-w-lg mx-auto mt-6 border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-200">
        📊 <span className="ml-2">Dashboard Summary</span>
      </h2>

      <div className="flex flex-col space-y-4">
        {/* Total Sales */}
        <div className="flex justify-between items-center bg-gray-800 p-4 rounded-md shadow-sm">
          <strong className="text-blue-400 text-lg">Total Sales:</strong>
          <span className="text-white font-semibold text-lg">
            ${totalSales.toLocaleString()} {getIndicator(totalSales, prevTotalSales)}
          </span>
        </div>

        {/* Average Sales */}
        <div className="flex justify-between items-center bg-gray-800 p-4 rounded-md shadow-sm">
          <strong className="text-green-400 text-lg">Average Sales:</strong>
          <span className="text-white font-semibold text-lg">
            ${avgSales} {getIndicator(parseFloat(avgSales), parseFloat(prevAvgSales))}
          </span>
        </div>

        {/* Best-Selling Product */}
        <div className="flex justify-between items-center bg-gray-800 p-4 rounded-md shadow-sm">
          <strong className="text-yellow-400 text-lg">Best Seller:</strong>
          <span className="text-white font-semibold text-lg">
            {bestSellingProduct.product} (${bestSellingProduct.sales.toLocaleString()})
          </span>
        </div>
      </div>
    </div>
  );
};

export default SalesSummary;