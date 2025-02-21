import { AdvancedFiltersProps } from "../types";

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
    filters,
    categoryOptions,
    regionOptions,
    handleDateRangeChange,
    handleMultiSelect
}) => {
    return (
        <div className="advanced-filters">
            <h3>Advanced Filters</h3>

            <div className="date-range-filters">
                <div className="filter-group">
                    <label>Start Date:</label>
                    <input
                        type="date"
                        name="start"
                        value={filters.dateRange.start}
                        onChange={handleDateRangeChange}
                    />
                </div>
                <div className="filter-group">
                    <label>End Date:</label>
                    <input
                        type="date"
                        name="end"
                        value={filters.dateRange.end}
                        onChange={handleDateRangeChange}
                    />
                </div>
            </div>

            <div className="multi-select-filters">
                <div className="filter-group">
                    <label>Categories:</label>
                    <div className="checkbox-group">
                        {categoryOptions.map(category => (
                            <label key={category} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={filters.categories.includes(category)}
                                    onChange={() => handleMultiSelect('categories', category)}
                                />
                                {category}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="filter-group">
                    <label>Regions:</label>
                    <div className="checkbox-group">
                        {regionOptions.map(region => (
                            <label key={region} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={filters.regions.includes(region)}
                                    onChange={() => handleMultiSelect('regions', region)}
                                />
                                {region}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvancedFilters;