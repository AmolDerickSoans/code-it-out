import React from "react";

type Props = {
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  selectedCategories: string[];
  handleCategoryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedRegions: string[];
  handleRegionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  allCategories: string[];
  allRegions: string[];
  applyFilters: () => void; // Function to apply filters
  resetFilters: () => void; // Function to reset filters
};

const AdvancedFilters: React.FC<Props> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedCategories,
  handleCategoryChange,
  selectedRegions,
  handleRegionChange,
  allCategories,
  allRegions,
  applyFilters,
  resetFilters,
}) => {
  // Check if any filters are applied
  const hasAppliedFilters =
    startDate || endDate || selectedCategories.length > 0 || selectedRegions.length > 0;

  return (
    <div className="advanced-filters">
      <h2>Advanced Filters</h2>

      <div className="filters-container">
        {/* Date Range Filter */}
        <div className="filter-group">
          <h3>Date Range</h3>
          <div className="date-filters">
            <label>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <label>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <h3>Categories</h3>
          <div className="checkbox-group">
            {allCategories.map((category) => (
              <label key={category} className="checkbox-item">
                <input
                  type="checkbox"
                  value={category}
                  checked={selectedCategories.includes(category)}
                  onChange={handleCategoryChange}
                />
                {category}
              </label>
            ))}
          </div>
        </div>

        {/* Region Filter */}
        <div className="filter-group">
          <h3>Regions</h3>
          <div className="checkbox-group">
            {allRegions.map((region) => (
              <label key={region} className="checkbox-item">
                <input
                  type="checkbox"
                  value={region}
                  checked={selectedRegions.includes(region)}
                  onChange={handleRegionChange}
                />
                {region}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Apply & Reset Buttons */}
      <div className="filter-buttons">
        <button className="apply-filters-btn" onClick={applyFilters}>
          Apply Filters
        </button>
        {hasAppliedFilters && (
          <button className="reset-filters-btn" onClick={resetFilters}>
            Reset Filters
          </button>
        )}
      </div>

      {/* Show Applied Filters Summary */}
      {hasAppliedFilters && (
        <div className="filter-summary">
          <h3>Applied Filters:</h3>
          <ul>
            {startDate && endDate && (
              <li>
                <strong>Date Range:</strong> {startDate} to {endDate}
              </li>
            )}
            {selectedCategories.length > 0 && (
              <li>
                <strong>Categories:</strong> {selectedCategories.join(", ")}
              </li>
            )}
            {selectedRegions.length > 0 && (
              <li>
                <strong>Regions:</strong> {selectedRegions.join(", ")}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
