import Chat from "@/components/Chat";

export default function Page() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        gap: 22,
      }}
    >
      {/* Hero */}
      <section style={{ textAlign: "center", maxWidth: 560 }}>
        <h1
          style={{
            fontSize: "clamp(24px, 5.5vw, 34px)",
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
            fontSize: "clamp(14px, 3.5vw, 16px)",
            margin: 0,
            maxWidth: 460,
            marginInline: "auto",
          }}
        >
          Cuéntame qué buscas y te conecto con tu asesor para cerrar el trato.
        </p>
      </section>

      {/* Chat — widget contenido */}
      <Chat />

      {/* Footer mínimo */}
      <footer
        style={{
          color: "var(--text-dim)",
          fontSize: 12.5,
        }}
      >
        Demo — Arroyo
      </footer>
    </main>
  );
}
