import "./config.js";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateGroqResponse = async () => {
  return groq.chat.completions.create({
    temperature: 0,
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are a data extractor. Parse the text and respond ONLY in JSON format.",
      },
      {
        role: "user",
        content: "John Doe is 30 years old and lives in New York.",
      },
    ],
  });
};
async function main() {
  const resp1 = await generateGroqResponse();
  console.log(resp1.choices[0].message.content);
}

main();
