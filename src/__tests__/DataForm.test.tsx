import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import DataForm from '../components/DataForm';
import { DataFormProps } from '../types';

const mockHandleSubmit = vi.fn();
const mockHandleChange = vi.fn();
const mockSetEditingId = vi.fn();
const mockSetFormData = vi.fn();

const defaultProps: DataFormProps = {
    formData: {
        id: 0,
        product: '',
        date: '',
        sales: 0,
        inventory: 0,
        category: '',
        region: ''
    },
    formErrors: {},
    editingId: null,
    categoryOptions: ['Electronics', 'Furniture'],
    regionOptions: ['North', 'South'],
    handleChange: mockHandleChange,
    handleSubmit: mockHandleSubmit,
    setEditingId: mockSetEditingId,
    setFormData: mockSetFormData
};

describe('DataForm', () => {
    it('renders the form correctly', () => {
        render(<DataForm {...defaultProps} />);
        expect(screen.getByText('Add New Entry')).toBeInTheDocument();
    });

    it('submits the form with correct data', () => {
        render(<DataForm {...defaultProps} />);

        fireEvent.change(screen.getByLabelText('Product'), { target: { value: 'Laptop' } });
        fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2023-10-01' } });
        fireEvent.change(screen.getByLabelText('Sales ($)'), { target: { value: '1000' } });
        fireEvent.change(screen.getByLabelText('Inventory'), { target: { value: '50' } });
        fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'Electronics' } });
        fireEvent.change(screen.getByLabelText('Region'), { target: { value: 'North' } });

        fireEvent.submit(screen.getByRole('button', { name: /add entry/i }));

        expect(mockHandleSubmit).toHaveBeenCalled();
    });

    it('shows error messages for invalid fields', () => {
        const errorProps = {
            ...defaultProps,
            formErrors: {
                product: 'Product is required',
                date: 'Date is required'
            }
        };
        render(<DataForm {...errorProps} />);

        expect(screen.getByText('Product is required')).toBeInTheDocument();
        expect(screen.getByText('Date is required')).toBeInTheDocument();
    });

    it('calls setEditingId and setFormData on cancel', () => {
        const editingProps = {
            ...defaultProps,
            editingId: 1
        };
        render(<DataForm {...editingProps} />);

        fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

        expect(mockSetEditingId).toHaveBeenCalledWith(null);
        expect(mockSetFormData).toHaveBeenCalledWith({
            id: 1,
            product: '',
            date: '',
            sales: 0,
            inventory: 0,
            category: '',
            region: ''
        });
    });
});