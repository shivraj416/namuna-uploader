import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { NAMUNA_MAP } from "./NamunaSlot"; // import your mapping

export default function YearGrid({ year, apiBase }) {
  // ✅ Generate slots 1–58
  const slots = useMemo(() => Array.from({ length: 58 }, (_, i) => i + 1), []);

  const [filter, setFilter] = useState("");

  const visible = slots.filter((n) => {
    const label = NAMUNA_MAP[String(n)] || `Namuna No ${n}`;
    if (!filter) return true;
    return label.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <div
      className="p-4 rounded-4"
      style={{
        backgroundColor: "rgba(255,255,255,0.08)", // softer opacity
        backdropFilter: "blur(6px)",              // subtle blur
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* Search + Year Info */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div className="flex-grow-1 me-2">
          <input
            placeholder="🔍 Live search (namuna no ...)"
            className="form-control rounded-pill px-3"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff",
              backdropFilter: "blur(4px)",
            }}
          />
        </div>
        <div>
          <span
            className="badge fw-semibold"
            style={{
              background: "rgba(255,255,255,0.1)",
              color: "#fff",
              fontSize: "0.9rem",
              padding: "0.5em 1em",
              borderRadius: "20px",
              backdropFilter: "blur(4px)",
            }}
          >
            Year: {year}
          </span>
        </div>
      </div>

      {/* Namuna Buttons */}
      <div className="row gy-3">
        {visible.map((n) => {
          const label = NAMUNA_MAP[String(n)] || `Namuna No ${n}`;
          return (
            <div key={n} className="col-6 col-md-3 col-lg-2">
              <Link
                to={`/namuna/${encodeURIComponent(year)}/${n}`}
                className="btn w-100 shadow-sm rounded-3 fw-semibold"
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)", // softer
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  backdropFilter: "blur(4px)",
                }}
              >
                {label}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
