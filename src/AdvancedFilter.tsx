// AdvancedFilters.tsx
import React from 'react';

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
};

const AdvancedFilters: React.FC<Props> = ({
  startDate, setStartDate, endDate, setEndDate,
  selectedCategories, handleCategoryChange,
  selectedRegions, handleRegionChange,
  allCategories, allRegions
}) => {
  return (
    <>
      <div className="filters">
        <div className="filter-item">
          <label>Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <label>End Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <button>Apply Date Range Filter</button>
        </div>
        <div className="filter-item">
          <label>Categories</label>
          {allCategories.map((category) => (
            <div key={category}>
              <input type="checkbox" value={category} checked={selectedCategories.includes(category)} onChange={handleCategoryChange} />
              <label>{category}</label>
            </div>
          ))}
        </div>
        <div className="filter-item">
          <label>Regions</label>
          {allRegions.map((region) => (
            <div key={region}>
              <input type="checkbox" value={region} checked={selectedRegions.includes(region)} onChange={handleRegionChange} />
              <label>{region}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="filter-summary">
        <h4>Applied Filters:</h4>
        <div>
          {startDate && endDate && <p>Date Range: {startDate} to {endDate}</p>}
          {selectedCategories.length > 0 && <p>Categories: {selectedCategories.join(', ')}</p>}
          {selectedRegions.length > 0 && <p>Regions: {selectedRegions.join(', ')}</p>}
        </div>
      </div>
    </>
  );
};

export default AdvancedFilters;
