import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SalesTable from '../SalesTable';

const mockData = [
    {
        id: 1,
        product: "Test Product",
        date: "2024-01-01",
        sales: 1000,
        inventory: 50,
        category: "Electronics",
        region: "North"
    }
];

describe('SalesTable', () => {
    const mockProps = {
        data: mockData,
        sortConfig: { key: null, direction: 'ascending' as const },
        thresholdValue: 1000,
        onSort: jest.fn(),
        onEdit: jest.fn(),
        onDelete: jest.fn()
    };

    it('renders table with correct data', async () => {
        const { getByText } = render(<SalesTable {...mockProps} />);
        expect(getByText('Test Product')).toBeInTheDocument();
        expect(getByText('$1,000')).toBeInTheDocument();
    });

    it('calls onSort when header is clicked', async () => {
        const { getByText } = render(<SalesTable {...mockProps} />);
        await userEvent.click(getByText('Product'));
        expect(mockProps.onSort).toHaveBeenCalledWith('product');
    });

    it('calls onEdit when edit button is clicked', async () => {
        const { getByText } = render(<SalesTable {...mockProps} />);
        await userEvent.click(getByText('Edit'));
        expect(mockProps.onEdit).toHaveBeenCalledWith(mockData[0]);
    });

    it('calls onDelete when delete button is clicked', async () => {
        const { getByText } = render(<SalesTable {...mockProps} />);
        await userEvent.click(getByText('Delete'));
        expect(mockProps.onDelete).toHaveBeenCalledWith(mockData[0].id);
    });
}); 