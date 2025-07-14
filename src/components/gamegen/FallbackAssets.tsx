
import type { GameTemplateId, Assets } from '@/lib/types';

const svgToDataUri = (svg: string) => `data:image/svg+xml;base64,${btoa(svg)}`;

// --- Fallback Asset Components ---

const flappyBirdAssets = {
    mainCharacter: svgToDataUri(`<svg width="512" height="512" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bird" style="color: hsl(var(--primary));"><path d="M16 16a4 4 0 0 1-8 0 4 4 0 0 1 8 0z"/><path d="M12 12h.01"/><path d="M3 21h18"/><path d="M5 21V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v13"/></svg>`),
    npcs: svgToDataUri(`<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><style>.pipe{fill:hsl(var(--primary) / 0.6);stroke:hsl(var(--foreground));stroke-width:2;}</style><rect x="200" y="0" width="112" height="200" class="pipe" /><rect x="200" y="312" width="112" height="200" class="pipe" /></svg>`),
    environment: svgToDataUri(`<svg width="800" height="540" viewBox="0 0 800 540" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="fb-sky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color: hsl(var(--primary) / 0.3)" /><stop offset="100%" style="stop-color: hsl(var(--background))" /></linearGradient></defs><rect width="100%" height="100%" fill="url(#fb-sky)"/><g fill="none" stroke="hsl(var(--muted-foreground))" stroke-width="2" opacity="0.5"><path d="M100 100 Q 150 80 200 100 T 300 100" /><path d="M400 150 Q 450 130 500 150 T 600 150" /><path d="M250 400 Q 300 380 350 400 T 450 400" /></g></svg>`),
};

const speedRunnerAssets = {
    mainCharacter: svgToDataUri(`<svg width="512" height="512" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-person-standing" style="color: hsl(var(--primary));"><circle cx="12" cy="5" r="1"/><path d="m9 20 3-6 3 6"/><path d="m6 8 6 2 6-2"/><path d="M12 10v4"/></svg>`),
    npcs: svgToDataUri(`<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g transform="translate(100 200) scale(5)"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="hsl(var(--destructive))" /></g><g transform="translate(300 200) scale(5)"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="hsl(var(--accent))"/></g></svg>`),
    environment: svgToDataUri(`<svg width="800" height="540" viewBox="0 0 800 540" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="hsl(var(--card-foreground))" /><g stroke="hsl(var(--primary))" stroke-width="20" stroke-dasharray="50 30" opacity="0.3"><line x1="0" y1="200" x2="800" y2="100" /><line x1="0" y1="450" x2="800" y2="350" /></g></svg>`),
};

const whackAMoleAssets = {
    mainCharacter: svgToDataUri(`<svg width="512" height="512" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bot" style="color: hsl(var(--primary));"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`),
    npcs: svgToDataUri(`<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g fill="hsl(var(--card-foreground) / 0.8)"><circle cx="128" cy="128" r="80" /><circle cx="384" cy="128" r="80" /><circle cx="128" cy="384" r="80" /><circle cx="384" cy="384" r="80" /></g></svg>`),
    environment: svgToDataUri(`<svg width="800" height="540" viewBox="0 0 800 540" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="hsl(25, 50%, 30%)" /></svg>`),
};

const match3Assets = {
    mainCharacter: svgToDataUri(`<svg width="512" height="512" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="hsl(var(--primary))" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-diamond"><path d="M2.7 10.3a2.4 2.4 0 0 0 0 3.4l7.5 7.5c.8.8 2.1.8 2.9 0l7.5-7.5a2.4 2.4 0 0 0 0-3.4l-7.5-7.5c-.8-.8-2.1-.8-2.9 0z"/></svg>`),
    npcs: svgToDataUri(`<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" stroke-width="10" fill-rule="evenodd"><path fill="hsl(var(--primary))" d="m256 50 150 150-150 150-150-150z"/><path fill="hsl(var(--accent))" d="m106 200 150 150-150 150-150-150z" transform="translate(0, -100)"/><path fill="hsl(var(--destructive))" d="m406 200 150 150-150 150-150-150z" transform="translate(-150, -100)"/></g></svg>`),
    environment: svgToDataUri(`<svg width="800" height="540" viewBox="0 0 800 540" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="hsl(var(--muted))" /><g stroke="hsl(var(--border))" stroke-width="1" opacity="0.5"><path d="M100 0v540 M200 0v540 M300 0v540 M400 0v540 M500 0v540 M600 0v540 M700 0v540" /><path d="M0 90h800 M0 180h800 M0 270h800 M0 360h800 M0 450h800" /></g></svg>`),
};

const crossyRoadAssets = {
    mainCharacter: svgToDataUri(`<svg width="512" height="512" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="hsl(var(--primary))" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mountain"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>`),
    npcs: svgToDataUri(`<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g transform="scale(8) translate(10 10)" fill="hsl(var(--destructive))"><path d="M14 16.5V18a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-1.5" /><path d="M8 10h.01" /><path d="M16 10h.01" /><path d="M10 4.5 14 2v2.5" /><path d="m14.5 12-2.5 4" /><path d="M4.5 6.5 8 10" /><path d="M15 12h5V8l-5-3-5 3v4Z" /></g><g transform="scale(8) translate(10 35)" fill="#8B4513"><path d="M22 18.5c0-2.3-1.6-4.9-3-6.5-1.4-1.6-3-3-3-3s-1.6 1.4-3 3c-1.4 1.6-3 4.2-3 6.5C7 21 9.7 22 12 22s5-1 5-3.5Z" /><path d="M12 12V2" /><path d="m15 4-3-2-3 2" /></g></svg>`),
    environment: svgToDataUri(`<svg width="800" height="540" xmlns="http://www.w3.org/2000/svg"><g><rect y="0" width="800" height="135" fill="hsl(120, 40%, 60%)" /><rect y="135" width="800" height="135" fill="hsl(240, 5%, 40%)" /><rect y="270" width="800" height="135" fill="hsl(200, 80%, 50%)" /><rect y="405" width="800" height="135" fill="hsl(120, 40%, 60%)" /></g></svg>`),
};


export const getFallbackAssetsForTemplate = (templateId?: GameTemplateId): Assets => {
    let assets;
    switch (templateId) {
        case 'flappy-bird': assets = flappyBirdAssets; break;
        case 'speed-runner': assets = speedRunnerAssets; break;
        case 'whack-a-mole': assets = whackAMoleAssets; break;
        case 'match-3': assets = match3Assets; break;
        case 'crossy-road': assets = crossyRoadAssets; break;
        default: assets = flappyBirdAssets;
    }

    return {
        newAssetsDescription: "A default set of icon-based assets.",
        newMainCharacterImage: assets.mainCharacter,
        newEnvironmentImage: assets.environment,
        newNpcImages: [assets.npcs],
    };
};

    