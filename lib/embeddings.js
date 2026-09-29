import OpenAI from "openai";

let client;

export function getGemini() {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error("Gemini is not configured. Add GEMINI_API_KEY to the server environment.");
    error.code = "GEMINI_NOT_CONFIGURED";
    throw error;
  }

  if (!client) {
    client = new OpenAI({
      apiKey: process.env.GEMINI_API_KEY,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    });
  }
  return client;
}

export async function embedText(text) {
  const response = await getGemini().embeddings.create({
    model: "gemini-embedding-001",
    input: text,
  });
  return response.data[0].embedding;
}

export async function embedChunks(chunks) {
  const embeddings = [];
  for (let start = 0; start < chunks.length; start += 100) {
    const response = await getGemini().embeddings.create({
      model: "gemini-embedding-001",
      input: chunks.slice(start, start + 100),
    });
    embeddings.push(...response.data.map((item) => item.embedding));
  }
  return embeddings;
}
