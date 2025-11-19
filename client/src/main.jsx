import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";

// Load key safely
const clerkFrontendApi = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkFrontendApi) {
  console.error(
    "%c[ERROR] Missing Clerk publishable key!",
    "color:red;font-size:14px;"
  );
  throw new Error(
    "Missing Clerk frontend API key. Add VITE_CLERK_PUBLISHABLE_KEY to your .env file."
  );
}

// -------------------------------------------
// Render App
// -------------------------------------------
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={clerkFrontendApi}
      navigate={(to) => window.location.assign(to)}
      appearance={{
        elements: {
          formButtonPrimary: {
            backgroundColor: "#0d6efd",
            borderRadius: "8px",
          },
        },
      }}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
