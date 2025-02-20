import React from 'react';
import { FilterState } from '../types';

interface Props {
    filters: FilterState;
    onDateRangeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onMultiSelect: (type: 'categories' | 'regions', value: string) => void;
    categoryOptions: string[];
    regionOptions: string[];
    onClearFilters: () => void;
}

const AdvancedFiltersPanel: React.FC<Props> = ({
    filters,
    onDateRangeChange,
    onMultiSelect,
    categoryOptions,
    regionOptions,
    onClearFilters
}) => {
    return (
        <div className="advanced-filters-panel">
            <div className="filters-header">
                <h3>Advanced Filters</h3>
                <button className="clear-filters-btn" onClick={onClearFilters}>
                    Clear Filters
                </button>
            </div>

            <div className="filters-grid">
                <div className="filter-section date-filters">
                    <h4>Date Range</h4>
                    <div className="date-inputs">
                        <div className="input-group">
                            <label htmlFor="start-date">From</label>
                            <input
                                id="start-date"
                                type="date"
                                name="start"
                                value={filters.dateRange.start}
                                onChange={onDateRangeChange}
                                aria-label="Start Date"
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="end-date">To</label>
                            <input
                                id="end-date"
                                type="date"
                                name="end"
                                value={filters.dateRange.end}
                                onChange={onDateRangeChange}
                                aria-label="End Date"
                            />
                        </div>
                    </div>
                </div>

                <div className="filter-section category-filters">
                    <h4>Categories</h4>
                    <div className="checkbox-grid">
                        {categoryOptions.map(category => (
                            <label key={category} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={filters.categories.includes(category)}
                                    onChange={() => onMultiSelect('categories', category)}
                                    aria-label={`Category: ${category}`}
                                />
                                <span className="checkbox-label">{category}</span>
                                <span className="checkbox-custom"></span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="filter-section region-filters">
                    <h4>Regions</h4>
                    <div className="checkbox-grid">
                        {regionOptions.map(region => (
                            <label key={region} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={filters.regions.includes(region)}
                                    onChange={() => onMultiSelect('regions', region)}
                                    aria-label={`Region: ${region}`}
                                />
                                <span className="checkbox-label">{region}</span>
                                <span className="checkbox-custom"></span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="active-filters">
                {(filters.categories.length > 0 || filters.regions.length > 0 || filters.dateRange.start || filters.dateRange.end) && (
                    <>
                        <h4>Active Filters:</h4>
                        <div className="filter-tags">
                            {filters.dateRange.start && filters.dateRange.end && (
                                <span className="filter-tag">
                                    {`${filters.dateRange.start} - ${filters.dateRange.end}`}
                                </span>
                            )}
                            {filters.categories.map(category => (
                                <span key={category} className="filter-tag">
                                    {category}
                                    <button
                                        onClick={() => onMultiSelect('categories', category)}
                                        aria-label={`Remove ${category} filter`}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                            {filters.regions.map(region => (
                                <span key={region} className="filter-tag">
                                    {region}
                                    <button
                                        onClick={() => onMultiSelect('regions', region)}
                                        aria-label={`Remove ${region} filter`}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default React.memo(AdvancedFiltersPanel); 