import { ExportControlsProps } from "../types";

const ExportControls: React.FC<ExportControlsProps> = ({ exportFormat, setExportFormat, exportData }) => {
  return (
    <div className="export-controls">
      <select
        value={exportFormat}
        onChange={(e) => setExportFormat(e.target.value as 'csv' | 'json')}
      >
        <option value="csv">CSV</option>
        <option value="json">JSON</option>
      </select>
      <button onClick={exportData}>Export Data</button>
    </div>
  );
};

export default ExportControls;