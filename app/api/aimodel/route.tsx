import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic"; // ✅ VERY IMPORTANT

const PROMPT = `...`;
const FINAL_PROMPT = `...`;

export async function POST(req: NextRequest) {
  try {
    const { messages, isFinal } = await req.json();

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("Missing OPENROUTER_API_KEY");
    }

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: isFinal ? FINAL_PROMPT : PROMPT,
        },
        ...messages,
      ],
    });

    const message = completion.choices[0].message;

    return NextResponse.json(JSON.parse(message.content ?? "{}"));
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e.message || "Something went wrong" },
      { status: 500 }
    );
  }
}