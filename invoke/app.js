import "./config.js";

import Groq from "groq-sdk";

const groq = new Groq({ apikey: process.env.GROQ_API_KEY });

async function main() {
  const response = await generateGroqResponse();
  console.log(response);
}

export const generateGroqResponse = async () => {
  return groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: "hi" }],
  });
};

main();
