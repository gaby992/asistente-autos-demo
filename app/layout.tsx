import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Max · Asistente de Ventas',
  description: 'Tu asesor de autos, disponible 24/7. Cuéntame qué buscas y te conecto con tu asesor para cerrar el trato.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
