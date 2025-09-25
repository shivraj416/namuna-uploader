// Add this at the top
import React from "react";

export default function YearSelector({ years, selectedYear, onChange }) {
  return (
    <div className="year-selector mb-4 d-flex align-items-center gap-3">
      <label htmlFor="year" className="fw-bold fs-6 text-primary m-0">
        📅 Select Year:
      </label>
      <select
        id="year"
        value={selectedYear}
        onChange={(e) => onChange(e.target.value)}
        className="form-select shadow-sm border-primary rounded-pill w-auto"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}
