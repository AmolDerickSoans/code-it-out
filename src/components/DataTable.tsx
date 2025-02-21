import { DataTableProps } from '../types';

const DataTable: React.FC<DataTableProps> = ({
  data,
  sortConfig,
  requestSort,
  thresholdValue,
  handleEdit,
  deleteEntry
}) => {
  return (
    <div className="data-table-container">
      <h2>Sales Data</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th onClick={() => requestSort('product')}>
              Product {sortConfig.key === 'product' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </th>
            <th onClick={() => requestSort('date')}>
              Date {sortConfig.key === 'date' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </th>
            <th onClick={() => requestSort('sales')}>
              Sales ($) {sortConfig.key === 'sales' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </th>
            <th onClick={() => requestSort('inventory')}>
              Inventory {sortConfig.key === 'inventory' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </th>
            <th onClick={() => requestSort('category')}>
              Category {sortConfig.key === 'category' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </th>
            <th onClick={() => requestSort('region')}>
              Region {sortConfig.key === 'region' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index} className={entry.sales >= thresholdValue ? 'high-sales' : ''}>
              <td>{entry.product}</td>
              <td>{entry.date}</td>
              <td>{entry.sales}</td>
              <td>{entry.inventory}</td>
              <td>{entry.category}</td>
              <td>{entry.region}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(entry)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteEntry(entry.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;