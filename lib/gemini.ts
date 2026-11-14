import { z } from "zod";

export const GenerationSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
});

export class AIError extends Error {
  constructor(message: string, public status = 502) { super(message); }
}

/** Calls Gemini and returns validated {title, content}. Throws AIError with a user-safe message. */
export async function generateJSON(system: string, prompt: string) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new AIError("AI is not configured yet. Add GEMINI_API_KEY to the server environment.", 503);
  const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: { title: { type: "STRING" }, content: { type: "STRING" } },
          required: ["title", "content"],
        },
        temperature: 0.8,
      },
    }),
  });
  if (res.status === 429) throw new AIError("The AI provider is rate limiting requests. Try again in a minute.", 429);
  if (!res.ok) throw new AIError("The AI provider returned an error. Please try again.");
  const data = await res.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new AIError("The AI returned no content. Try rephrasing your request.");
  try {
    return GenerationSchema.parse(JSON.parse(text));
  } catch {
    throw new AIError("The AI response could not be read. Please try again.");
  }
}
