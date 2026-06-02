import "./config.js";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateFitnessPlan = async () => {
  return groq.chat.completions.create({
    temperature: 0,
    model: "llama-3.3-70b-versatile",
    response_format: {
      type: "json_",
      json_schema: {
        name: "fitness_and_diet_plan",
        strict: true, // Forces 100% accurate structural matching
        schema: {
          type: "object",
          properties: {
            personal_info: {
              type: "object",
              properties: {
                name: { type: "string" },
                age: { type: "number" },
                height: { type: "string" },
                weight: { type: "number" },
                lifestyle: { type: "string" },
                dietary_preference: { type: "string" },
              },
              required: [
                "name",
                "age",
                "height",
                "weight",
                "lifestyle",
                "dietary_preference",
              ],
              additionalProperties: false,
            },
            workout_plan: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  day: { type: "string" },
                  exercises: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        sets: { type: "number" },
                        reps: { type: "number" },
                        rest_time: { type: "string" },
                      },
                      required: ["name", "sets", "reps", "rest_time"],
                      additionalProperties: false,
                    },
                  },
                  meal_plan: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        meal_name: { type: "string" }, // e.g., "Breakfast", "Post-Workout Snack"
                        description: { type: "string" }, // e.g., "Oatmeal with protein powder"
                      },
                      required: ["meal_name", "description"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["day", "exercises", "meal_plan"],
                additionalProperties: false,
              },
            },
          },
          required: ["personal_info", "workout_plan"],
          additionalProperties: false,
        },
      },
    },
    messages: [
      {
        role: "system",
        content:
          "You are an expert personal trainer and nutritionist. Generate customized plans based on user data.",
      },
      {
        role: "user",
        content:
          "Create a plan for Alex, a 28-year-old software engineer. Height: 5'11, Weight: 180 lbs. Sedentary lifestyle, prefers a high-protein vegetarian diet.",
      },
    ],
  });
};

async function main() {
  try {
    const response = await generateFitnessPlan();
    console.log(JSON.stringify(response.choices[0].message.content, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
