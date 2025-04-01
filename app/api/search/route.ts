import { NextRequest, NextResponse } from "next/server";
import { AzureOpenAI } from "openai/index.mjs";

const openai = new AzureOpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  apiVersion: "2024-10-01-preview",
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  deployment: process.env.AZURE_OPENAI_GPT_DEPLOYMENT
});

export async function POST(req: NextRequest) {
  const { systemPrompt, product } = await req.json();
  console.log("Request started")

  const response = await openai.chat.completions.create({
    model: process.env.AZURE_OPENAI_GPT_DEPLOYMENT ?? "",
    messages: [{ role: "system", content: systemPrompt }, ...product],
  });
  console.log(response)
  return NextResponse.json({ reply: response.choices[0].message.content });
}