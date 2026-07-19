"use client";

export default function MessageBubble({ role, content, isStreaming }) {
  const isUser = role === "user";
  const isError = role === "error";

  // ─── Error message rendering ─────────────────────────
  if (isError) {
    return (
      <div
        className="animate-fade-in-up"
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          gap: 10,
          padding: "4px 16px",
          width: "100%",
        }}
      >
        {/* Error icon */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #FF2E63 0%, #ff0844 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            flexShrink: 0,
            marginTop: 2,
          }}
        >
          ⚠️
        </div>

        {/* Error card */}
        <div
          style={{
            maxWidth: "75%",
            padding: "14px 18px",
            borderRadius: "var(--radius-lg) var(--radius-lg) var(--radius-lg) 4px",
            background: "rgba(255, 46, 99, 0.08)",
            border: "1px solid rgba(255, 46, 99, 0.2)",
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          <p
            style={{
              margin: "0 0 6px 0",
              fontWeight: 600,
              color: "#FF6B7A",
              fontSize: 13,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
            }}
          >
            🔥 Oops — Hit a wall!
          </p>
          <p style={{ margin: "0 0 8px 0", color: "var(--text-primary)" }}>
            {content}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 12.5,
              color: "var(--text-muted)",
            }}
          >
            Thoda wait karo aur try karo — the roaster needs a chai break ☕
          </p>
        </div>
      </div>
    );
  }

  // ─── Normal message rendering ────────────────────────
  return (
    <div
      className={isUser ? "animate-slide-in-right" : "animate-slide-in-left"}
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        alignItems: "flex-start",
        gap: 10,
        padding: "4px 16px",
        width: "100%",
      }}
    >
      {/* AI avatar — left side */}
      {!isUser && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "var(--accent-gradient)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            flexShrink: 0,
            marginTop: 2,
          }}
        >
          🔥
        </div>
      )}

      {/* Message content */}
      <div
        className={isUser ? "msg-user" : "msg-ai"}
        style={{
          maxWidth: "75%",
          padding: "12px 16px",
          fontSize: 14.5,
          lineHeight: 1.65,
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
        }}
      >
        <span className={isStreaming && !isUser ? "typing-cursor" : ""}>
          {content}
        </span>
      </div>

      {/* User avatar — right side */}
      {isUser && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border-medium)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            flexShrink: 0,
            marginTop: 2,
            color: "var(--text-secondary)",
          }}
        >
          👤
        </div>
      )}
    </div>
  );
}
