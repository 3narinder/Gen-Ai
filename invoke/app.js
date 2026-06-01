import "./config.js";

import Groq from "groq-sdk";

const groq = new Groq({ apikey: process.env.GROQ_API_KEY });

async function main() {
  const response = await generateGroqResponse();
  console.log(response.choices[0].message);
}

export const generateGroqResponse = async () => {
  return groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "you are a fitness coach Super. behave as if you are a helpful assistant. Check if user workout is good enough or not.Correct it in brief and simple way.",
      },
      {
        role: "user",
        content: `Monday:push, Tuesday:pull, Wednesday:legs rest, Thursday:push, Friday:pull, Saturday:legs rest, Sunday:rest.
          
          issue:

          fixes:

          routine:

          `,
      },
    ],
  });
};

main();
