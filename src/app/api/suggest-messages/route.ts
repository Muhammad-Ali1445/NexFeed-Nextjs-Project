import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const prompt = `
    Create a list of three open-ended and engaging questions formatted as a single string. 
    Each question should be separated by '||'. These questions are for an anonymous social messaging platform like Qooh.me. 
    Avoid personal or sensitive topics, and focus on universal, friendly, and positive themes.
    Example output: "What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?"
    `;

    const result = await streamText({
      model: openai("gpt-4o"),
      prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
