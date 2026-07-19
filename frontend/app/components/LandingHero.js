"use client";

import { useState } from "react";
import FileUpload from "./FileUpload";

export default function LandingHero({ onUpload, loading }) {
  const [file, setFile] = useState(null);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
  };

  const handleRoast = () => {
    if (file && !loading) {
      onUpload(file);
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow effect */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 500,
          height: 500,
          background:
            "radial-gradient(circle, rgba(255, 107, 53, 0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        className="animate-fade-in-up"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Fire emoji */}
        <div
          className="animate-fire"
          style={{ fontSize: 56, marginBottom: 8 }}
        >
          🔥
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 800,
            textAlign: "center",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          <span className="gradient-text">Resume Roaster</span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "clamp(15px, 2vw, 18px)",
            color: "var(--text-secondary)",
            textAlign: "center",
            maxWidth: 440,
            lineHeight: 1.5,
            marginTop: 4,
            marginBottom: 28,
          }}
        >
          Upload your resume. Get brutally honest (and hilarious) feedback.
          <br />
          <span style={{ color: "var(--text-muted)", fontSize: "0.9em" }}>
            No feelings were harmed in the making of this roast.
          </span>
        </p>

        {/* File Upload Zone */}
        <FileUpload onFileSelect={handleFileSelect} disabled={loading} />

        {/* Roast Button */}
        <button
          className="btn-send"
          onClick={handleRoast}
          disabled={!file || loading}
          id="roast-button"
          style={{
            marginTop: 20,
            padding: "14px 40px",
            borderRadius: "var(--radius-xl)",
            fontSize: 16,
            fontWeight: 700,
            fontFamily: "var(--font-sans)",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 8,
            letterSpacing: "0.01em",
          }}
        >
          {loading ? (
            <>
              <span className="animate-fire" style={{ fontSize: 20 }}>
                🔥
              </span>
              Roasting...
            </>
          ) : (
            <>
              🔥 Roast My Resume
            </>
          )}
        </button>

        {/* Powered by */}
        <p
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            marginTop: 32,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          Powered by Groq + Llama 3.3 · Built for laughs, not tears
        </p>
      </div>
    </div>
  );
}
