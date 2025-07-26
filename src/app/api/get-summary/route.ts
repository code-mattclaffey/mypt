import { NextRequest, NextResponse } from "next/server";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: "eu-west-2",
  credentials: {
    accessKeyId: process.env.NEXT_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      entries,
      weekStart,
      currentWeight,
      goalWeight,
      startWeight,
      targetDate,
      height,
      sex,
      activityLevel,
    } = body;

    const prompt = `You are a professional AI personal trainer and nutritionist. Analyze this health data and provide personalized recommendations.

User Profile:
- Current Weight: ${currentWeight}kg
- Goal Weight: ${goalWeight}kg
- Start Weight: ${startWeight}kg
- Height: ${height}cm
- Sex: ${sex}
- Activity Level: ${activityLevel}/5
- Target Date: ${targetDate}

Recent Activity Data:
${JSON.stringify(entries, null, 2)}

Progress Summary:
- Weight Lost: ${(startWeight - currentWeight).toFixed(1)}kg
- Remaining to Goal: ${(currentWeight - goalWeight).toFixed(1)}kg
- Days to Target: ${Math.ceil(
      (new Date(targetDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    )}

Provide a comprehensive analysis including:
1. Progress assessment
2. Specific recommendations for diet and exercise
3. Motivation and encouragement
4. Suggested daily calorie target
5. Suggested daily step target
6. Any goal weight adjustments if needed

Respond in JSON format:
{
  "summary": "detailed analysis and recommendations",
  "newGoalWeight": number,
  "recommendedCalories": number,
  "recommendedSteps": number
}`;

    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    // Parse AI response
    let aiResponse;
    try {
      aiResponse = JSON.parse(responseBody.content[0].text);
    } catch {
      // Fallback if AI doesn't return valid JSON
      aiResponse = {
        summary: responseBody.content[0].text,
        newGoalWeight: goalWeight,
        recommendedCalories: Math.round(
          2000 - (currentWeight - goalWeight) * 50
        ),
        recommendedSteps: Math.min(
          12000,
          8000 + Math.round((currentWeight - goalWeight) * 200)
        ),
      };
    }

    return NextResponse.json(aiResponse);
  } catch (error) {
    console.error("Error in get-summary API:", error);

    // Fallback to mock response if Bedrock fails
    const mockResponse = {
      summary: `Based on your recent activity, you're making progress toward your goal. Continue with consistent effort and healthy habits.\n\nRecommendations:\n• Maintain a balanced diet\n• Stay active with regular exercise\n• Monitor your progress weekly\n• Stay hydrated and get adequate sleep`,
      newGoalWeight: 70,
      recommendedCalories: 2000,
      recommendedSteps: 10000,
    };

    return NextResponse.json(mockResponse);
  }
}
