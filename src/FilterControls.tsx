// FilterControls.tsx
import React from 'react';

type Props = {
  searchTerm: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  activeFilter: string;
  handleFilterChange: (filter: 'all' | 'highSales' | 'lowSales' | 'lowInventory') => void;
  thresholdValue: number;
  handleThresholdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const FilterControls: React.FC<Props> = ({ searchTerm, handleSearch, activeFilter, handleFilterChange, thresholdValue, handleThresholdChange }) => {
  return (
    <div className="content-section">
      <div className="search-bar">
        <input type="text" placeholder="Search products, categories, regions..." value={searchTerm} onChange={handleSearch} />
      </div>
      <div className="filter-controls">
        <button className={activeFilter === 'all' ? 'active' : ''} onClick={() => handleFilterChange('all')}>All Data</button>
        <button className={activeFilter === 'highSales' ? 'active' : ''} onClick={() => handleFilterChange('highSales')}>High Sales</button>
        <button className={activeFilter === 'lowSales' ? 'active' : ''} onClick={() => handleFilterChange('lowSales')}>Low Sales</button>
        <button className={activeFilter === 'lowInventory' ? 'active' : ''} onClick={() => handleFilterChange('lowInventory')}>Low Inventory</button>
        <label>
          Threshold:
          <input type="number" value={thresholdValue} onChange={handleThresholdChange} min="0" />
        </label>
      </div>
    </div>
  );
};

export default FilterControls;
