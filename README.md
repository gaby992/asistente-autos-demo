# asistente-autos-demo

Web demo white-label: **Max · Asistente de Ventas** — un chat agent embebido en una landing, como herramienta de venta para mostrar en vivo un asistente automotriz. NO es producción.

- El agente califica al prospecto y lo pasa a un asesor humano (no cierra la venta, no muestra inventario).
- Sin backend de persistencia: el lead se resume dentro del chat. La escalación es simulada (texto).

## Stack

- Next.js 14 (App Router) + OpenAI API (`gpt-4o-mini`).
- Estado de la conversación en React (`useState`). Sin DB.
- El system prompt vive **solo en el servidor** (`/lib/systemPrompt.ts`, consumido por `/app/api/chat/route.ts`). Nunca se expone en el cliente.

## Estructura

```
/app
  page.tsx              -> landing + chat
  /api/chat/route.ts    -> handler servidor: OpenAI con system prompt + historial (streaming)
/components
  Chat.tsx              -> UI del chat (useState)
/lib
  systemPrompt.ts       -> system prompt (string)
```

## Correr local

```bash
npm install
cp .env.local.example .env.local   # pon tu OPENAI_API_KEY real
npm run dev
```

Abre http://localhost:3000

## Variables de entorno

- `OPENAI_API_KEY` — **nunca** va en el repo. En local va en `.env.local` (ignorado por git); en Vercel va en Project Settings → Environment Variables.

## Deploy a Vercel

1. Importa el repo en Vercel (Add New → Project → este repo de GitHub).
2. Framework: Next.js (autodetectado). No cambies build/output settings.
3. En **Environment Variables** agrega `OPENAI_API_KEY` con tu key real.
4. Deploy.

## Personalización (2 min, opcional)

En `lib/systemPrompt.ts`: nombre del asistente (default Max), ciudad/zona, plazos, tiempos de entrega, promos.
En `app/globals.css`: tokens de color (acento default azul `#2E6BFF`).
