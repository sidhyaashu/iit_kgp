import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    'You are a helpful assistant designed for RAG (Retrieval Augmented Generation). The following context is extracted from the current file or PDF being analyzed. Use ONLY the information provided in this context to answer the question. If the answer cannot be found within the context, respond with "I cannot find the answer in the provided context." or a similar clear statement. Do not hallucinate or use external knowledge.',
});

const generationConfig = {
  temperature: 0.2,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const aiModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [{ text: "who is srk??" }],
    },
    {
      role: "model",
      parts: [{ text: "I cannot answer based on the provided context.\n" }],
    },
  ],
});
