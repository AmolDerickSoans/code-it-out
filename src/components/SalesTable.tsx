import React, { memo } from 'react';
import { SalesData } from '../types';

interface SortConfig {
    key: keyof SalesData | null;
    direction: 'ascending' | 'descending';
}

interface Props {
    data: SalesData[];
    sortConfig: SortConfig;
    thresholdValue: number;
    onSort: (key: keyof SalesData) => void;
    onEdit: (item: SalesData) => void;
    onDelete: (id: number) => void;
}

const SalesTable = memo(({
    data,
    sortConfig,
    thresholdValue,
    onSort,
    onEdit,
    onDelete
}: Props) => {
    return (
        <div className="data-table-container">
            <h2>Sales Data</h2>
            <table className="data-table">
                <thead>
                    <tr>
                        {['product', 'date', 'sales', 'inventory', 'category', 'region'].map((key) => (
                            <th key={key} onClick={() => onSort(key as keyof SalesData)}>
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                                {sortConfig.key === key && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                            </th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((entry) => (
                        <tr key={entry.id} className={entry.sales >= thresholdValue ? 'high-sales' : ''}>
                            <td>{entry.product}</td>
                            <td>{entry.date}</td>
                            <td>${entry.sales.toLocaleString()}</td>
                            <td>{entry.inventory}</td>
                            <td>{entry.category}</td>
                            <td>{entry.region}</td>
                            <td>
                                <button className="edit-btn" onClick={() => onEdit(entry)}>Edit</button>
                                <button className="delete-btn" onClick={() => onDelete(entry.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});

SalesTable.displayName = 'SalesTable';

export default SalesTable; 