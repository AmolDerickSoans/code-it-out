
import React from "react";

interface DataExportProps {
  data: any[];
}

const DataExport: React.FC<DataExportProps> = ({ data }) => {
  // Convert data to CSV format
  const convertToCSV = (data: any[]) => {
    const csvRows = [];
    const headers = Object.keys(data[0]).join(","); // Get column headers
    csvRows.push(headers);

    data.forEach((row) => {
      const values = Object.values(row).map((value) => `"${value}"`).join(",");
      csvRows.push(values);
    });

    return csvRows.join("\n");
  };

  // Download file
  const downloadFile = (content: string, fileName: string, fileType: string) => {
    const blob = new Blob([content], { type: fileType });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
  };

  // Handle CSV export
  const exportToCSV = () => {
    if (data.length === 0) {
      alert("No data available to export!");
      return;
    }
    const csvData = convertToCSV(data);
    downloadFile(csvData, "sales_data.csv", "text/csv");
  };

  // Handle JSON export
  const exportToJSON = () => {
    if (data.length === 0) {
      alert("No data available to export!");
      return;
    }
    const jsonData = JSON.stringify(data, null, 2);
    downloadFile(jsonData, "sales_data.json", "application/json");
  };

  return (
    <div className="bg-gray-900 p-4 mt-6 rounded-lg shadow-md border border-gray-700">
      <h2 className="text-lg font-semibold text-gray-300 mb-2">📂 Export Data</h2>
      <div className="flex space-x-4">
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
        >
          Export as CSV
        </button>
        <button
          onClick={exportToJSON}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500"
        >
          Export as JSON
        </button>
      </div>
    </div>
  );
};

export default DataExport;
