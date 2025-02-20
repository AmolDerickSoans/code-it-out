import React, { useState } from "react";
import { FaFilter, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";

interface AdvancedFilterProps {
  categories: string[];
  regions: string[];
  onFilterChange: (filters: {
    startDate: string;
    endDate: string;
    selectedCategories: string[];
    selectedRegions: string[];
  }) => void;
}

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({ categories, regions, onFilterChange }) => {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    selectedCategories: [] as string[],
    selectedRegions: [] as string[],
  });

  const [showFilters, setShowFilters] = useState(false);

  const handleCheckboxChange = (type: "selectedCategories" | "selectedRegions", value: string) => {
    setFilters((prev) => {
      const updatedSelection = prev[type].includes(value)
        ? prev[type].filter((item) => item !== value)
        : [...prev[type], value];

      const newFilters = { ...prev, [type]: updatedSelection };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  return (
    <div className="bg-gray-900 bg-opacity-90 p-5 rounded-xl shadow-lg border border-gray-700 backdrop-blur-md mt-6">
      {/* Header */}
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowFilters(!showFilters)}>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FaFilter className="text-blue-400" /> Advanced Filters
        </h2>
        <button className="text-blue-400 hover:text-blue-300 transition">
          {showFilters ? "▲ Hide" : "▼ Show"}
        </button>
      </div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          {/* Date Range Filters */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <label className="text-white flex flex-col text-sm">
              Start Date:
              <div className="relative mt-1">
                <FaCalendarAlt className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="date"
                  className="w-full p-2 pl-10 border border-gray-700 rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-400"
                  value={filters.startDate}
                  onChange={(e) => {
                    const newFilters = { ...filters, startDate: e.target.value };
                    setFilters(newFilters);
                    onFilterChange(newFilters);
                  }}
                />
              </div>
            </label>

            <label className="text-white flex flex-col text-sm">
              End Date:
              <div className="relative mt-1">
                <FaCalendarAlt className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="date"
                  className="w-full p-2 pl-10 border border-gray-700 rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-400"
                  value={filters.endDate}
                  onChange={(e) => {
                    const newFilters = { ...filters, endDate: e.target.value };
                    setFilters(newFilters);
                    onFilterChange(newFilters);
                  }}
                />
              </div>
            </label>
          </div>

          {/* Categories Multi-Select */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-blue-400">Filter by Category</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map((category) => (
                <label key={category} className="text-white flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-blue-500 transform scale-110 transition"
                    checked={filters.selectedCategories.includes(category)}
                    onChange={() => handleCheckboxChange("selectedCategories", category)}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          {/* Regions Multi-Select */}
          <div>
            <h3 className="text-lg font-semibold text-blue-400">Filter by Region</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {regions.map((region) => (
                <label key={region} className="text-white flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-green-500 transform scale-110 transition"
                    checked={filters.selectedRegions.includes(region)}
                    onChange={() => handleCheckboxChange("selectedRegions", region)}
                  />
                  {region}
                </label>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdvancedFilter;
