'use server';

/**
 * @fileOverview Generates personalized travel itineraries based on user preferences using HuggingFace DeepSeek.
 *
 * - generateTravelItinerary - A function that generates travel itineraries.
 * - GenerateTravelItineraryInput - The input type for the generateTravelItinerary function.
 * - GenerateTravelItineraryOutput - The return type for the generateTravelItinerary function.
 */

import { huggingfaceAPI } from '@/lib/huggingface-api';
import { z } from 'zod';

const GenerateTravelItineraryInputSchema = z.object({
  budget: z
    .string()
    .describe('The budget for the trip (e.g., $500-$1000, or "luxury").'),
  travelStyle: z
    .string()
    .describe(
      'The preferred travel style (e.g., adventure, relaxation, cultural exploration).' + 
      'Examples: adventure, relaxation, cultural exploration, budget, luxury'
    ),
  interests: z
    .string()
    .describe(
      'Specific interests (e.g., food, history, hiking, beaches).  ' +
      'Examples: food, history, hiking, beaches, nightlife'
    ),
  duration: z.string().describe('The duration of the trip in days.'),
  locationPreferences: z
    .string()
    .describe(
      'Preferred locations or regions (e.g., Europe, Southeast Asia, Caribbean).' +
      'Examples: Europe, Southeast Asia, Caribbean, Italy, France'
    ),
});

export type GenerateTravelItineraryInput = z.infer<
  typeof GenerateTravelItineraryInputSchema
>;

const GenerateTravelItineraryOutputSchema = z.object({
  itinerary: z
    .string()
    .describe(
      'A detailed travel itinerary with destination ideas and activity suggestions.'
    ),
});

export type GenerateTravelItineraryOutput = z.infer<
  typeof GenerateTravelItineraryOutputSchema
>;

export async function generateTravelItinerary(
  input: GenerateTravelItineraryInput
): Promise<GenerateTravelItineraryOutput> {
  const prompt = `You are a travel expert who creates personalized travel itineraries.

Based on the user's preferences, generate a detailed travel itinerary with destination ideas and activity suggestions.
Consider the budget, travel style, interests, duration, and location preferences provided by the user.
Provide specific suggestions for destinations, accommodations, activities, and dining.

Preferences:
Budget: ${input.budget}
Travel Style: ${input.travelStyle}
Interests: ${input.interests}
Duration: ${input.duration} days
Location Preferences: ${input.locationPreferences}

Please provide a comprehensive travel itinerary:`;

  try {
    const response = await huggingfaceAPI.generateResponse(prompt);
    return { itinerary: response };
  } catch (error) {
    console.error('Travel itinerary generation error:', error);
    return {
      itinerary: `I apologize, but I'm having trouble generating a travel itinerary right now. Here are some general suggestions for your ${input.locationPreferences} trip:

• Research popular destinations in ${input.locationPreferences}
• Consider your ${input.budget} budget when selecting accommodations
• Look for activities that match your interest in ${input.interests}
• Plan for ${input.duration} days with a mix of ${input.travelStyle} experiences

Please try again in a moment for a more detailed itinerary.`
    };
  }
}
