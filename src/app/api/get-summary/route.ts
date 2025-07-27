import { NextRequest, NextResponse } from "next/server";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { fromEnv } from "@aws-sdk/credential-provider-env";

const client = new BedrockRuntimeClient({
  region: "eu-west-2",
  credentials: fromEnv(),
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

    const prompt = `You are an empathetic and supportive personal trainer speaking directly to your client. Be warm, encouraging, and understanding while providing professional guidance. Address them as "you" and speak as if you're having a personal conversation.

Your Client's Profile:
- Current Weight: ${currentWeight}kg
- Goal Weight: ${goalWeight}kg
- Starting Weight: ${startWeight}kg
- Height: ${height}cm
- Sex: ${sex}
- Activity Level: ${activityLevel}/5
- Target Date: ${targetDate}

Recent Activity Data (focus on the last 7 days):
${JSON.stringify(entries, null, 2)}

Progress Summary:
- Weight Lost So Far: ${(startWeight - currentWeight).toFixed(1)}kg
- Remaining to Goal: ${(currentWeight - goalWeight).toFixed(1)}kg
- Days Until Target: ${Math.ceil(
      (new Date(targetDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    )}

As their personal trainer, provide an empathetic and motivating response that includes:
1. Acknowledge their progress and efforts with genuine encouragement
2. Give specific, actionable advice for diet and exercise based on their recent activity
3. Be understanding about any challenges they might be facing
4. Provide realistic daily targets for calories and steps
5. Only suggest increasing their goal weight if it's truly unrealistic - never lower it
6. End with motivation and belief in their ability to succeed

Speak directly to them as their trainer. Be supportive, understanding, and professional.

Write your response as a single, flowing paragraph without any formatting or HTML tags. Keep it conversational and personal.

First provide a JSON object with the data, then follow with your personal message as plain text:
{
  "summary": "Your personal message as their trainer in plain text paragraph format",
  "newGoalWeight": number (only increase if current goal is unrealistic, never decrease),
  "recommendedCalories": number,
  "recommendedSteps": number
}`;

    const command = new InvokeModelCommand({
      modelId: "amazon.nova-micro-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: [{ text: prompt }],
          },
        ],
        inferenceConfig: {
          max_new_tokens: 1000,
        },
      }),
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    // Parse AI response
    let aiResponse;
    const responseText =
      responseBody.output?.message?.content?.[0]?.text ||
      responseBody.content?.[0]?.text ||
      "Analysis complete";

    // Extract JSON object from response
    const jsonMatch = responseText.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      const jsonData = JSON.parse(jsonMatch[0]);
      // Use the markdown text after JSON as summary
      const summaryText = responseText.replace(jsonMatch[0], "").trim();
      aiResponse = {
        summary: summaryText || jsonData.summary,
        newGoalWeight: Math.max(
          jsonData.newGoalWeight || goalWeight,
          goalWeight
        ),
        recommendedCalories:
          jsonData.recommendedCalories ||
          Math.round(2000 - (currentWeight - goalWeight) * 50),
        recommendedSteps:
          jsonData.recommendedSteps ||
          Math.min(
            12000,
            8000 + Math.round((currentWeight - goalWeight) * 200)
          ),
      };
    } else {
      throw new Error("No JSON found");
    }

    return NextResponse.json(aiResponse);
  } catch (error) {
    console.error("Error in get-summary API:", error);
    return NextResponse.json(
      { error: "Failed to generate AI summary" },
      { status: 500 }
    );
  }
}
