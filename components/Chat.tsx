"use client";

import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

// Marca del asistente (white-label: cambia aquí nombre, inicial y subtítulo).
const ASSISTANT_NAME = "Max";
const ASSISTANT_INITIAL = "M";
const ASSISTANT_SUBTITLE = "Asistente de Ventas";

const WELCOME: Message = {
  role: "assistant",
  content:
    "¡Hola! Soy Max 👋 tu asistente de ventas. ¿Buscas auto nuevo o seminuevo?",
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setError(null);
    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok || !res.body) {
        throw new Error("bad response");
      }

      // Insertamos una burbuja vacía del asistente y la vamos llenando con el stream.
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }

      // Si el stream no devolvió nada, dejamos un mensaje de cortesía.
      if (!acc.trim()) {
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "assistant",
            content: "Perdón, no te entendí bien. ¿Me lo repites? 🙂",
          };
          return copy;
        });
      }
    } catch {
      setError("Ups, hubo un problema de conexión. Intenta de nuevo.");
      // Revertimos el placeholder vacío si quedó.
      setMessages((prev) => {
        if (prev[prev.length - 1]?.role === "assistant" && !prev[prev.length - 1].content) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 440,
        margin: "0 auto",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 18,
        overflow: "hidden",
        height: "min(74vh, 620px)",
        boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
      }}
    >
      {/* Header del widget */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 16px",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface)",
        }}
      >
        <Avatar size={40} online />
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>{ASSISTANT_NAME}</span>
          <span style={{ fontSize: 12.5, color: "var(--text-dim)" }}>
            {ASSISTANT_SUBTITLE}
          </span>
        </div>
        <span
          style={{
            marginLeft: "auto",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "var(--text-dim)",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--online)",
              boxShadow: "0 0 0 3px rgba(34,197,94,0.18)",
            }}
          />
          En línea
        </span>
      </div>

      {/* Mensajes */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {messages.map((m, i) => (
          <Row key={i} role={m.role} content={m.content} />
        ))}

        {loading &&
          messages[messages.length - 1]?.role === "user" && (
            <Row role="assistant" content="…" typing />
          )}
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            color: "#ff8a8a",
            fontSize: 13,
            padding: "0 16px 8px",
          }}
        >
          {error}
        </div>
      )}

      {/* Input */}
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: 12,
          borderTop: "1px solid var(--border)",
          background: "var(--surface)",
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Escribe tu mensaje…"
          rows={1}
          aria-label="Escribe tu mensaje"
          style={{
            flex: 1,
            resize: "none",
            background: "var(--surface-2)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "12px 14px",
            fontSize: 15,
            outline: "none",
            maxHeight: 120,
            lineHeight: 1.4,
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          aria-label="Enviar"
          style={{
            background: "var(--accent)",
            color: "var(--accent-text)",
            border: "none",
            borderRadius: 12,
            padding: "0 18px",
            fontSize: 15,
            fontWeight: 600,
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            opacity: loading || !input.trim() ? 0.5 : 1,
            transition: "opacity 0.15s ease",
          }}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

// Avatar circular del bot con inicial. `online` agrega el punto verde (header).
function Avatar({ size = 28, online = false }: { size?: number; online?: boolean }) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: "var(--accent)",
          color: "var(--accent-text)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: size * 0.45,
        }}
      >
        {ASSISTANT_INITIAL}
      </div>
      {online && (
        <span
          style={{
            position: "absolute",
            right: -1,
            bottom: -1,
            width: 11,
            height: 11,
            borderRadius: "50%",
            background: "var(--online)",
            border: "2px solid var(--surface)",
          }}
        />
      )}
    </div>
  );
}

// Una fila de mensaje. El asistente lleva avatar a la izquierda; el usuario va a la derecha.
function Row({
  role,
  content,
  typing,
}: {
  role: "user" | "assistant";
  content: string;
  typing?: boolean;
}) {
  const isUser = role === "user";

  const bubble = (
    <div
      style={{
        maxWidth: "100%",
        padding: "10px 14px",
        borderRadius: 14,
        fontSize: 15,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        background: isUser ? "var(--accent)" : "var(--surface-2)",
        color: isUser ? "var(--accent-text)" : "var(--text)",
        borderBottomRightRadius: isUser ? 4 : 14,
        borderBottomLeftRadius: isUser ? 14 : 4,
      }}
    >
      {typing ? (
        <span style={{ opacity: 0.85, letterSpacing: 2 }}>•••</span>
      ) : (
        content
      )}
    </div>
  );

  if (isUser) {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{ maxWidth: "82%" }}>{bubble}</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "flex-start", gap: 8, alignItems: "flex-end" }}>
      <Avatar size={28} />
      <div style={{ maxWidth: "82%" }}>{bubble}</div>
    </div>
  );
}
