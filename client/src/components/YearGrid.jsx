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
        backgroundColor: "rgba(255,255,255,0.2)",
        backdropFilter: "blur(4px)",
        border: "1px solid rgba(255,255,255,0.3)",
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
              backgroundColor: "rgba(255,255,255,0.3)",
              border: "1px solid rgba(255,255,255,0.5)",
              color: "#fff",
            }}
          />
        </div>
        <div>
          <span
            className="badge fw-semibold"
            style={{
              background: "rgba(255,255,255,0.3)",
              color: "#fff",
              fontSize: "0.9rem",
              padding: "0.5em 1em",
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
                className="btn w-100 shadow-sm rounded-3 fw-semibold"
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.4)",
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
