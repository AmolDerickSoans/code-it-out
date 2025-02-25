// SalesForm.tsx
import React from 'react';
import { FormData, SalesData } from './SalesDashboard';

type Props = {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  editingId: number | null;
  handleCancel: () => void;
};

const SalesForm: React.FC<Props> = ({ formData, handleChange, handleSubmit, editingId, handleCancel }) => {
  return (
    <form onSubmit={handleSubmit} className="data-form">
      <h2>{editingId ? 'Edit Entry' : 'Add New Entry'}</h2>
      <div className="form-row">
        <div className="form-group">
          <label>Product</label>
          <input type="text" name="product" value={formData.product} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Sales ($)</label>
          <input type="number" name="sales" value={formData.sales} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Inventory</label>
          <input type="number" name="inventory" value={formData.inventory} onChange={handleChange} required />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select a Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Appliances">Appliances</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
          </select>
        </div>
        <div className="form-group">
          <label>Region</label>
          <select name="region" value={formData.region} onChange={handleChange} required>
            <option value="">Select a Region</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="East">East</option>
            <option value="West">West</option>
          </select>
        </div>
      </div>
      <button type="submit">{editingId ? 'Update Entry' : 'Add Entry'}</button>
      {editingId && <button type="button" onClick={handleCancel}>Cancel</button>}
    </form>
  );
};

export default SalesForm;
