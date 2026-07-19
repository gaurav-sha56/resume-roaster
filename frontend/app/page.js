"use client";

import { useState, useCallback, useRef } from "react";
import LandingHero from "./components/LandingHero";
import ChatWindow from "./components/ChatWindow";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";


export default function Home() {
  // State: "idle" | "uploading" | "chatting"
  const [appState, setAppState] = useState("idle");
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isWaitingForStream, setIsWaitingForStream] = useState(false);
  const [resumeText, setResumeText] = useState("");

  // Abort controller for cancelling streams
  const abortRef = useRef(null);

  // ─── Stream SSE response ──────────────────────────────
  const readSSEStream = useCallback(async (response, { onToken, onDone, onMeta, onError }) => {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop(); // keep incomplete line in buffer

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === "token") {
              onToken(data.content);
            } else if (data.type === "meta" && onMeta) {
              onMeta(data);
            } else if (data.type === "error" && onError) {
              onError(data);
            } else if (data.type === "done") {
              onDone();
            }
          } catch {
            // skip malformed JSON
          }
        }
      }
    }
  }, []);

  // ─── Upload & Roast ───────────────────────────────────
  const handleUpload = useCallback(
    async (file) => {
      setAppState("uploading");
      setIsWaitingForStream(true);

      const formData = new FormData();
      formData.append("file", file);

      try {
        abortRef.current = new AbortController();

        const response = await fetch(`${API_BASE}/roast-stream`, {
          method: "POST",
          body: formData,
          signal: abortRef.current.signal,
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.detail || "Failed to roast resume");
        }

        let streamedContent = "";
        let savedResumeText = "";

        // Add empty AI message that we'll fill with streamed tokens
        setMessages([]);
        setAppState("chatting");

        await readSSEStream(response, {
          onToken: (token) => {
            setIsWaitingForStream(false);
            setIsStreaming(true);
            streamedContent += token;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.role === "assistant") {
                return [
                  ...prev.slice(0, -1),
                  { role: "assistant", content: streamedContent },
                ];
              } else {
                return [
                  ...prev,
                  { role: "assistant", content: streamedContent },
                ];
              }
            });
          },
          onDone: () => {
            setIsStreaming(false);
            setIsWaitingForStream(false);
          },
          onMeta: (meta) => {
            if (meta.resume_text) {
              savedResumeText = meta.resume_text;
              setResumeText(meta.resume_text);
            }
          },
          onError: (error) => {
            setIsStreaming(false);
            setIsWaitingForStream(false);
            setMessages((prev) => [
              ...prev.filter((m) => m.role !== "assistant" || m.content),
              { role: "error", content: error.message },
            ]);
          },
        });
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Upload error:", err);
        setIsStreaming(false);
        setIsWaitingForStream(false);
        // Show error in chat if already in chat mode, otherwise go back to idle
        if (appState === "chatting" || messages.length > 0) {
          setMessages((prev) => [
            ...prev,
            { role: "error", content: err.message || "Something went wrong. Try again!" },
          ]);
        } else {
          setAppState("idle");
          alert(err.message || "Something went wrong. Try again!");
        }
      }
    },
    [readSSEStream]
  );

  // ─── Send follow-up chat ──────────────────────────────
  const handleSendMessage = useCallback(
    async (text) => {
      // Build full history for the API
      const userMessage = { role: "user", content: text };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setIsWaitingForStream(true);

      // Build history payload — backend prepends system prompt server-side
      const historyPayload = [
        { role: "user", content: `Roast this resume:\n\n${resumeText}` },
        ...newMessages,
      ];

      try {
        abortRef.current = new AbortController();

        const response = await fetch(`${API_BASE}/chat-stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(historyPayload),
          signal: abortRef.current.signal,
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.detail || "Failed to get reply");
        }

        let streamedContent = "";

        await readSSEStream(response, {
          onToken: (token) => {
            setIsWaitingForStream(false);
            setIsStreaming(true);
            streamedContent += token;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.role === "assistant") {
                return [
                  ...prev.slice(0, -1),
                  { role: "assistant", content: streamedContent },
                ];
              } else {
                return [
                  ...prev,
                  { role: "assistant", content: streamedContent },
                ];
              }
            });
          },
          onDone: () => {
            setIsStreaming(false);
            setIsWaitingForStream(false);
          },
          onError: (error) => {
            setIsStreaming(false);
            setIsWaitingForStream(false);
            setMessages((prev) => [
              ...prev,
              { role: "error", content: error.message },
            ]);
          },
        });
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Chat error:", err);
        setIsStreaming(false);
        setIsWaitingForStream(false);
        setMessages((prev) => [
          ...prev,
          {
            role: "error",
            content: err.message || "Something went wrong. Try again!",
          },
        ]);
      }
    },
    [messages, resumeText, readSSEStream]
  );

  // ─── New Roast ────────────────────────────────────────
  const handleNewRoast = useCallback(() => {
    // Abort any in-flight stream
    if (abortRef.current) abortRef.current.abort();
    setMessages([]);
    setResumeText("");
    setIsStreaming(false);
    setIsWaitingForStream(false);
    setAppState("idle");
  }, []);

  // ─── Render ───────────────────────────────────────────
  if (appState === "idle") {
    return (
      <LandingHero
        onUpload={handleUpload}
        loading={false}
      />
    );
  }

  if (appState === "uploading") {
    return <LandingHero onUpload={handleUpload} loading={true} />;
  }

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSendMessage}
      isStreaming={isStreaming}
      isWaitingForStream={isWaitingForStream}
      onNewRoast={handleNewRoast}
    />
  );
}
