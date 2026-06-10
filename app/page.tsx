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
      {/* Chat — widget contenido (simula la pantalla de un celular) */}
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
