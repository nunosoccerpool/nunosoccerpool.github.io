import { FAQ } from '../faq.js';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const { messages } = req.body;

  const system = `You are a helpful assistant for Nuno's Soccer Pool.
  Answer questions only about the pool using the information below.
  Be friendly and concise. If someone asks something not covered below,
  say "I don't have that info — please contact the pool admin directly."

  ${FAQ}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: messages.map(m => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }]
        })),
        generationConfig: { maxOutputTokens: 512 }
      })
    }
  );

  const data = await response.json();
  const reply = data.candidates[0].content.parts[0].text;
  res.status(200).json({ reply });
}