import React from 'react';
import { FilterState } from '../types';

interface Props {
    filters: FilterState;
    onDateRangeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onMultiSelect: (type: 'categories' | 'regions', value: string) => void;
    categoryOptions: string[];
    regionOptions: string[];
}

const AdvancedFilters: React.FC<Props> = ({
    filters,
    onDateRangeChange,
    onMultiSelect,
    categoryOptions,
    regionOptions
}) => {
    return (
        <div className="advanced-filters">
            <h3>Advanced Filters</h3>

            <div className="date-range-filters">
                <div className="filter-group">
                    <label htmlFor="start-date">Start Date:</label>
                    <input
                        id="start-date"
                        type="date"
                        name="start"
                        value={filters.dateRange.start}
                        onChange={onDateRangeChange}
                        aria-label="Start Date"
                    />
                </div>
                <div className="filter-group">
                    <label htmlFor="end-date">End Date:</label>
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

            <div className="multi-select-filters">
                <div className="filter-group">
                    <label>Categories</label>
                    <div className="checkbox-group" role="group" aria-label="Categories">
                        {categoryOptions.map(category => (
                            <label key={category} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={filters.categories.includes(category)}
                                    onChange={() => onMultiSelect('categories', category)}
                                    aria-label={`Category: ${category}`}
                                />
                                {category}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="filter-group">
                    <label>Regions</label>
                    <div className="checkbox-group" role="group" aria-label="Regions">
                        {regionOptions.map(region => (
                            <label key={region} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={filters.regions.includes(region)}
                                    onChange={() => onMultiSelect('regions', region)}
                                    aria-label={`Region: ${region}`}
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

export default React.memo(AdvancedFilters); 