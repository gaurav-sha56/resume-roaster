"use client";

import { useRef, useState } from "react";

export default function FileUpload({ onFileSelect, disabled }) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const ACCEPTED_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const ACCEPTED_EXT = [".pdf", ".docx"];

  const validateFile = (file) => {
    if (!file) return false;
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    if (!ACCEPTED_TYPES.includes(file.type) && !ACCEPTED_EXT.includes(ext)) {
      setError("Only PDF and DOCX files are supported");
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File too large — max 10MB");
      return false;
    }
    setError("");
    return true;
  };

  const handleFile = (file) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  return (
    <div style={{ width: "100%", maxWidth: 480 }}>
      <div
        className={`upload-zone ${dragOver ? "drag-over" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        id="upload-zone"
        style={{
          borderRadius: "var(--radius-lg)",
          padding: "40px 32px",
          textAlign: "center",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleInputChange}
          style={{ display: "none" }}
          id="file-input"
          disabled={disabled}
        />

        {/* Upload icon */}
        <div
          style={{
            fontSize: 40,
            marginBottom: 16,
          }}
          className={dragOver ? "animate-bounce-in" : ""}
        >
          {selectedFile ? "📄" : "📎"}
        </div>

        {selectedFile ? (
          <div className="animate-fade-in">
            <p
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: 4,
              }}
            >
              {selectedFile.name}
            </p>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
              }}
            >
              {(selectedFile.size / 1024).toFixed(1)} KB — Ready to roast
            </p>
          </div>
        ) : (
          <>
            <p
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: "var(--text-primary)",
                marginBottom: 6,
              }}
            >
              {dragOver ? "Drop it like it's hot 🔥" : "Drop your resume here"}
            </p>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
              }}
            >
              or click to browse · PDF & DOCX only
            </p>
          </>
        )}
      </div>

      {error && (
        <p
          className="animate-fade-in"
          style={{
            color: "var(--accent-red)",
            fontSize: 13,
            marginTop: 10,
            textAlign: "center",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
