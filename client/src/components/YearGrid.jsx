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
    <div>
      <div className="d-flex justify-content-between mb-2">
        <div className="w-50">
          <input
            placeholder="Live search (namuna no ...)"
            className="form-control"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div>
          <small className="text-muted">Year: {year}</small>
        </div>
      </div>

      <div className="row gy-3">
        {visible.map((n) => {
          const label = NAMUNA_MAP[String(n)] || `Namuna No ${n}`;
          return (
            <div key={n} className="col-6 col-md-3 col-lg-2">
              <Link
                to={`/namuna/${encodeURIComponent(year)}/${n}`}
                className="btn btn-outline-primary w-100"
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
