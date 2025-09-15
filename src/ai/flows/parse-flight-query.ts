'use server';

/**
 * @fileOverview A flow to parse free-form text queries for flight searches using HuggingFace DeepSeek.
 *
 * - parseFlightQuery - A function that handles the flight query parsing process.
 * - ParseFlightQueryInput - The input type for the parseFlightQuery function.
 * - ParseFlightQueryOutput - The return type for the parseFlightQuery function.
 */

import { huggingfaceAPI } from '@/lib/huggingface-api';
import { z } from 'zod';

const ParseFlightQueryInputSchema = z.object({
  query: z.string().describe('The free-form text query for flight search.'),
});
export type ParseFlightQueryInput = z.infer<typeof ParseFlightQueryInputSchema>;

const ParseFlightQueryOutputSchema = z.object({
  destination: z.string().optional().describe('The destination of the flight.'),
  dates: z.string().optional().describe('The dates for the flight.'),
  otherDetails: z
    .string()
    .optional()
    .describe('Any other relevant details from the query.'),
});
export type ParseFlightQueryOutput = z.infer<typeof ParseFlightQueryOutputSchema>;

export async function parseFlightQuery(input: ParseFlightQueryInput): Promise<ParseFlightQueryOutput> {
  const prompt = `You are a flight search assistant. Extract the destination, dates, and any other relevant details from the following user query:

Query: ${input.query}

Please respond with a JSON object containing:
{
  "destination": "extracted destination or null",
  "dates": "extracted dates or null", 
  "otherDetails": "any other relevant details or null"
}`;

  try {
    const response = await huggingfaceAPI.generateResponse(prompt);
    
    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(response);
      return {
        destination: parsed.destination || undefined,
        dates: parsed.dates || undefined,
        otherDetails: parsed.otherDetails || undefined
      };
    } catch (parseError) {
      // If JSON parsing fails, try to extract manually from text response
      const destination = response.match(/destination[:\s]+(.*?)(?:\n|$)/i)?.[1]?.trim();
      const dates = response.match(/dates?[:\s]+(.*?)(?:\n|$)/i)?.[1]?.trim();
      const otherDetails = response.match(/other\s+details[:\s]+(.*?)(?:\n|$)/i)?.[1]?.trim();
      
      return {
        destination: destination || undefined,
        dates: dates || undefined,
        otherDetails: otherDetails || undefined
      };
    }
  } catch (error) {
    console.error('Flight query parsing error:', error);
    return {
      destination: undefined,
      dates: undefined,
      otherDetails: `Error parsing query: ${input.query}`
    };
  }
}
