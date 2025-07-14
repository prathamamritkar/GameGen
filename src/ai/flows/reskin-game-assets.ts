'use server';
/**
 * @fileOverview This file defines a Genkit flow for reskinning game assets using AI prompts.
 *
 * - reskinGameAssets - A function that handles the game asset reskinning process.
 * - ReskinGameAssetsInput - The input type for the reskinGameAssets function.
 * - ReskinGameAssetsOutput - The return type for the reskinGameAssets function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReskinGameAssetsInputSchema = z.object({
  gameTemplate: z.enum(['Flappy Bird', 'Speed Runner', 'Whack-the-Mole', 'Simple Match-3', 'Crossy Road']).describe('The game template to reskin.'),
  story: z.string().describe('The story or theme of the reskinned game.'),
  theme: z.string().describe('The visual theme of the reskinned game.'),
  artStyle: z.string().describe('The art style of the reskinned game.'),
  environment: z.string().describe('The environment of the reskinned game.'),
  npcs: z.string().describe('The description of the NPCs in the reskinned game.'),
  mainCharacter: z.string().describe('The description of the main character in the reskinned game.'),
  difficultySettings: z.object({
    easy: z.string().describe('The description of the easy difficulty setting.'),
    medium: z.string().describe('The description of the medium difficulty setting.'),
    hard: z.string().describe('The description of the hard difficulty setting.'),
  }).describe('The difficulty settings for the reskinned game.'),
});

export type ReskinGameAssetsInput = z.infer<typeof ReskinGameAssetsInputSchema>;

const ReskinGameAssetsOutputSchema = z.object({
  newAssetsDescription: z.string().describe('Description of all the new visual assets for the reskinned game.'),
  newMainCharacterImage: z.string().describe('Data URI of the new main character image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'),
  newEnvironmentImage: z.string().describe('Data URI of the new environment image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'),
  newNpcImages: z.array(z.string()).describe('Array of data URIs for new NPC images, each as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'),
});

export type ReskinGameAssetsOutput = z.infer<typeof ReskinGameAssetsOutputSchema>;

export async function reskinGameAssets(input: ReskinGameAssetsInput): Promise<ReskinGameAssetsOutput> {
  return reskinGameAssetsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reskinGameAssetsPrompt',
  input: {schema: ReskinGameAssetsInputSchema},
  output: {schema: ReskinGameAssetsOutputSchema},
  prompt: `You are an expert game designer specializing in reskinning existing game templates with new visual assets.

You will use the following information to generate ideas for new visual assets, including the main character, environment, and NPCs.

Game Template: {{{gameTemplate}}}
Story: {{{story}}}
Theme: {{{theme}}}
Art Style: {{{artStyle}}}
Environment: {{{environment}}}
NPCs: {{{npcs}}}
Main Character: {{{mainCharacter}}}
Difficulty Settings: Easy: {{{difficultySettings.easy}}}, Medium: {{{difficultySettings.medium}}}, Hard: {{{difficultySettings.hard}}}

Based on the above information, please provide a detailed description of all the new visual assets for the reskinned game, including the main character, environment, and NPCs. Also, generate data URIs for the new main character image, the new environment image, and an array of data URIs for the new NPC images.

In your response, please provide the description of all new visual assets in the "newAssetsDescription" field. Also, populate the "newMainCharacterImage", "newEnvironmentImage", and "newNpcImages" fields with the generated data URIs.`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const reskinGameAssetsFlow = ai.defineFlow(
  {
    name: 'reskinGameAssetsFlow',
    inputSchema: ReskinGameAssetsInputSchema,
    outputSchema: ReskinGameAssetsOutputSchema,
  },
  async input => {

    const generationResult = await ai.generate({
      prompt: `Generate an image of the main character, whose description is ${input.mainCharacter}`,
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
      },
    });

    const generationResult2 = await ai.generate({
      prompt: `Generate an image of the environment, whose description is ${input.environment}`,
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
      },
    });

    const {output} = await prompt({
      ...input,
    });

    return {
      ...output!,
      newMainCharacterImage: generationResult.media?.url ?? 'data:image/png;base64,',
      newEnvironmentImage: generationResult2.media?.url ?? 'data:image/png;base64,',
      newNpcImages: [],
    };
  }
);
