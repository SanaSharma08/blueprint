import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { prompt, currentArchitecture } = await request.json();

    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const existingArchitecture =
      currentArchitecture || {
        nodes: [],
        edges: [],
      };

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      input: `
You are Blueprint, an AI software architecture designer.

The user wants to create or modify a software architecture.

Return ONLY valid JSON in this exact structure:

{
  "nodes": [
    {
      "id": "unique-id",
      "type": "user | application | feature | service | database | external",
      "label": "Node name",
      "description": "Short description"
    }
  ],
  "edges": [
    {
      "source": "node-id",
      "target": "node-id",
      "label": "relationship"
    }
  ]
}

Rules:
- Preserve useful existing nodes unless the user's request requires changing them.
- Add, remove, or modify nodes based on the user's request.
- Every edge must reference an existing node.
- Create a clear and realistic architecture.
- Avoid unnecessary nodes.
- Use 5-15 nodes.
- Return JSON only.

CURRENT ARCHITECTURE:
${JSON.stringify(existingArchitecture)}

USER REQUEST:
${prompt}
      `,
    });

    const architecture = JSON.parse(response.output_text);

    return NextResponse.json(architecture);
  } catch (error) {
    console.error("Generation error:", error);

    return NextResponse.json(
      { error: "Failed to generate architecture" },
      { status: 500 }
    );
  }
}