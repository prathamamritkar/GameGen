'use server';

/**
 * @fileOverview A Genkit flow for autofilling blank fields in the game reskinning form.
 *
 * - autofillReskinBlanks - A function that suggests content for empty form fields.
 * - AutofillReskinBlanksInput - The input type for the autofillReskinBlanks function.
 * - AutofillReskinBlanksOutput - The return type for the autofillReskinBlanks function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { AutofillReskinBlanksInput, AutofillReskinBlanksOutput } from '@/lib/types';

const AutofillInputSchema = z.object({
  gameTemplate: z.string(),
  currentValues: z.object({
    story: z.string().optional(),
    theme: z.string().optional(),
    artStyle: z.string().optional(),
    environment: z.string().optional(),
    npcs: z.string().optional(),
    mainCharacter: z.string().optional(),
    musicTheme: z.string().optional(),
  }),
});

const AutofillOutputSchema = z.object({
  filledValues: z.object({
    story: z.string().describe("A creative, short story for the game. Only generate if the input was empty."),
    theme: z.string().describe("A one or two-word theme for the game (e.g., 'Jungle Adventure'). Only generate if the input was empty."),
    artStyle: z.string().describe("A simple art style (e.g., '8-bit Pixel Art', 'Claymation'). Only generate if the input was empty."),
    environment: z.string().describe("A brief description of the game's environment or background. Only generate if the input was empty."),
    npcs: z.string().describe("A brief description of the enemies, obstacles, or non-player characters. Only generate if the input was empty."),
    mainCharacter: z.string().describe("A brief description of the main character. Only generate if the input was empty."),
    musicTheme: z.string().describe("A theme for the background music (e.g., 'Upbeat Chiptune', 'Mysterious Forest'). Only generate if the input was empty."),
  }),
});

export async function autofillReskinBlanks(input: AutofillReskinBlanksInput): Promise<AutofillReskinBlanksOutput> {
  return autofillReskinBlanksFlow(input);
}

const getFieldsToFill = (currentValues: AutofillReskinBlanksInput['currentValues']): string => {
    const blankFields = Object.entries(currentValues)
        .filter(([, value]) => !value)
        .map(([key]) => key);

    if (blankFields.length === 0) {
        return "All fields are already filled. Do not generate any new content.";
    }
    return `Please generate content for the following fields: ${blankFields.join(', ')}.`;
}

const autofillPrompt = ai.definePrompt({
  name: 'autofillPrompt',
  input: { schema: AutofillInputSchema },
  output: { schema: AutofillOutputSchema },
  prompt: `You are a creative assistant for a game generation app.
The user is making a game based on the "{{gameTemplate}}" template and wants help filling in some creative details.

User's current ideas (some fields may be blank):
- Story: "{{currentValues.story}}"
- Theme: "{{currentValues.theme}}"
- Art Style: "{{currentValues.artStyle}}"
- Environment: "{{currentValues.environment}}"
- NPCs/Obstacles: "{{currentValues.npcs}}"
- Main Character: "{{currentValues.mainCharacter}}"
- Music Theme: "{{currentValues.musicTheme}}"

Your task is to generate creative and consistent suggestions ONLY for the fields that are currently empty. Do not change or overwrite any existing text.
If a field has text, return an empty string for it in your response.

Based on the game template and any existing values, provide creative suggestions.

{{{fieldsToFill}}}

Ensure the generated values are concise and fit the descriptions in the output schema.
`,
});


const autofillReskinBlanksFlow = ai.defineFlow(
  {
    name: 'autofillReskinBlanksFlow',
    inputSchema: AutofillInputSchema,
    outputSchema: AutofillOutputSchema,
  },
  async (input) => {
    const fieldsToFill = getFieldsToFill(input.currentValues);
    const { output } = await autofillPrompt({ ...input, fieldsToFill });
    if (!output) {
        throw new Error("The AI failed to generate suggestions.");
    }
    return output;
  }
);
