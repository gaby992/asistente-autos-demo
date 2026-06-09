import OpenAI from "openai";
import { systemPrompt } from "@/lib/systemPrompt";

// Corre en el runtime de Node y nunca se cachea (cada turno es fresco).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ClientMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response("Falta configurar OPENAI_API_KEY.", { status: 500 });
  }

  // Instanciamos el cliente dentro del handler para no romper el build sin la key.
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  let messages: ClientMessage[] = [];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return new Response("Cuerpo de la petición inválido.", { status: 400 });
  }

  // Solo dejamos pasar role + content de texto; el system prompt vive aquí, en el servidor.
  const history = messages
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string"
    )
    .map((m) => ({ role: m.role, content: m.content }));

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      temperature: 0.7,
      messages: [{ role: "system", content: systemPrompt }, ...history],
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) controller.enqueue(encoder.encode(delta));
          }
        } catch (err) {
          console.error("Error durante el streaming de OpenAI:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Error llamando a OpenAI:", err);
    return new Response("No pude conectar con el asistente. Intenta de nuevo.", {
      status: 502,
    });
  }
}
