"use client";

import { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import ChatInput from "./ChatInput";

export default function ChatWindow({
  messages,
  onSendMessage,
  isStreaming,
  isWaitingForStream,
  onNewRoast,
}) {
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Auto-scroll on new messages or streaming content
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isWaitingForStream]);

  return (
    <div
      className="animate-fade-in"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
      }}
    >
      {/* Header */}
      <header
        className="header-glass"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            className="animate-fire"
            style={{ fontSize: 24 }}
          >
            🔥
          </span>
          <div>
            <h1
              style={{
                fontSize: 17,
                fontWeight: 700,
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              <span className="gradient-text">Resume Roaster</span>
            </h1>
            <p
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                margin: 0,
              }}
            >
              Brutally honest resume feedback
            </p>
          </div>
        </div>

        <button
          className="btn-new-roast"
          onClick={onNewRoast}
          id="new-roast-button"
          style={{
            padding: "7px 16px",
            borderRadius: "var(--radius-md)",
            fontSize: 13,
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Roast
        </button>
      </header>

      {/* Messages area */}
      <div
        ref={scrollContainerRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 0",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* Centered container for messages */}
        <div
          style={{
            maxWidth: 768,
            width: "100%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {messages.map((msg, idx) => (
            <MessageBubble
              key={idx}
              role={msg.role}
              content={msg.content}
              isStreaming={
                isStreaming &&
                idx === messages.length - 1 &&
                msg.role === "assistant"
              }
            />
          ))}

          {isWaitingForStream && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <ChatInput onSend={onSendMessage} disabled={isStreaming || isWaitingForStream} />
    </div>
  );
}
