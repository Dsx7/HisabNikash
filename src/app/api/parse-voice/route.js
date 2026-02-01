import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // 1. Parse the incoming form data
    // This handles the 'application/x-www-form-urlencoded' sent by your frontend
    const formData = await req.formData();
    
    // 2. Extract the text
    const text = formData.get('text');
    const file = formData.get('file'); // Kept for future flexibility if you upload files later

    // 3. Validate Input
    if (!text && !file) {
      return NextResponse.json(
        { success: false, error: "No text or audio file found" },
        { status: 400 }
      );
    }

    // 4. Determine the input string
    let inputString = text;

    if (!inputString && file) {
      // If you eventually decide to support file uploads again, 
      // you would add your Whisper API logic here.
      return NextResponse.json(
        { success: false, error: "Audio file processing is not enabled yet. Please send text." },
        { status: 501 }
      );
    }

    console.log("Server received text:", inputString);

    // 5. PARSE THE TEXT (Simulated AI Logic)
    // In a real production app, you would send 'inputString' to OpenAI/Gemini here.
    // For now, we use basic Javascript to parse "500 টাকার বাজার" so it works immediately.

    // Extract Number (Amount)
    const amountMatch = inputString.match(/[0-9٠-٩]+/); // Matches English or Bengali digits
    const amount = amountMatch ? parseInt(amountMatch[0]) : 0;

    // Extract Category (Simple keyword matching)
    let category = "Uncategorized";
    const lowerText = inputString.toLowerCase();
    
    if (lowerText.includes("বাজার") || lowerText.includes("shop") || lowerText.includes("buy")) {
      category = "Shopping";
    } else if (lowerText.includes("ভাড়া") || lowerText.includes("fare") || lowerText.includes("rickshaw")) {
      category = "Transport";
    } else if (lowerText.includes("খাবার") || lowerText.includes("food")) {
      category = "Food";
    }

    // 6. Return the structured data
    return NextResponse.json({
      success: true,
      data: {
        originalText: inputString,
        parsedData: {
          amount: amount,
          category: category,
          description: inputString,
          date: new Date().toISOString(),
          type: 'expense' // Default assumption
        }
      }
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}