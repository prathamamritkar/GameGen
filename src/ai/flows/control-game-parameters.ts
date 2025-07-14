
'use server';

/**
 * @fileOverview Allows users to control game parameters using natural language or AI-suggested settings.
 *
 * - controlGameParameters - A function that handles the game parameter control process.
 * - ControlGameParametersInput - The input type for the controlGameParameters function.
 * - ControlGameParametersOutput - The return type for the controlGameParameters function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Specific schemas for each game's parameters
const FlappyBirdParamsSchema = z.object({
  gravity: z.number().describe('The downward acceleration of the character.'),
  lift: z.number().describe('The upward velocity applied when the character jumps (should be a negative value).'),
  pipeGap: z.number().describe('The vertical distance between the upper and lower pipes.'),
  pipeSpeed: z.number().describe('How fast the pipes move from right to left.'),
});

const SpeedRunnerParamsSchema = z.object({
  playerSpeed: z.number().describe('The horizontal speed of the player and the game world.'),
  obstacleFrequency: z.number().describe('The probability of an obstacle appearing (a value between 0 and 1).'),
  powerUpFrequency: z.number().describe('The probability of a power-up appearing (a value between 0 and 1).'),
});

const WhackAMoleParamsSchema = z.object({
  moleVisibleTime: z.number().describe('The time in milliseconds a mole is visible before hiding.'),
  gameDuration: z.number().describe('The total duration of the game in seconds.'),
});

const Match3ParamsSchema = z.object({
  gridSize: z.number().int().describe('The number of rows and columns in the grid (e.g., 8 for an 8x8 grid).'),
  numColors: z.number().int().describe('The number of different gem colors available.'),
  timeLimit: z.number().int().describe('The time limit for the game in seconds.'),
});

const CrossyRoadParamsSchema = z.object({
  trafficSpeed: z.number().describe('The speed of cars in the traffic lanes.'),
  logSpeed: z.number().describe('The speed of logs in the river lanes.'),
  lanes: z.number().int().describe('The total number of lanes (road and river) the player must cross.'),
});

const GameParamsSchema = z.union([
    FlappyBirdParamsSchema,
    SpeedRunnerParamsSchema,
    WhackAMoleParamsSchema,
    Match3ParamsSchema,
    CrossyRoadParamsSchema
]);

const ControlGameParametersInputSchema = z.object({
  gameType: z.enum(['Flappy Bird', 'Speed Runner', 'Whack-the-Mole', 'Simple Match-3', 'Crossy Road']).describe('The type of game to adjust parameters for.'),
  parameterAdjustmentRequest: z.string().describe('A natural language request to adjust game parameters (e.g., increase speed, lower gravity).'),
  currentParameters: GameParamsSchema.optional().describe('The current game parameters as a JSON object.'),
});
export type ControlGameParametersInput = z.infer<typeof ControlGameParametersInputSchema>;

const ControlGameParametersOutputSchema = z.object({
  adjustedParameters: GameParamsSchema.describe('The adjusted game parameters as a JSON object.'),
  explanation: z.string().describe('An explanation of the parameter adjustments made.'),
});
export type ControlGameParametersOutput = z.infer<typeof ControlGameParametersOutputSchema>;

export async function controlGameParameters(input: ControlGameParametersInput): Promise<ControlGameParametersOutput> {
  return controlGameParametersFlow(input);
}

const getPromptForGameType = (gameType: ControlGameParametersInput['gameType']) => {
    let outputSchema: z.ZodType;
    switch(gameType) {
        case 'Flappy Bird': outputSchema = FlappyBirdParamsSchema; break;
        case 'Speed Runner': outputSchema = SpeedRunnerParamsSchema; break;
        case 'Whack-the-Mole': outputSchema = WhackAMoleParamsSchema; break;
        case 'Simple Match-3': outputSchema = Match3ParamsSchema; break;
        case 'Crossy Road': outputSchema = CrossyRoadParamsSchema; break;
        default: throw new Error(`Unsupported game type: ${gameType}`);
    }

    const FinalOutputSchema = z.object({
        adjustedParameters: outputSchema,
        explanation: z.string().describe('An explanation of the parameter adjustments made.'),
    });

    return ai.definePrompt({
        name: `adjustParametersPrompt_${gameType.replace(/[^a-zA-Z0-9]/g, '')}`,
        input: {
            schema: z.object({
                gameType: z.string(),
                parameterAdjustmentRequest: z.string(),
                currentParameters: z.string(),
            })
        },
        output: { schema: FinalOutputSchema },
        prompt: `You are a game design assistant. The user wants to adjust the game parameters for a game of type "{{gameType}}".

They have requested the following parameter adjustment: "{{parameterAdjustmentRequest}}".

Here are the current parameters, represented as a JSON object: {{{currentParameters}}}

Based on their request, and the current parameters, generate a new set of game parameters that reflects their desired changes.

Return the adjusted parameters as a JSON object, as well as a short explanation of the changes you made.

Ensure the returned JSON object is valid and can be directly used by the game engine, adhering to the specified schema for the game type.
`,
    });
}

const controlGameParametersFlow = ai.defineFlow(
  {
    name: 'controlGameParametersFlow',
    inputSchema: ControlGameParametersInputSchema,
    outputSchema: ControlGameParametersOutputSchema,
  },
  async input => {
    const adjustParametersPrompt = getPromptForGameType(input.gameType);
    const {output} = await adjustParametersPrompt({
      ...input,
      currentParameters: JSON.stringify(input.currentParameters, null, 2),
    });
    if (!output) {
        throw new Error("AI failed to generate new parameters.");
    }
    return output;
  }
);
