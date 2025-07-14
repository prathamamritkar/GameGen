'use server';

/**
 * @fileOverview A flow for generating unique background music for games.
 *
 * - generateGameMusic - A function that generates game music.
 * - GenerateGameMusicInput - The input type for the generateGameMusic function.
 * - GenerateGameMusicOutput - The return type for the generateGameMusic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const GenerateGameMusicInputSchema = z.object({
  theme: z
    .string()
    .describe('The theme of the game music (e.g., adventurous, mysterious, upbeat).'),
  duration: z.number().describe('The desired duration of the music in seconds.'),
});
export type GenerateGameMusicInput = z.infer<typeof GenerateGameMusicInputSchema>;

const GenerateGameMusicOutputSchema = z.object({
  musicDataUri: z.string().describe('The generated background music as a data URI (WAV format).'),
});
export type GenerateGameMusicOutput = z.infer<typeof GenerateGameMusicOutputSchema>;

export async function generateGameMusic(input: GenerateGameMusicInput): Promise<GenerateGameMusicOutput> {
  return generateGameMusicFlow(input);
}

const musicCompositionPrompt = ai.definePrompt({
    name: 'musicCompositionPrompt',
    input: { schema: GenerateGameMusicInputSchema },
    output: { schema: z.object({ melody: z.string().describe("A melody described using onomatopoeia (e.g., 'doo-dah, dee-dah').") }) },
    prompt: `You are a music composer. Create a short, simple, and catchy melody as onomatopoeia that fits the theme '{{theme}}'. The melody should last for about {{duration}} seconds. Use repeating patterns. For example, for a 'bouncy' theme, you could write: 'boing, boing, bip, boing'. For a 'spooky' theme: 'whoo-eee, ooo-ooo, whoo-eee'.`
});

const generateGameMusicFlow = ai.defineFlow(
  {
    name: 'generateGameMusicFlow',
    inputSchema: GenerateGameMusicInputSchema,
    outputSchema: GenerateGameMusicOutputSchema,
  },
  async input => {
    // Step 1: Generate a melody prompt (onomatopoeia) from a standard text model
    const { output: compositionOutput } = await musicCompositionPrompt(input);
    if (!compositionOutput || !compositionOutput.melody) {
        throw new Error("Failed to compose a melody.");
    }

    // Step 2: Use the generated melody with the TTS model
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: compositionOutput.melody,
    });

    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    return {
      musicDataUri: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
