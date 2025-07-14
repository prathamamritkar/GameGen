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
  prompt: `You are a creative assistant for a game generation app. The user is adjusting gameplay parameters for a "{{gameTemplate}}" game and wants a creative suggestion for how to change it.

The user's current request is: "{{currentRequest}}".

Your ONLY task is to generate a single, creative, natural language request to adjust the game's mechanics ONLY if the current request is empty.
If the request field already has text, you MUST return an empty string for the 'filledRequest' field.

Focus on gameplay aspects like speed, difficulty, gravity, frequency of items, etc.

Here are some examples of good, creative requests:
- "Make the player character twice as fast, but also add way more obstacles to dodge."
- "I'd like a really easy, slow-paced version suitable for a total beginner."
- "Let's increase the difficulty by making enemies appear more often and reducing the overall time limit."
- "Can you lower the gravity and make the jump height much higher?"

Based on the "{{gameTemplate}}" game, provide one creative request for the 'filledRequest' field.
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
