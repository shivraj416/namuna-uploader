// Add this at the top
import React from "react";

export default function YearSelector({ years, selectedYear, onChange }) {
  return (
    <div className="year-selector mb-4 d-flex align-items-center gap-3 p-3 bg-light rounded shadow-sm">
      <label
        htmlFor="year"
        className="fw-bold fs-5 text-primary m-0 d-flex align-items-center"
      >
        📅 Select Year:
      </label>
      <select
        id="year"
        value={selectedYear}
        onChange={(e) => onChange(e.target.value)}
        className="form-select shadow border-primary rounded-pill w-auto px-4 py-2 fw-semibold text-dark"
        style={{
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => (e.target.style.boxShadow = "0 0 10px #0d6efd")}
        onMouseOut={(e) => (e.target.style.boxShadow = "none")}
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
