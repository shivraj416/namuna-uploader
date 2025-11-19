import React from "react";

export default function YearSelector({ years, selectedYear, onChange }) {
  return (
    <div
      className="year-selector mb-4 d-flex align-items-center gap-3 p-3 rounded-4 shadow"
      style={{
        background: "rgba(255,255,255,0.35)",
        backdropFilter: "blur(6px)",
        border: "1px solid rgba(255,255,255,0.25)",
      }}
    >
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
        className="form-select rounded-pill px-4 py-2 fw-semibold text-dark border-0 shadow-sm year-dropdown"
        style={{
          width: "auto",
          cursor: "pointer",
          backgroundColor: "rgba(255,255,255,0.8)",
          transition: "all 0.25s ease",
        }}
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
