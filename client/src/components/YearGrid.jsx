import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { NAMUNA_MAP } from "../constants/namunaMap";

export default function YearGrid({ year }) {
  const slots = useMemo(() => Array.from({ length: 58 }, (_, i) => i + 1), []);
  const [filter, setFilter] = useState("");

  const filterLC = filter.toLowerCase();

  const visible = useMemo(() => {
    return slots.filter((n) => {
      const label = NAMUNA_MAP[String(n)] || `Namuna No ${n}`;
      return label.toLowerCase().includes(filterLC);
    });
  }, [slots, filterLC]);

  return (
    <div className="p-4 rounded-4">
      <div className="d-flex justify-content-between mb-3">
        <input
          className="form-control"
          value={filter}
          placeholder="Search Namuna..."
          onChange={(e) => setFilter(e.target.value)}
        />

        <span className="badge bg-dark text-white p-2">Year: {year}</span>
      </div>

      <div className="row gy-3">
        {visible.map((n) => {
          const label = NAMUNA_MAP[String(n)] || `Namuna ${n}`;
          return (
            <div key={n} className="col-6 col-md-3 col-lg-2">
              <Link
                to={`/namuna/${encodeURIComponent(year)}/${n}`}
                className="btn btn-dark w-100"
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
