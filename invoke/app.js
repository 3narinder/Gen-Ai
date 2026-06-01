import "./config.js";

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateGroqResponse = async () => {
  return groq.chat.completions.create({
    temperature: 0,
    frequency_penalty: 0,
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "You are a creative writer.",
      },
      {
        role: "user",
        content:
          "Give me a unique, 1-sentence sci-fi story idea about a time traveler.",
      },
    ],
  });
};

async function main() {
  const resp1 = await generateGroqResponse();
  console.log(resp1.choices[0].message.content);
}

main();
