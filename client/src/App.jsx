import CustomSignup from ".src/components/CustomSignup"; // ✅ import your custom signup

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
            <UserButton afterSignOutUrl="/sign-up" />
          </SignedIn>
        </header>

        <Routes>
          {/* Signed-in routes */}
          <Route
            path="/"
            element={
              <SignedIn>
                <>
                  <YearSelector
                    years={years}
                    selectedYear={selectedYear}
                    onChange={setSelectedYear}
                  />
                  <YearGrid year={selectedYear} apiBase={apiBase} />
                </>
              </SignedIn>
            }
          />
          <Route
            path="/namuna/:year/:id"
            element={
              <SignedIn>
                <NamunaPage apiBase={apiBase} />
              </SignedIn>
            }
          />

          {/* Custom Signup for not-signed-in users */}
          <Route
            path="/sign-up"
            element={
              <SignedOut>
                <CustomSignup />
              </SignedOut>
            }
          />

          {/* Fallback: redirect any other route to signup if signed out */}
          <Route
            path="*"
            element={
              <SignedOut>
                <CustomSignup />
              </SignedOut>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
