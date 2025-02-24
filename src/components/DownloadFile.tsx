import React, { useCallback } from "react";

interface DownloadFileProps {
  filteredData?: Record<string, any>[]; // Allow undefined but default to empty array
}

const DownloadFile: React.FC<DownloadFileProps> = ({ filteredData = [] }) => {
  // Ensure we have data before processing headers
  const headers = filteredData.length > 0 ? Object.keys(filteredData[0]).join(",") + "\n" : "";

  const exportToCSV = useCallback(() => {
    if (!filteredData || filteredData.length === 0) {
      alert("No data available to export.");
      return;
    }

    const csvRows = filteredData
      .map((item) =>
        Object.values(item)
          .map((value) => `"${value}"`) // Wrap values in quotes
          .join(",")
      )
      .join("\n");

    const csvContent = headers + csvRows;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "filtered_sales_data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url); // Clean up memory
  }, [filteredData, headers]);

  const exportToJSON = useCallback(() => {
    if (!filteredData || filteredData.length === 0) {
      alert("No data available to export.");
      return;
    }

    const jsonStr = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "filtered_sales_data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url); // Clean up memory
  }, [filteredData]);

  return (
    <div className="export-buttons">
      <button onClick={exportToCSV} disabled={!filteredData?.length}>
        Export as CSV
      </button>
      <button onClick={exportToJSON} disabled={!filteredData?.length}>
        Export as JSON
      </button>
    </div>
  );
};

export default React.memo(DownloadFile);
