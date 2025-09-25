import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";

// Get Clerk frontend API key (from .env)
const clerkFrontendApi = import.meta.env.VITE_CLERK_FRONTEND_API;

if (!clerkFrontendApi) {
  throw new Error("Missing Clerk frontend API key. Add VITE_CLERK_FRONTEND_API to your .env file.");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkFrontendApi}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
