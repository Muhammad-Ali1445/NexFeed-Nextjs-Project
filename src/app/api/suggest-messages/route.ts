import OpenAI from "openai";

export async function GET() {
  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = "Give me 5 short suggestions for messages separated by ||";

    const completion = await client.responses.create({
      model: "gpt-4o-mini", // FREE MODEL
      input: prompt,
    });

    const text = completion.output_text;

    return new Response(JSON.stringify({ data: text }), { status: 200 });

  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: true, message: err.message }),
      { status: 500 }
    );
  }
}
