import { config } from 'dotenv';
config();

import '@/ai/flows/generate-game-music.ts';
import '@/ai/flows/reskin-game-assets.ts';
import '@/ai/flows/control-game-parameters.ts';
import '@/ai/flows/autofill-reskin-blanks.ts';
import '@/ai/flows/autofill-parameters-blanks.ts';
