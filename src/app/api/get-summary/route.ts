import { NextRequest, NextResponse } from 'next/server';
import { DailyEntry, WeeklySummary } from '../../types';

export async function POST(request: NextRequest) {
  try {
    const { entries, weekStart } = await request.json();
    
    // Calculate weekly averages
    const weekEntries: DailyEntry[] = Object.values(entries);
    const avgMood = weekEntries.reduce((sum, entry) => sum + entry.mood, 0) / weekEntries.length;
    const avgEnergy = weekEntries.reduce((sum, entry) => sum + entry.energy, 0) / weekEntries.length;
    const avgCalories = weekEntries.reduce((sum, entry) => sum + entry.calories, 0) / weekEntries.length;
    const avgSteps = weekEntries.reduce((sum, entry) => sum + entry.steps, 0) / weekEntries.length;
    const avgWeight = weekEntries.reduce((sum, entry) => sum + entry.weight, 0) / weekEntries.length;

    // For now, we'll create a mock summary since AWS Bedrock integration would require additional setup
    // In a real implementation, you would call AWS Bedrock here
    const summary = generateMockSummary(avgMood, avgEnergy, avgCalories, avgSteps, avgWeight);
    
    const response: WeeklySummary = {
      week: weekStart,
      summary: summary.text,
      recommendedSteps: summary.recommendedSteps,
      recommendedCalories: summary.recommendedCalories
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}

function generateMockSummary(
  avgMood: number, 
  avgEnergy: number, 
  avgCalories: number, 
  avgSteps: number, 
  avgWeight: number
) {
  let text = `This week, your average mood was ${avgMood.toFixed(1)}/5 and energy level was ${avgEnergy.toFixed(1)}/5. `;
  
  if (avgMood < 3) {
    text += "Your mood seems to be on the lower side. Consider incorporating more activities that bring you joy. ";
  } else if (avgMood > 4) {
    text += "Great job maintaining a positive mood this week! ";
  }

  if (avgEnergy < 3) {
    text += "Your energy levels could use improvement. Make sure you're getting enough sleep and consider adjusting your nutrition. ";
  } else if (avgEnergy > 4) {
    text += "Excellent energy levels this week! ";
  }

  text += `You averaged ${Math.round(avgSteps)} steps and ${Math.round(avgCalories)} calories per day. `;

  // Calculate recommendations based on performance
  let recommendedSteps = Math.round(avgSteps);
  let recommendedCalories = Math.round(avgCalories);

  if (avgEnergy > 3.5 && avgMood > 3.5) {
    recommendedSteps = Math.round(avgSteps * 1.1); // Increase by 10%
    text += "Since you're feeling great, try increasing your daily steps by 10% next week. ";
  } else if (avgEnergy < 2.5) {
    recommendedSteps = Math.round(avgSteps * 0.9); // Decrease by 10%
    text += "Focus on gentle movement and recovery this week. ";
  }

  if (avgMood < 3) {
    text += "Consider adding more nutrient-dense foods to support your mood. ";
    recommendedCalories = Math.round(avgCalories * 1.05);
  }

  return {
    text,
    recommendedSteps,
    recommendedCalories
  };
}