import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { node, architecture } = await request.json();

    if (!node) {
      return NextResponse.json(
        { error: "A node is required" },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      input: `
You are Blueprint, an AI product designer.

Generate a low-fidelity desktop UI wireframe for the selected product feature.

SELECTED FEATURE:
${JSON.stringify(node)}

ARCHITECTURE:
${JSON.stringify(architecture)}

Return ONLY valid JSON in this structure:

{
  "screen": {
    "name": "Screen name",
    "width": 1440,
    "height": 900
  },
  "elements": [
    {
      "id": "unique-id",
      "type": "navbar | sidebar | header | card | button | input | table | text",
      "x": 0,
      "y": 0,
      "width": 100,
      "height": 50,
      "text": "optional text"
    }
  ]
}

IMPORTANT LOCALIZATION:
- Assume the primary audience is in India.
- Use Indian currency (INR) with the ₹ symbol.
- Use the Indian numbering system for amounts:
  - ₹1,000
  - ₹25,000
  - ₹1,25,000
  - ₹12,50,000
  - ₹1.5 Cr
  - ₹25 Lakh
- Never use "$", USD, or western comma grouping such as $100,000.
- Use Indian-style examples for phone numbers, addresses, GSTIN, PIN codes, etc. when relevant.
- Use Indian date conventions such as DD/MM/YYYY when dates are needed.
- Use Indian names and realistic Indian business/user examples when appropriate.

IMPORTANT CONTEXT:
- Assume the product is primarily designed for users in India unless the user specifies otherwise.
- When generating example business/payment/ecommerce systems, use INR (₹) and Indian market conventions where relevant.
- Prefer examples such as UPI, Razorpay, GST, Aadhaar-based verification, Indian payment flows, etc. only when relevant to the requested product.
- Do not force Indian-specific services when they are not relevant.

WIREFrame REQUIREMENTS:
- Generate a low-fidelity but realistic UI.
- Return JSON only.
- Use 8–20 elements.
- Keep all elements within a 1440 × 900 canvas.
- Use only these element types:
  navbar | sidebar | header | card | button | input | table | text

UI CONTENT RULES:
- Generate realistic, meaningful UI copy rather than placeholder text.
- Use concise product labels, headings and descriptions.
- For dashboards, include realistic metrics and data.
- Use Indian names, ₹ INR amounts and Indian date formats where relevant.
- Use status values such as Completed, Pending, Failed when appropriate.
- Prefer realistic product-specific labels instead of generic "Card 1", "Button", "Text", etc.
- Design the screen as a coherent product interface, not a collection of unrelated boxes.

Rules:
- Create a practical UI for the selected feature.
- Use 8-20 elements.
- Keep all elements inside 1440x900.
- Use a sidebar when appropriate for dashboards/admin interfaces.
- Use cards for metrics or summary information.
- Use tables for lists of records.
- Use buttons for primary actions.
- Use inputs for search/forms.
- Use text for titles and supporting information.
- Avoid unnecessary decorative elements.
- This is a low-fidelity wireframe, not a final visual design.
- Return JSON only.
      `,
    });

    const wireframe = JSON.parse(response.output_text);

    return NextResponse.json(wireframe);
  } catch (error) {
    console.error("Wireframe generation error:", error);

    return NextResponse.json(
      { error: "Failed to generate wireframe" },
      { status: 500 }
    );
  }
}