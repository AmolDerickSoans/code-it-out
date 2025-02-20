import React from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import SalesDashboard from "./SalesDashboard";

describe("SalesDashboard", () => {
  test("submits form with valid data", () => {
    render(<SalesDashboard />);

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText(/Product/i), {
      target: { value: "Test Product" },
    });
    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: "2024-01-01" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Sales/i), {
      target: { value: "1000" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Inventory/i), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByLabelText(/Category/i), {
      target: { value: "Electronics" },
    });
    fireEvent.change(screen.getByLabelText(/Region/i), {
      target: { value: "North" },
    });

    // Submit the form
    fireEvent.click(screen.getByText(/Add Entry/i));

    // Check if the new entry is displayed in the table
    expect(screen.getByText(/Test Product/i)).toBeInTheDocument();
  });

  test("shows alert on invalid form submission", () => {
    render(<SalesDashboard />);

    // Submit the form without filling it out
    fireEvent.click(screen.getByText(/Add Entry/i));

    // Check for alert (you may need to mock window.alert)
    expect(window.alert).toHaveBeenCalledWith(
      "Please fill out all required fields."
    );
  });

  test("deletes an entry", () => {
    render(<SalesDashboard />);

    // Fill out the form and submit
    fireEvent.change(screen.getByPlaceholderText(/Product/i), {
      target: { value: "Test Product" },
    });
    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: "2024-01-01" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Sales/i), {
      target: { value: "1000" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Inventory/i), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByLabelText(/Category/i), {
      target: { value: "Electronics" },
    });
    fireEvent.change(screen.getByLabelText(/Region/i), {
      target: { value: "North" },
    });
    fireEvent.click(screen.getByText(/Add Entry/i));

    // Delete the entry
    fireEvent.click(screen.getByText(/Delete/i));

    // Check that the entry is no longer in the document
    expect(screen.queryByText(/Test Product/i)).not.toBeInTheDocument();
  });
});
