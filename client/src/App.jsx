import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import YearSelector from "./components/YearSelector";
import YearGrid from "./components/YearGrid";
import NamunaPage from "./components/NamunaPage";
import { SignedIn, SignedOut, RedirectToSignIn, UserButton } from "@clerk/clerk-react";

const generateYears = () => {
  const years = [];
  for (let start = 2010; start <= 2040; start++) {
    years.push(`${start}/${(start + 1).toString().slice(-2)}`);
  }
  return years;
};

function App() {
  const years = generateYears();
  const [selectedYear, setSelectedYear] = useState(years[0]);

  const apiBase =
    import.meta.env.VITE_API_BASE ||
    (import.meta.env.MODE === "development" ? "http://localhost:5000" : "");

  return (
    <Router>
      <div className="container py-3">
        <header className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3">Namuna Uploader</h1>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </header>

        {/* All routes protected by Clerk */}
        <SignedIn>
          <Routes>
            {/* Home Page */}
            <Route
              path="/"
              element={
                <>
                  <YearSelector
                    years={years}
                    selectedYear={selectedYear}
                    onChange={setSelectedYear}
                  />
                  <YearGrid year={selectedYear} apiBase={apiBase} />
                </>
              }
            />

            {/* Namuna Page */}
            <Route
              path="/namuna/:year/:id"
              element={<NamunaPage apiBase={apiBase} />}
            />
          </Routes>
        </SignedIn>

        {/* Redirect anyone not signed in to Clerk signup/login */}
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </div>
    </Router>
  );
}

export default App;
