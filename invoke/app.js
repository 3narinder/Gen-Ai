import "./config.js";
import Groq from "groq-sdk";
import { tavily } from "@tavily/core";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function webSearch({ query }) {
  // Here you will handle your Tavily API call

  console.log(`Performing web search for query: ${query}...`);

  const response = await tvly.search(query);

  const finalResult = response.results
    .map((result) => result.content)
    .join("\n\n---\n\n");
  console.log(finalResult);
}

export const generateResult = async () => {
  const messages = [
    {
      role: "system",
      content: `You are a smart personal assistant who answers questions using the tools provided if needed. You have access to the following tools:
        
        1.SearchWeb({query}:{query:string})//The search query to find the latest information (e.g., 'USD to INR exchange rate')`,
    },
    {
      role: "user",
      content: "Latest USD to INR exchange rate?",
    },
  ];

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    messages: messages,
    tools: [
      {
        type: "function",
        function: {
          name: "webSearch",
          description:
            "Search the web to retrieve up-to-date and real-time information on a given topic or query.",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description:
                  "The search query to find the latest information (e.g., 'USD to INR exchange rate')",
              },
            },
            required: ["query"],
          },
        },
      },
    ],
    tool_choice: "auto",
  });

  messages.push(response.choices[0].message);

  const toolCalls = response.choices[0].message.tool_calls;

  if (!toolCalls) {
    console.log(`Assistant: ${response.choices[0].message.content}`);
    return;
  }

  for (const tool of toolCalls) {
    const functionName = tool.function.name;
    const functionParameters = tool.function.arguments;

    if (functionName === "webSearch") {
      const toolResponse = await webSearch(JSON.parse(functionParameters));

      messages.push({
        tool_call_id: tool.id,
        role: "tool",
        name: functionName,
        content: toolResponse,
      });
    }
  }

  const response2 = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    messages: messages,

    tools: [
      {
        type: "function",
        function: {
          name: "webSearch",
          description:
            "Search the web to retrieve up-to-date and real-time information on a given topic or query.",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description:
                  "The search query to find the latest information (e.g., 'USD to INR exchange rate')",
              },
            },
            required: ["query"],
          },
        },
      },
    ],
    tool_choice: "auto",
  });

  console.log(JSON.stringify(response2.choices[0].message, null, 2));
};

async function main() {
  try {
    const finalAnswer = await generateResult();
    console.log(`\n[Final Answer]: ${finalAnswer}`);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
