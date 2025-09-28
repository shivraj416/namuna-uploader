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
              <div
                className="min-vh-100 d-flex flex-column"
                style={{
                  backgroundImage: "url('/images/grampanchayat-bg.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundAttachment: "fixed",
                }}
              >
                <div className="container py-4">
                  <header
                    className="d-flex justify-content-between align-items-center mb-4 p-3 rounded"
                    style={{
                      background: "rgba(0,0,0,0.4)", // translucent black for readability
                      color: "white",
                    }}
                  >
                    <h1
                      className="h4 fw-bold m-0 text-center"
                      style={{
                        flexGrow: 1,
                        textShadow: "1px 1px 2px rgba(0,0,0,0.6)",
                      }}
                    >
                      आपले सहर्ष स्वागत आहे <br />
                      ग्रामपंचायत परुळे नमुना आराखड्यामध्ये!!
                    </h1>
                    <div className="ms-3">
                      <UserButton afterSignOutUrl="/sign-up" />
                    </div>
                  </header>

                  {/* Transparent Year Selector */}
                  <div
                    className="p-4 mb-4 rounded-4"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.2)", // very light transparency
                      backdropFilter: "blur(4px)", // glass effect
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}
                  >
                    <h2 className="h5 text-white fw-bold mb-3">वर्ष निवडा</h2>
                    <YearSelector
                      years={years}
                      selectedYear={selectedYear}
                      onChange={setSelectedYear}
                    />
                  </div>

                  {/* Transparent Year Grid */}
                  <div
                    className="p-4 rounded-4"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(4px)",
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}
                  >
                    <YearGrid year={selectedYear} apiBase={apiBase} />
                  </div>
                </div>
              </div>
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
