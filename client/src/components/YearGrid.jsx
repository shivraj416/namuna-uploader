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
    <div className="card shadow-sm p-4 border-0 rounded-4">
      {/* Search + Year Info */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div className="flex-grow-1 me-2">
          <input
            placeholder="🔍 Live search (namuna no ...)"
            className="form-control rounded-pill px-3"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div>
          <span
            className="badge bg-gradient"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              fontSize: "0.9rem",
              padding: "0.6em 1em",
              borderRadius: "20px",
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
                className="btn btn-primary w-100 shadow-sm rounded-3 fw-semibold"
                style={{
                  background: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
                  border: "none",
                  color: "white",
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
