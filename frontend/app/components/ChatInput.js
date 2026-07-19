"use client";

import { useState, useRef } from "react";

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setText(e.target.value);
    // Auto-resize textarea
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 150) + "px";
    }
  };

  return (
    <div
      style={{
        padding: "12px 16px 20px",
        borderTop: "1px solid var(--border-subtle)",
        background: "var(--bg-primary)",
      }}
    >
      <div
        className="glass"
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 10,
          padding: "8px 8px 8px 16px",
          borderRadius: "var(--radius-xl)",
          maxWidth: 768,
          margin: "0 auto",
        }}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={
            disabled ? "Waiting for roast..." : "Ask a follow-up question..."
          }
          rows={1}
          id="chat-input"
          style={{
            flex: 1,
            resize: "none",
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--text-primary)",
            fontSize: 14.5,
            lineHeight: 1.5,
            fontFamily: "var(--font-sans)",
            padding: "6px 0",
            maxHeight: 150,
          }}
        />
        <button
          className="btn-send"
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          id="send-button"
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            flexShrink: 0,
          }}
          title="Send message"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      <p
        style={{
          textAlign: "center",
          fontSize: 11,
          color: "var(--text-muted)",
          marginTop: 8,
          fontFamily: "var(--font-sans)",
        }}
      >
        Resume Roaster can make mistakes. It's all in good fun 🔥
      </p>
    </div>
  );
}
