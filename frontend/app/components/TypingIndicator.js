"use client";

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-4 py-2 animate-fade-in">
      {/* AI avatar */}
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
        }}
      >
        🔥
      </div>

      {/* Bouncing dots */}
      <div
        className="glass"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "12px 18px",
          borderRadius: "var(--radius-lg)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="dot-bounce"
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--accent-orange)",
              display: "inline-block",
            }}
          />
        ))}
      </div>
    </div>
  );
}
