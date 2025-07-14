'use server';

/**
 * @fileOverview A Genkit flow for autofilling the game parameter adjustment request.
 *
 * - autofillParametersBlanks - A function that suggests content for the parameter adjustment request.
 * - AutofillParametersBlanksInput - The input type for the function.
 * - AutofillParametersBlanksOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { AutofillParametersBlanksInput, AutofillParametersBlanksOutput } from '@/lib/types';

const AutofillInputSchema = z.object({
  gameTemplate: z.string(),
  currentRequest: z.string().optional(),
});

const AutofillOutputSchema = z.object({
  filledRequest: z.string().describe("A creative, natural language request to adjust game parameters (e.g., 'make the game faster and more challenging'). Only generate if the input was empty."),
});

export async function autofillParametersBlanks(input: AutofillParametersBlanksInput): Promise<AutofillParametersBlanksOutput> {
  return autofillParametersBlanksFlow(input);
}

const autofillPrompt = ai.definePrompt({
  name: 'autofillParametersPrompt',
  input: { schema: AutofillInputSchema },
  output: { schema: AutofillOutputSchema },
  prompt: `You are a creative assistant for a game generation app.
The user is adjusting parameters for a "{{gameTemplate}}" game and wants help creating a request.
The current request is: "{{currentRequest}}".

Your task is to generate a creative and descriptive request ONLY if the current request is empty.
If it already has text, return an empty string for the 'filledRequest' field.

Example creative requests:
- "Make the player twice as fast but add way more obstacles."
- "I want a really easy, slow-paced version for a beginner."
- "Increase the difficulty by making enemies appear more often and reducing the time limit."

Based on the game template, provide one creative request.
`,
});

const autofillParametersBlanksFlow = ai.defineFlow(
  {
    name: 'autofillParametersBlanksFlow',
    inputSchema: AutofillInputSchema,
    outputSchema: AutofillOutputSchema,
  },
  async (input) => {
    if (input.currentRequest) {
      return { filledRequest: '' };
    }
    const { output } = await autofillPrompt(input);
    if (!output) {
        throw new Error("The AI failed to generate a suggestion.");
    }
    return output;
  }
);
