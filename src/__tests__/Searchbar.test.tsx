import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import SearchBar from '../components/Searchbar';

describe('SearchBar Component', () => {
  let mockHandleSearch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockHandleSearch = vi.fn();
  });

  test('renders search input field correctly', () => {
    render(<SearchBar searchTerm="" handleSearch={mockHandleSearch} />);

    const inputElement = screen.getByPlaceholderText(
      'Search products, categories, regions...'
    );

    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue('');
  });

  test('displays the correct search term value', () => {
    render(<SearchBar searchTerm="Laptop" handleSearch={mockHandleSearch} />);

    const inputElement = screen.getByPlaceholderText(
      'Search products, categories, regions...'
    );

    expect(inputElement).toHaveValue('Laptop');
  });

  test('calls handleSearch function when input value changes', () => {
    render(<SearchBar searchTerm="" handleSearch={mockHandleSearch} />);

    const inputElement = screen.getByPlaceholderText(
      'Search products, categories, regions...'
    );

    fireEvent.change(inputElement, { target: { value: 'Phone' } });

    expect(mockHandleSearch).toHaveBeenCalledTimes(1);
    expect(mockHandleSearch).toHaveBeenCalledWith(expect.any(Object));
  });
});