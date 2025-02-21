import { FilterControlsProps } from "../types";

const FilterControls: React.FC<FilterControlsProps> = ({
  activeFilter,
  handleFilterChange,
  thresholdValue,
  handleThresholdChange
}) => {
  return (
    <div className="filter-controls">
      <button
        className={activeFilter === 'all' ? 'active' : ''}
        onClick={() => handleFilterChange('all')}
      >
        All Data
      </button>
      <button
        className={activeFilter === 'highSales' ? 'active' : ''}
        onClick={() => handleFilterChange('highSales')}
      >
        High Sales
      </button>
      <button
        className={activeFilter === 'lowSales' ? 'active' : ''}
        onClick={() => handleFilterChange('lowSales')}
      >
        Low Sales
      </button>
      <button
        className={activeFilter === 'lowInventory' ? 'active' : ''}
        onClick={() => handleFilterChange('lowInventory')}
      >
        Low Inventory
      </button>

      <label>
        Threshold:
        <input
          type="number"
          value={thresholdValue}
          onChange={handleThresholdChange}
          min="0"
        />
      </label>
    </div>
  );
};

export default FilterControls;