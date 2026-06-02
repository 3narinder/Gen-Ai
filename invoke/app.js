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
          "You are a fitness coach. Extract the data of person and create a reasonable workout plan for them. Give output in json format",
      },
      {
        role: "user",
        content:
          "John Doe is 30 years old and lives in New York. vegetarian, 105 kg, 5 feet 10 inches tall, and has a sedentary lifestyle. He wants to lose weight and improve his overall fitness. Can you create a workout plan for him?",
      },
    ],
  });
};
async function main() {
  const resp1 = await generateGroqResponse();
  console.log(resp1.choices[0].message.content);
}

main();
