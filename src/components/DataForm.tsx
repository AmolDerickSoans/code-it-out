import { DataFormProps } from "../types";

const DataForm: React.FC<DataFormProps> = ({
  formData,
  formErrors,
  editingId,
  categoryOptions,
  regionOptions,
  handleChange,
  handleSubmit,
  setEditingId,
  setFormData
}) => {
  return (
    <form onSubmit={handleSubmit} className="data-form">
      <h2>{editingId ? 'Edit Entry' : 'Add New Entry'}</h2>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="product">Product</label>
          <input
            id="product"
            type="text"
            name="product"
            value={formData.product}
            onChange={handleChange}
            required
            className={formErrors.product ? 'error' : ''}
          />
          {formErrors.product && <span className="error-message">{formErrors.product}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className={formErrors.date ? 'error' : ''}
          />
          {formErrors.date && <span className="error-message">{formErrors.date}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="sales">Sales ($)</label>
          <input
            id="sales"
            type="number"
            name="sales"
            value={formData.sales}
            onChange={handleChange}
            required
            className={formErrors.sales ? 'error' : ''}
          />
          {formErrors.sales && <span className="error-message">{formErrors.sales}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="inventory">Inventory</label>
          <input
            id="inventory"
            type="number"
            name="inventory"
            value={formData.inventory}
            onChange={handleChange}
            required
            className={formErrors.inventory ? 'error' : ''}
          />
          {formErrors.inventory && <span className="error-message">{formErrors.inventory}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className={formErrors.category ? 'error' : ''}
          >
            <option value="">Select a Category</option>
            {categoryOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {formErrors.category && <span className="error-message">{formErrors.category}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="region">Region</label>
          <select
            id="region"
            name="region"
            value={formData.region}
            onChange={handleChange}
            required
            className={formErrors.region ? 'error' : ''}
          >
            <option value="">Select a Region</option>
            {regionOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {formErrors.region && <span className="error-message">{formErrors.region}</span>}
        </div>
      </div>

      <button type="submit">{editingId ? 'Update Entry' : 'Add Entry'}</button>
      {editingId && (
        <button type="button" onClick={() => {
          setEditingId(null);
          setFormData({
            id: editingId || 0,
            product: '',
            date: '',
            sales: 0,
            inventory: 0,
            category: '',
            region: ''
          });
        }}>
          Cancel
        </button>
      )}
    </form>
  );
};

export default DataForm;