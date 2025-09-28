import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useUser, UserButton, SignUp } from "@clerk/clerk-react";
import YearSelector from "./components/YearSelector.jsx";
import YearGrid from "./components/YearGrid.jsx";
import NamunaPage from "./components/NamunaPage.jsx";

// generateYears function (2010/11 to 2040/41 format)
function generateYears(start = 2010, end = 2040) {
  const years = [];
  for (let i = start; i <= end; i++) {
    years.push(`${i}/${(i + 1).toString().slice(-2)}`);
  }
  return years;
}

function App() {
  const years = generateYears();
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const apiBase =
    import.meta.env.VITE_API_BASE ||
    (import.meta.env.MODE === "development" ? "http://localhost:5000" : "");

  const { isSignedIn, isLoaded } = useUser();

  // Wait until Clerk is loaded
  if (!isLoaded) return null;

  return (
    <Router>
      <Routes>
        {/* Main app route */}
        <Route
          path="/"
          element={
            isSignedIn ? (
              <>
                <header className="d-flex justify-content-between align-items-center mb-4">
                  <h1 className="h3">Namuna Uploader</h1>
                  <UserButton afterSignOutUrl="/sign-up" />
                </header>

                <YearSelector
                  years={years}
                  selectedYear={selectedYear}
                  onChange={setSelectedYear}
                />
                <YearGrid year={selectedYear} apiBase={apiBase} />
              </>
            ) : (
              <Navigate to="/sign-up" />
            )
          }
        />

        {/* Namuna detail page */}
        <Route
          path="/namuna/:year/:id"
          element={
            isSignedIn ? <NamunaPage apiBase={apiBase} /> : <Navigate to="/sign-up" />
          }
        />

        {/* Signup page */}
        <Route
          path="/sign-up"
          element={isSignedIn ? <Navigate to="/" /> : <SignUp afterSignUpUrl="/" />}
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
