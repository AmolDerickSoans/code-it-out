import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from "@testing-library/react";
import DataExport from "./DataExport";

describe("DataExport Component", () => {
  const mockData = [
    { id: 1, name: "Test" }
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  it("renders the component correctly", () => {
    render(<DataExport data={mockData} />);
    expect(screen.getByText("Export as CSV")).toBeInTheDocument();
    expect(screen.getByText("Export as JSON")).toBeInTheDocument();
  });

  it("alerts when exporting empty data to CSV", () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<DataExport data={[]} />);
    fireEvent.click(screen.getByText("Export as CSV"));
    expect(alertMock).toHaveBeenCalledWith("No data to export!");
    alertMock.mockRestore();
  });

  it("alerts when exporting empty data to JSON", () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<DataExport data={[]} />);
    fireEvent.click(screen.getByText("Export as JSON"));
    expect(alertMock).toHaveBeenCalledWith("No data to export!");
    alertMock.mockRestore();
  });

  it("triggers file download when exporting CSV", () => {
    const createElementSpy = vi.spyOn(document, "createElement");
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click');
    
    render(<DataExport data={mockData} />);
    fireEvent.click(screen.getByText("Export as CSV"));
    
    expect(createElementSpy).toHaveBeenCalledWith("a");
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    
    createElementSpy.mockRestore();
    clickSpy.mockRestore();
  });

  it("triggers file download when exporting JSON", () => {
    const createElementSpy = vi.spyOn(document, "createElement");
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click');
    
    render(<DataExport data={mockData} />);
    fireEvent.click(screen.getByText("Export as JSON"));
    
    expect(createElementSpy).toHaveBeenCalledWith("a");
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    
    createElementSpy.mockRestore();
    clickSpy.mockRestore();
  });
});