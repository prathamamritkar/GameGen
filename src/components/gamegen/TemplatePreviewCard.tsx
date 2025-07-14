import type { GameTemplateId } from '@/lib/types';
import { Bird, Diamond, PersonStanding, Car, Waves, Bot, Star, ShieldAlert, Timer, Rocket, Mountain, ToyBrick, Ship } from 'lucide-react';

interface TemplatePreviewCardProps {
  templateId: GameTemplateId;
}

const FlappyBirdPreview = () => (
    <svg width="100%" height="100%" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" className="bg-sky-200 dark:bg-sky-900" aria-label="Flappy Bird game preview with a bird and pipes">
        <defs>
            <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'hsl(var(--primary) / 0.3)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'hsl(var(--background))', stopOpacity: 1 }} />
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <rect width="600" height="400" fill="url(#sky)" />
        <g className="text-primary" filter="url(#glow)">
            <Rocket x="150" y="180" width="48" height="48" className="rotate-[-15deg] transform-origin-center"/>
        </g>
        <g className="text-emerald-500 dark:text-emerald-400">
            <rect x="350" y="0" width="80" height="150" fill="currentColor" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <rect x="350" y="250" width="80" height="150" fill="currentColor" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <rect x="500" y="0" width="80" height="120" fill="currentColor" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <rect x="500" y="220" width="80" height="180" fill="currentColor" stroke="hsl(var(--foreground))" strokeWidth="2" />
        </g>
    </svg>
);

const SpeedRunnerPreview = () => (
    <svg width="100%" height="100%" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" className="bg-slate-800 dark:bg-gray-900" aria-label="Speed Runner game preview with a running character, obstacles, and power-ups">
        <defs>
            <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
        </defs>
        <g transform="skewY(-5)">
            <rect width="600" height="400" y="200" fill="url(#floor)" />
            <line x1="0" y1="300" x2="600" y2="300" stroke="white" strokeOpacity="0.3" strokeWidth="2" strokeDasharray="20 10"/>
            <line x1="0" y1="350" x2="600" y2="350" stroke="white" strokeOpacity="0.3" strokeWidth="2" strokeDasharray="20 10"/>
        </g>
        <PersonStanding x="80" y="260" width="48" height="48" className="text-white"/>
        <g className="text-accent">
            <Star x="300" y="200" fill="currentColor" width="24" height="24"/>
            <Star x="450" y="230" fill="currentColor" width="24" height="24"/>
        </g>
        <g className="text-destructive">
            <ShieldAlert x="250" y="290" width="36" height="36" fill="currentColor" stroke="white" strokeWidth={2}/>
            <ShieldAlert x="500" y="290" width="36" height="36" fill="currentColor" stroke="white" strokeWidth={2}/>
        </g>
    </svg>
);

const WhackAMolePreview = () => (
    <svg width="100%" height="100%" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" className="bg-emerald-800 dark:bg-green-900" aria-label="Whack-a-Mole game preview with moles in holes and a timer">
        <rect width="600" height="400" fill="hsl(var(--primary) / 0.1)" />
        <Timer x="550" y="20" width="28" height="28" className="text-accent" />
        <g className="text-yellow-900/50 dark:text-yellow-900">
            {[...Array(3)].map((_, row) =>
                [...Array(3)].map((_, col) => (
                    <circle key={`${row}-${col}`} cx={150 + col * 150} cy={120 + row * 100} r="40" fill="currentColor" />
                ))
            )}
        </g>
        <g className="text-stone-600 dark:text-stone-400">
            <Bot x="265" y="165" width="70" height="70" />
            <Bot x="115" y="265" width="70" height="70" />
        </g>
    </svg>
);

const Match3Preview = () => (
    <svg width="100%" height="100%" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" className="bg-background" aria-label="Match-3 game preview with a grid of gems">
         <defs>
            <radialGradient id="match3Bg" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{stopColor: 'hsl(var(--muted))'}} />
                <stop offset="100%" style={{stopColor: 'hsl(var(--background))'}} />
            </radialGradient>
        </defs>
        <rect width="600" height="400" fill="url(#match3Bg)" />
        <g transform="translate(190, 90)">
            {[...Array(4)].map((_, row) =>
                [...Array(4)].map((_, col) => (
                    <rect key={`${row}-${col}`} x={col * 55} y={row * 55} width="50" height="50" rx="8" className="fill-muted/50" />
                ))
            )}
            <Diamond x={0 * 55 + 13} y={0 * 55 + 13} className="text-primary" fill="currentColor"/>
            <Diamond x={1 * 55 + 13} y={0 * 55 + 13} className="text-accent" fill="currentColor"/>
            <Diamond x={2 * 55 + 13} y={0 * 55 + 13} className="text-primary" fill="currentColor"/>
            <Diamond x={3 * 55 + 13} y={0 * 55 + 13} className="text-cyan-400" fill="currentColor"/>

            <Diamond x={0 * 55 + 13} y={1 * 55 + 13} className="text-accent" fill="currentColor"/>
            <Diamond x={1 * 55 + 13} y={1 * 55 + 13} className="text-primary" fill="currentColor" filter="url(#glow)"/>
            <Diamond x={2 * 55 + 13} y={1 * 55 + 13} className="text-cyan-400" fill="currentColor"/>
            <Diamond x={3 * 55 + 13} y={1 * 55 + 13} className="text-accent" fill="currentColor"/>

            <Diamond x={0 * 55 + 13} y={2 * 55 + 13} className="text-primary" fill="currentColor" filter="url(#glow)"/>
            <Diamond x={1 * 55 + 13} y={2 * 55 + 13} className="text-accent" fill="currentColor"/>
            <Diamond x={2 * 55 + 13} y={2 * 55 + 13} className="text-primary" fill="currentColor" filter="url(#glow)"/>
            <Diamond x={3 * 55 + 13} y={2 * 55 + 13} className="text-cyan-400" fill="currentColor"/>

            <Diamond x={0 * 55 + 13} y={3 * 55 + 13} className="text-cyan-400" fill="currentColor"/>
            <Diamond x={1 * 55 + 13} y={3 * 55 + 13} className="text-cyan-400" fill="currentColor"/>
            <Diamond x={2 * 55 + 13} y={3 * 55 + 13} className="text-accent" fill="currentColor"/>
            <Diamond x={3 * 55 + 13} y={3 * 55 + 13} className="text-primary" fill="currentColor"/>
        </g>
    </svg>
);


const CrossyRoadPreview = () => (
    <svg width="100%" height="100%" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" aria-label="Crossy Road game preview with a character, roads, cars, and water">
        {/* Grass */}
        <rect width="600" height="400" className="fill-emerald-500 dark:fill-emerald-700" />
        {/* Road */}
        <rect y="100" width="600" height="100" className="fill-slate-500 dark:fill-slate-600" />
        {/* Water */}
        <rect y="200" width="600" height="100" className="fill-blue-500 dark:fill-blue-700" />
        {/* Character */}
        <Mountain x="288" y="350" width="24" height="24" className="text-green-900 dark:text-green-200" fill="currentColor" />
        {/* Traffic */}
        <g className="text-destructive-foreground dark:text-destructive-foreground">
            <Car x="50" y="115" width="48" height="48" fill="currentColor" />
            <Car x="300" y="115" width="48" height="48" fill="currentColor" />
        </g>
        {/* Logs */}
        <g className="text-yellow-800 dark:text-yellow-900">
           <Ship x="150" y="235" width="72" height="36" fill="currentColor" />
           <Ship x="400" y="235" width="72" height="36" fill="currentColor" />
        </g>
    </svg>
);


export function TemplatePreviewCard({ templateId }: TemplatePreviewCardProps) {
  switch (templateId) {
    case 'flappy-bird':
      return <FlappyBirdPreview />;
    case 'speed-runner':
      return <SpeedRunnerPreview />;
    case 'whack-a-mole':
      return <WhackAMolePreview />;
    case 'match-3':
      return <Match3Preview />;
    case 'crossy-road':
      return <CrossyRoadPreview />;
    default:
      return (
        <div className="flex h-full w-full items-center justify-center bg-muted">
          <p className="text-muted-foreground">?</p>
        </div>
      );
  }
}
