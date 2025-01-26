import { GoogleGenerativeAI } from "@google/generative-ai";

// const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey as string);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You are a good assistant i want to use you like a RAG application just give me answer based on the provided context.",
});

const generationConfig = {
  temperature: 1,
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
      parts: [{ text: "who is SRK ??" }],
    },
    {
      role: "model",
      parts: [
        {
          text: "Please provide me with the context. I need some information about SRK to answer your question.\n",
        },
      ],
    },
  ],
});
