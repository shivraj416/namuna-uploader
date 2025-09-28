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
        background:
          "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)", // Smooth gradient
        padding: "1rem",
      }}
    >
      <div
        style={{
          maxWidth: "420px",
          width: "100%",
          padding: "2.5rem 2rem",
          backgroundColor: "rgba(255, 255, 255, 0.97)",
          borderRadius: "16px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            marginBottom: "1.5rem",
            color: "#333",
            fontSize: "1.8rem",
            fontWeight: "600",
          }}
        >
          Welcome to Namuna Uploader
        </h2>

        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-4 w-full font-semibold",
            },
          }}
        />
      </div>
    </div>
  );
}
