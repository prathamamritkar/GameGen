
import type { GameTemplateId, Assets } from '@/lib/types';

const svgToDataUri = (svg: string) => `data:image/svg+xml;base64,${btoa(svg)}`;

// --- Fallback Asset Components ---
// Using hardcoded high-contrast colors to ensure they render correctly in exported HTML.

const flappyBirdAssets = {
    mainCharacter: svgToDataUri(`<svg width="512" height="512" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#3B82F6" stroke="#FFFFFF" stroke-width="1"><path d="M22,15.5C22,17.43 20.43,19 18.5,19C18.23,19 17.97,18.97 17.72,18.92C17.71,18.92 17.7,18.92 17.69,18.92C16.84,21.57 14.41,23.5 11.5,23.5C7.36,23.5 4,20.14 4,16C4,14.53 4.45,13.18 5.23,12.09C5.26,12.04 5.29,12 5.32,11.95C2.42,12.69 0.5,15.26 0.5,18.5C0.5,18.72 0.53,18.93 0.57,19.14C1.03,22 3.54,24 6.5,24C9.27,24 11.6,22.22 12.28,19.78C12.53,20.44 13,21 13.75,21.5C14.3,21.84 14.93,22.06 15.58,22.16C16.2,22.25 16.85,22.25 17.47,22.16C19.2,21.87 20.65,20.79 21.42,19.29C21.79,18.52 22,17.63 22,16.7V16.5M18.5,8C15.46,8 13,10.46 13,13.5C13,14.08 13.11,14.63 13.3,15.15C13.5,15.65 13.79,16.1 14.15,16.5C14.93,17.35 16.06,18 17.31,18H17.5C18.06,18 18.58,17.89 19.03,17.69C20.93,16.84 22,14.83 22,12.5C22,10.02 20.48,8 18.5,8Z"/></svg>`),
    npcs: svgToDataUri(`<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><style>.pipe{fill:#22C55E;stroke:#15803D;stroke-width:8;}</style><rect x="200" y="0" width="112" height="200" class="pipe" /><rect x="200" y="312" width="112" height="200" class="pipe" /></svg>`),
    environment: svgToDataUri(`<svg width="800" height="540" viewBox="0 0 800 540" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="fb-sky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color: #7DD3FC" /><stop offset="100%" style="stop-color: #E0F2FE" /></linearGradient></defs><rect width="100%" height="100%" fill="url(#fb-sky)"/><g fill="none" stroke="#FFFFFF" stroke-width="4" opacity="0.7"><path d="M100 100 Q 150 80 200 100 T 300 100" /><path d="M400 150 Q 450 130 500 150 T 600 150" /><path d="M250 400 Q 300 380 350 400 T 450 400" /></g></svg>`),
};

const speedRunnerAssets = {
    mainCharacter: svgToDataUri(`<svg width="512" height="512" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF"><path d="M14.12,10H19V8H15.88L14.63,4.5L11.38,12L10.13,8.5L6.88,15.5L10,12L11.5,15L14.12,10M14,22L12,17L10,22H14M6.5,22H9.5L11,17L8,22H5L6.5,18L3.5,22H2L5,17L2,12L3.5,15L5,12L8,17L6.5,22M18,17L15,12L16.5,15L18,12L21,17L18,22H21.5L20,18L23,22H24.5L21.5,17L24.5,12L23,15L21.5,12L18,17Z"/></svg>`),
    npcs: svgToDataUri(`<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g transform="translate(100 200) scale(5)"><path d="M1,21H23L12,2L1,21M13,18H11V16H13V18M13,14H11V10H13V14Z" fill="#F87171" /></g><g transform="translate(300 200) scale(5)"><path d="M12,17.27L18.18,21L17,14.14L22,9.27L15.18,8.62L12,2L8.82,8.62L2,9.27L7,14.14L5.82,21L12,17.27Z" fill="#FBBF24"/></g></svg>`),
    environment: svgToDataUri(`<svg width="800" height="540" viewBox="0 0 800 540" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#111827" /><g stroke="#3B82F6" stroke-width="20" stroke-dasharray="50 30" opacity="0.3"><line x1="0" y1="200" x2="800" y2="100" /><line x1="0" y1="450" x2="800" y2="350" /></g></svg>`),
};

const whackAMoleAssets = {
    mainCharacter: svgToDataUri(`<svg width="512" height="512" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#A16207"><path d="M3.7,21.3C3.9,21.5 4.2,21.6 4.5,21.6C4.6,21.6 4.8,21.6 4.9,21.5L10,20.1L12.5,15L9.5,12L2,19.5C1.8,19.7 1.7,20 1.7,20.3C1.7,20.8 2,21.3 2.5,21.5C2.7,21.6 2.9,21.6 3.1,21.6C3.3,21.6 3.5,21.5 3.7,21.3M21.5,15.6L14.9,9L13.5,10.4L15,11.9L11.9,15L10.4,13.5L9,14.9L15.6,21.5C15.8,21.7 16,21.8 16.3,21.8C16.8,21.8 17.3,21.5 17.5,21C17.7,20.8 17.8,20.5 17.8,20.2L21.3,7.5C21.5,7 21.3,6.5 20.8,6.3C20.3,6.1 19.8,6.3 19.6,6.8L16.1,19.5L15.6,19L19.1,12.4L12.4,19.1L12,18.7L18.7,12L12,5.3C11.6,4.9 11,4.9 10.6,5.3C10.2,5.7 10.2,6.3 10.6,6.7L11.9,8.1L8.1,11.9L6.7,10.6C6.3,10.2 5.7,10.2 5.3,10.6C4.9,11 4.9,11.6 5.3,12L8.5,15.2L2.8,11.4C2.3,11.1 1.7,11.2 1.4,11.7C1.1,12.2 1.2,12.8 1.7,13.1L7.4,17L2.5,22C1.8,22.7 1.8,23.7 2.5,24.4C2.8,24.7 3.2,24.9 3.6,24.9C4,24.9 4.4,24.7 4.7,24.4L9.6,19.5L13.2,23.1L11.8,24.5C11.4,24.9 11.4,25.5 11.8,25.9C12,26.1 12.2,26.2 12.5,26.2S13,26.1 13.2,25.9L22.2,16.9C22.6,16.5 22.6,15.9 22.2,15.5C21.8,15.1 21.2,15.1 20.8,15.5L19.4,16.9L16.9,14.4L20.5,10.8C20.9,10.4 21.3,10.2 21.8,10.2C22.3,10.2 22.7,10.4 23.1,10.8C23.9,11.6 23.9,12.8 23.1,13.6L16.5,20.2L19.8,23.5L24,19.3L21.5,15.6Z" /></svg>`),
    npcs: svgToDataUri(`<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g fill="#78350F"><circle cx="128" cy="128" r="80" /><circle cx="384" cy="128" r="80" /><circle cx="128" cy="384" r="80" /><circle cx="384" cy="384" r="80" /></g></svg>`),
    environment: svgToDataUri(`<svg width="800" height="540" viewBox="0 0 800 540" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#65A30D" /><g fill="#4D7C0F"><rect x="50" y="50" width="100" height="100" rx="20"/><rect x="250" y="80" width="100" height="100" rx="20"/><rect x="450" y="20" width="100" height="100" rx="20"/><rect x="650" y="90" width="100" height="100" rx="20"/><rect x="150" y="250" width="100" height="100" rx="20"/><rect x="350" y="220" width="100" height="100" rx="20"/><rect x="550" y="280" width="100" height="100" rx="20"/><rect x="50" y="400" width="100" height="100" rx="20"/><rect x="250" y="420" width="100" height="100" rx="20"/><rect x="450" y="380" width="100" height="100" rx="20"/><rect x="650" y="430" width="100" height="100" rx="20"/></g></svg>`),
};

const match3Assets = {
    mainCharacter: svgToDataUri(`<svg width="512" height="512" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#67E8F9"><path d="M12,1L9,9L1,12L9,15L12,23L15,15L23,12L15,9L12,1Z"/></svg>`),
    npcs: svgToDataUri(`<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g stroke="#FFFFFF" stroke-width="5" fill-rule="evenodd"><path fill="#3B82F6" d="m256 50 100 100-100 100-100-100z"/><path fill="#F97316" d="m106 200 100 100-100 100-100-100z" transform="translate(50, -50)"/><path fill="#EF4444" d="m406 200 100 100-100 100-100-100z" transform="translate(-50, -50)"/></g></svg>`),
    environment: svgToDataUri(`<svg width="800" height="540" viewBox="0 0 800 540" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#F3F4F6" /><g stroke="#D1D5DB" stroke-width="1" opacity="0.5"><path d="M100 0v540 M200 0v540 M300 0v540 M400 0v540 M500 0v540 M600 0v540 M700 0v540" /><path d="M0 90h800 M0 180h800 M0 270h800 M0 360h800 M0 450h800" /></g></svg>`),
};

const crossyRoadAssets = {
    mainCharacter: svgToDataUri(`<svg width="512" height="512" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#F0ABFC"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M7.5,10.5A1.5,1.5 0 0,1 9,12A1.5,1.5 0 0,1 7.5,13.5A1.5,1.5 0 0,1 6,12A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,13.5A1.5,1.5 0 0,1 15,12A1.5,1.5 0 0,1 16.5,10.5M12,15.5C14.31,15.5 16.2,16.84 17,18.5H7C7.8,16.84 9.69,15.5 12,15.5Z" /></svg>`),
    npcs: svgToDataUri(`<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g transform="scale(8) translate(10 10)" fill="#FACC15"><path d="M18.92,6.01C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6.01L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6.01M6.5,16C5.67,16 5,15.33 5,14.5C5,13.67 5.67,13 6.5,13C7.33,13 8,13.67 8,14.5C8,15.33 7.33,16 6.5,16M17.5,16C16.67,16 16,15.33 16,14.5C16,13.67 16.67,13 17.5,13C18.33,13 19,13.67 19,14.5C19,15.33 18.33,16 17.5,16Z" /></g><g transform="scale(8) translate(10 35)" fill="#A3E635"><path d="M4,7V17.5C4,19.43 5.57,21 7.5,21C9.43,21 11,19.43 11,17.5V7H13.5V17.5C13.5,20.81 10.81,23.5 7.5,23.5C4.19,23.5 1.5,20.81 1.5,17.5V7H4M20,7V17.5C20,19.43 21.57,21 23.5,21C25.43,21 27,19.43 27,17.5V7H29.5V17.5C29.5,20.81 26.81,23.5 23.5,23.5C20.19,23.5 17.5,20.81 17.5,17.5V7H20Z" /></g></svg>`),
    environment: svgToDataUri(`<svg width="800" height="540" xmlns="http://www.w3.org/2000/svg"><g><rect y="0" width="800" height="135" fill="#4ADE80" /><rect y="135" width="800" height="135" fill="#6B7280" /><rect y="270" width="800" height="135" fill="#60A5FA" /><rect y="405" width="800" height="135" fill="#4ADE80" /></g></svg>`),
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

    

    