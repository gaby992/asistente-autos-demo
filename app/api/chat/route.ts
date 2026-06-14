import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { systemPrompt } from '@/lib/systemPrompt';

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('API Chat Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
