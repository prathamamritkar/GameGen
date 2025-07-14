import type { Assets, GameTemplateId, ReskinInput } from "./types";

type FallbackData = {
    reskinForm: Omit<ReskinInput, 'difficulty'> & { musicTheme: string };
    parameterRequest: string;
    assets: Assets;
}

const fallbackStore: Record<GameTemplateId, FallbackData> = {
    'flappy-bird': {
        reskinForm: {
            story: "A determined goldfish in a bowl-shaped submarine navigates treacherous underwater caverns.",
            theme: "Subaquatic Goldfish",
            artStyle: "Clean Vector Art",
            environment: "Deep sea caves with glowing coral and dangerous rock formations.",
            npcs: "Angry pufferfish and sharp, rising stalagmites.",
            mainCharacter: "A goldfish wearing a tiny diver's helmet, inside a glass submarine.",
            musicTheme: "Bubbly and suspenseful underwater ambiance.",
        },
        parameterRequest: "Make the submarine sink faster but give it a stronger boost to compensate.",
        assets: {
            newAssetsDescription: "A default set of assets for a Subaquatic Goldfish game.",
            newMainCharacterImage: "https://placehold.co/512x512.png",
            newEnvironmentImage: "https://placehold.co/800x450.png",
            newNpcImages: ["https://placehold.co/512x512.png"],
            dataAiHint: { mainCharacter: 'goldfish submarine', npc: 'pufferfish', environment: 'underwater cave' }
        },
    },
    'speed-runner': {
        reskinForm: {
            story: "A cybernetically enhanced corgi dashes through a futuristic city to deliver a critical data package.",
            theme: "Cyber-Corgi Courier",
            artStyle: "Neon-noir, 80s synthwave",
            environment: "A sprawling cyberpunk city at night with holographic advertisements and flying cars.",
            npcs: "Hovering security drones and electrified fences.",
            mainCharacter: "A low-poly corgi with glowing blue cybernetic legs.",
            musicTheme: "High-energy retro synthwave track.",
        },
        parameterRequest: "Increase the running speed significantly and make obstacles appear more frequently for a real challenge.",
        assets: {
            newAssetsDescription: "A default set of assets for a Cyber-Corgi Courier game.",
            newMainCharacterImage: "https://placehold.co/512x512.png",
            newEnvironmentImage: "https://placehold.co/800x450.png",
            newNpcImages: ["https://placehold.co/512x512.png"],
            dataAiHint: { mainCharacter: 'cyber corgi', npc: 'security drone', environment: 'cyberpunk city' }
        },
    },
    'whack-a-mole': {
        reskinForm: {
            story: "In a haunted mansion, mischievous ghosts pop out of portraits, and you must zap them before they cause too much trouble.",
            theme: "Ghost Zapper 3000",
            artStyle: "Spooky Cartoon",
            environment: "A dusty, ornate hallway in a haunted mansion, lined with portraits.",
            npcs: "Grinning purple ghosts that fade in and out of paintings.",
            mainCharacter: "The player's hand holding a proton-zapping ray gun.",
            musicTheme: "Eerie but playful Halloween-style music.",
        },
        parameterRequest: "Let the ghosts appear for a shorter amount of time but give me more time overall to get a high score.",
        assets: {
            newAssetsDescription: "A default set of assets for a Ghost Zapper 3000 game.",
            newMainCharacterImage: "https://placehold.co/512x512.png", // Player's zapper
            newEnvironmentImage: "https://placehold.co/800x450.png",
            newNpcImages: ["https://placehold.co/512x512.png"], // Ghosts
            dataAiHint: { mainCharacter: 'ray gun', npc: 'cartoon ghost', environment: 'haunted mansion' }
        },
    },
    'match-3': {
        reskinForm: {
            story: "A wizard's apprentice must organize a chaotic potion shelf by matching ingredients to create powerful elixirs.",
            theme: "Alchemist's Apprentice",
            artStyle: "Fantasy Storybook",
            environment: "A wizard's workshop with shelves full of glowing bottles and ancient books.",
            npcs: "Bubbling cauldrons and magical spell effects.",
            mainCharacter: "The player's hand, represented by a magic wand cursor.",
            musicTheme: "Mystical and magical fantasy theme.",
        },
        parameterRequest: "Add another ingredient color to make it harder, but give me a bit more time to think.",
        assets: {
            newAssetsDescription: "A default set of assets for an Alchemist's Apprentice game.",
            newMainCharacterImage: "https://placehold.co/512x512.png", // Potion bottle icon
            newEnvironmentImage: "https://placehold.co/800x450.png",
            newNpcImages: ["https://placehold.co/512x512.png"], // Another potion icon
            dataAiHint: { mainCharacter: 'potion bottle', npc: 'magic book', environment: 'wizard workshop' }
        },
    },
    'crossy-road': {
        reskinForm: {
            story: "A brave little frog must cross a busy medieval kingdom's roads and rushing rivers to reach a legendary golden lilypad.",
            theme: "Froggy Kingdom Crossing",
            artStyle: "Charming 16-bit Pixel Art",
            environment: "A pixelated medieval world with dirt roads, wooden carts, and a wide river with logs.",
            npcs: "Speeding horse-drawn carts and fast-moving logs.",
            mainCharacter: "A small, green pixel-art frog.",
            musicTheme: "Upbeat medieval chiptune music.",
        },
        parameterRequest: "Make the carts move much faster and have more lanes to cross.",
        assets: {
            newAssetsDescription: "A default set of assets for a Froggy Kingdom Crossing game.",
            newMainCharacterImage: "https://placehold.co/512x512.png",
            newEnvironmentImage: "https://placehold.co/800x450.png",
            newNpcImages: ["https://placehold.co/512x512.png"], // a cart
            dataAiHint: { mainCharacter: 'pixel frog', npc: 'wooden cart', environment: 'pixel castle' }
        },
    }
}

const defaultFallback = fallbackStore['flappy-bird'];

export function getFallbackDataForTemplate(templateId?: GameTemplateId): FallbackData {
    if (!templateId || !fallbackStore[templateId]) {
        return defaultFallback;
    }
    return fallbackStore[templateId];
}
