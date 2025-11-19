import React, { useState, useMemo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useUser, UserButton, SignUp } from "@clerk/clerk-react";

import YearSelector from "./components/YearSelector.jsx";
import YearGrid from "./components/YearGrid.jsx";
import NamunaPage from "./components/NamunaPage.jsx";

// ---------------------------------------------
// Generate years only once (performance boost)
// ---------------------------------------------
function generateYears(start = 2010, end = 2040) {
  return Array.from({ length: end - start + 1 }, (_, i) => {
    const y = start + i;
    return `${y}/${(y + 1).toString().slice(-2)}`;
  });
}

function App() {
  const years = useMemo(() => generateYears(), []);
  const [selectedYear, setSelectedYear] = useState(years[0]);

  // Cleanest API base logic
  const apiBase = useMemo(() => {
    if (import.meta.env.MODE === "development") return "http://localhost:5000";
    return import.meta.env.VITE_API_BASE || "";
  }, []);

  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <Router>
      <Routes>
        {/* ---------------------------------------------------
           MAIN APP (after login)
        ---------------------------------------------------- */}
        <Route
          path="/"
          element={
            isSignedIn ? (
              <div className="page-bg min-vh-100 d-flex flex-column">
                <div className="container py-4">
                  {/* HEADER */}
                  <header className="app-header d-flex justify-content-between align-items-center mb-4 p-3 rounded-4 shadow">
                    <h1 className="h4 fw-bold m-0 text-center flex-grow-1 title-text">
                      आपले सहर्ष स्वागत आहे <br />
                      ग्रामपंचायत परुळे नमुना आराखड्यामध्ये!!
                    </h1>
                    <div className="ms-3">
                      <UserButton afterSignOutUrl="/sign-up" />
                    </div>
                  </header>

                  {/* YEAR SELECTOR */}
                  <div className="glass-box p-4 mb-4 rounded-4">
                    <h2 className="h5 fw-bold mb-3 text-white">
                      वर्ष निवडा
                    </h2>

                    <YearSelector
                      years={years}
                      selectedYear={selectedYear}
                      onChange={setSelectedYear}
                    />
                  </div>

                  {/* NAMUNA GRID */}
                  <div className="glass-box p-4 rounded-4">
                    <YearGrid year={selectedYear} apiBase={apiBase} />
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/sign-up" />
            )
          }
        />

        {/* ---------------------------------------------------
           NAMUNA DETAIL PAGE
        ---------------------------------------------------- */}
        <Route
          path="/namuna/:year/:id"
          element={
            isSignedIn ? (
              <NamunaPage apiBase={apiBase} />
            ) : (
              <Navigate to="/sign-up" />
            )
          }
        />

        {/* ---------------------------------------------------
           SIGN UP PAGE
        ---------------------------------------------------- */}
        <Route
          path="/sign-up"
          element={
            isSignedIn ? (
              <Navigate to="/" />
            ) : (
              <SignUp afterSignUpUrl="/" />
            )
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
