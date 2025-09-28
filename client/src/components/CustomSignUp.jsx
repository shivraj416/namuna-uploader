import React from "react";
import { SignUp } from "@clerk/clerk-react";

export default function CustomSignUp() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #4facfe, #00f2fe)", // Nice gradient background
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          padding: "2rem",
          backgroundColor: "rgba(255,255,255,0.95)",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
          Welcome to Namuna Uploader
        </h2>
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          afterSignUpUrl="/"   // ✅ redirect new users back to your app
        />
      </div>
    </div>
  );
}
