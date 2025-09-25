'use server';

/**
 * @fileOverview A flow that suggests relevant Arabic words or phrases as the user types.
 *
 * - getArabicWordSuggestions - A function that takes the current text and returns suggested words or phrases.
 * - ArabicWordSuggestionsInput - The input type for the getArabicWordSuggestions function.
 * - ArabicWordSuggestionsOutput - The return type for the getArabicWordSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ArabicWordSuggestionsInputSchema = z.object({
  text: z.string().describe('The current text being typed by the user.'),
});
export type ArabicWordSuggestionsInput = z.infer<typeof ArabicWordSuggestionsInputSchema>;

const ArabicWordSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of suggested Arabic words or phrases.'),
});
export type ArabicWordSuggestionsOutput = z.infer<typeof ArabicWordSuggestionsOutputSchema>;

export async function getArabicWordSuggestions(
  input: ArabicWordSuggestionsInput
): Promise<ArabicWordSuggestionsOutput> {
  return arabicWordSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'arabicWordSuggestionsPrompt',
  input: {schema: ArabicWordSuggestionsInputSchema},
  output: {schema: ArabicWordSuggestionsOutputSchema},
  prompt: `Suggest relevant Arabic words or phrases based on the following text:\n\n{{text}}\n\nSuggestions:`,
});

const arabicWordSuggestionsFlow = ai.defineFlow(
  {
    name: 'arabicWordSuggestionsFlow',
    inputSchema: ArabicWordSuggestionsInputSchema,
    outputSchema: ArabicWordSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
