import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ExportControls from '../components/ExportControls';

describe('ExportControls Component', () => {
    let mockSetExportFormat: ReturnType<typeof vi.fn>;
    let mockExportData: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockSetExportFormat = vi.fn();
        mockExportData = vi.fn();
    });

    test('renders dropdown and button correctly', () => {
        render(
            <ExportControls
                exportFormat="csv"
                setExportFormat={mockSetExportFormat}
                exportData={mockExportData}
            />
        );

        const selectElement = screen.getByRole('combobox');
        const buttonElement = screen.getByRole('button', { name: /export data/i });

        expect(selectElement).toBeInTheDocument();
        expect(buttonElement).toBeInTheDocument();
        expect(selectElement).toHaveValue('csv');
    });

    test('calls setExportFormat when selecting a different format', () => {
        render(
            <ExportControls
                exportFormat="csv"
                setExportFormat={mockSetExportFormat}
                exportData={mockExportData}
            />
        );

        const selectElement = screen.getByRole('combobox');

        fireEvent.change(selectElement, { target: { value: 'json' } });

        expect(mockSetExportFormat).toHaveBeenCalledTimes(1);
        expect(mockSetExportFormat).toHaveBeenCalledWith('json');
    });

    test('calls exportData when clicking the export button', () => {
        render(
            <ExportControls
                exportFormat="csv"
                setExportFormat={mockSetExportFormat}
                exportData={mockExportData}
            />
        );

        const buttonElement = screen.getByRole('button', { name: /export data/i });

        fireEvent.click(buttonElement);

        expect(mockExportData).toHaveBeenCalledTimes(1);
    });
});