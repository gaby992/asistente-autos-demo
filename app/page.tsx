import Chat from "@/components/Chat";

export default function Page() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {/* Hueco para logo (opcional) */}
        <div
          aria-hidden
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            color: "var(--accent-text)",
            flexShrink: 0,
          }}
        >
          M
        </div>
        <span style={{ fontWeight: 600, fontSize: 16 }}>
          Max · Asistente de Ventas
        </span>
      </header>

      {/* Contenido */}
      <div
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 720,
          margin: "0 auto",
          padding: "28px 16px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Hero */}
        <section style={{ textAlign: "center", padding: "8px 4px" }}>
          <h1
            style={{
              fontSize: "clamp(26px, 6vw, 38px)",
              lineHeight: 1.15,
              margin: "0 0 10px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Tu asesor de autos, disponible 24/7
          </h1>
          <p
            style={{
              color: "var(--text-dim)",
              fontSize: "clamp(15px, 3.5vw, 17px)",
              margin: 0,
              maxWidth: 520,
              marginInline: "auto",
            }}
          >
            Cuéntame qué buscas y te conecto con tu asesor para cerrar el trato.
          </p>
        </section>

        {/* Chat — protagonista */}
        <Chat />
      </div>

      {/* Footer mínimo */}
      <footer
        style={{
          textAlign: "center",
          padding: "16px",
          color: "var(--text-dim)",
          fontSize: 13,
          borderTop: "1px solid var(--border)",
        }}
      >
        Demo — Arroyo
      </footer>
    </main>
  );
}
