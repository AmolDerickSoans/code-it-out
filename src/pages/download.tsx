import React, { useState } from "react";
import {
  Item,
  initialData,
  categoryOptions,
  regionOptions,
} from "../server/services";
import Select from "react-select";

const Download = () => {
  const data = initialData;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: string;
  }>({
    key: null,
    direction: "ascending",
  });
  const [activeFilter, setActiveFilter] = useState("all");
  const [thresholdValue, setThresholdValue] = useState(1000);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThresholdValue(Number(e.target.value));
  };

  const requestSort = (key: string | null) => {
    let direction = "ascending";

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  let filteredData = data;

  if (activeFilter !== "all") {
    if (activeFilter === "highSales") {
      filteredData = data.filter((item) => item.sales >= thresholdValue);
    } else if (activeFilter === "lowSales") {
      filteredData = data.filter((item) => item.sales < thresholdValue);
    } else if (activeFilter === "lowInventory") {
      filteredData = data.filter((item) => item.inventory < 30);
    }
  }

  if (searchTerm) {
    filteredData = filteredData.filter(
      (item) =>
        item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.region.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (selectedCategories.length > 0) {
    filteredData = filteredData.filter((item) =>
      selectedCategories.includes(item.category)
    );
  }

  if (selectedRegions.length > 0) {
    filteredData = filteredData.filter((item) =>
      selectedRegions.includes(item.region)
    );
  }

  if (sortConfig.key) {
    filteredData.sort((a, b) => {
      const key = sortConfig.key as keyof typeof a;
      if (a[key] < b[key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }

  const exportToCSV = (dataToExport: Item[]) => {
    const csvRows = [];
    const headers = Object.keys(dataToExport[0]) as (keyof Item)[];
    csvRows.push(headers.join(","));

    for (const row of dataToExport) {
      const values = headers.map((header) => {
        const escaped = ("" + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "data.csv");
    a.click();
  };

  const exportToJSON = (dataToExport: Item[]) => {
    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "data.json");
    a.click();
  };

  const handleExportCSV = () => {
    let dataToExport;

    if (
      activeFilter !== "all" ||
      searchTerm ||
      selectedCategories.length > 0 ||
      selectedRegions.length > 0 ||
      sortConfig.key
    ) {
      dataToExport = filteredData;
    } else {
      dataToExport = data;
    }
    exportToCSV(dataToExport);
  };

  const handleExportJSON = () => {
    let dataToExport;

    if (
      activeFilter !== "all" ||
      searchTerm ||
      selectedCategories.length > 0 ||
      selectedRegions.length > 0 ||
      sortConfig.key
    ) {
      dataToExport = filteredData;
    } else {
      dataToExport = data;
    }
    exportToJSON(dataToExport);
  };

  return (
    <div className="App">
      <div className="dow-container">
        <div className="content-section">
          <div className="search-bar">
            <input
              id="Search"
              type="text"
              placeholder="Search products, categories, regions..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="filter-controls">
            <button
              className={activeFilter === "all" ? "active" : ""}
              onClick={() => handleFilterChange("all")}
            >
              All Data
            </button>
            <button
              className={activeFilter === "highSales" ? "active" : ""}
              onClick={() => handleFilterChange("highSales")}
            >
              High Sales
            </button>
            <button
              className={activeFilter === "lowSales" ? "active" : ""}
              onClick={() => handleFilterChange("lowSales")}
            >
              Low Sales
            </button>
            <button
              className={activeFilter === "lowInventory" ? "active" : ""}
              onClick={() => handleFilterChange("lowInventory")}
            >
              Low Inventory
            </button>

            <label>
              Start Date:
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
              />
            </label>

            <label>
              End Date:
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
              />
            </label>

            <label>
              Categories:
              <Select
                isMulti
                options={categoryOptions}
                value={categoryOptions.filter((option) =>
                  selectedCategories.includes(option.value)
                )}
                onChange={(e) =>
                  setSelectedCategories(
                    e.map((option) => option.value as string)
                  )
                }
                className="text-sm"
              />
            </label>

            <label>
              Regions:
              <Select
                isMulti
                options={regionOptions}
                value={regionOptions.filter((option) =>
                  selectedRegions.includes(option.value)
                )}
                onChange={(e) =>
                  setSelectedRegions(e.map((option) => option.value as string))
                }
                className="text-sm"
              />
            </label>

            <label>
              Threshold:
              <input
                id="thresholdvalue"
                type="number"
                value={thresholdValue}
                onChange={handleThresholdChange}
                min="0"
              />
            </label>
          </div>
        </div>

        <div className="data-table-container">
          <h2>Sales Data</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => requestSort("product")}>
                  Product{" "}
                  {sortConfig.key === "product" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th onClick={() => requestSort("date")}>
                  Date{" "}
                  {sortConfig.key === "date" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th onClick={() => requestSort("sales")}>
                  Sales ($){" "}
                  {sortConfig.key === "sales" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th onClick={() => requestSort("inventory")}>
                  Inventory{" "}
                  {sortConfig.key === "inventory" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th onClick={() => requestSort("category")}>
                  Category{" "}
                  {sortConfig.key === "category" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th onClick={() => requestSort("region")}>
                  Region{" "}
                  {sortConfig.key === "region" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((entry, index) => (
                <tr
                  key={index}
                  className={entry.sales >= thresholdValue ? "high-sales" : ""}
                >
                  <td>{entry.product}</td>
                  <td>{entry.date}</td>
                  <td>{entry.sales}</td>
                  <td>{entry.inventory}</td>
                  <td>{entry.category}</td>
                  <td>{entry.region}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="export-button-container">
          <button onClick={handleExportJSON}>Export to Json</button>
          <button onClick={handleExportCSV}>Export to csv</button>
        </div>
      </div>
    </div>
  );
};

export default Download;
