import type { GameTemplateId } from '@/lib/types';
import { Bird, Diamond, PersonStanding, Car, Waves, Bot, Star, ShieldAlert, Timer, Rocket, Mountain, ToyBrick, Ship } from 'lucide-react';

interface TemplatePreviewCardProps {
  templateId: GameTemplateId;
}

const FlappyBirdPreview = () => (
    <svg width="100%" height="100%" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" className="bg-[#D1E9FA]" aria-label="A rocket flying between green pipes on a light blue background.">
        <defs>
            <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#A5D8F6' }} />
                <stop offset="100%" style={{ stopColor: '#D1E9FA' }} />
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
        <g className="text-[#D95B00]" filter="url(#glow)">
            <Rocket x="150" y="180" width="48" height="48" className="rotate-[-15deg] transform-origin-center"/>
        </g>
        <g>
            <rect x="350" y="0" width="80" height="150" fill="#14864A" stroke="#0B4D2A" strokeWidth="2" />
            <rect x="350" y="250" width="80" height="150" fill="#14864A" stroke="#0B4D2A" strokeWidth="2" />
            <rect x="500" y="0" width="80" height="120" fill="#14864A" stroke="#0B4D2A" strokeWidth="2" />
            <rect x="500" y="220" width="80" height="180" fill="#14864A" stroke="#0B4D2A" strokeWidth="2" />
        </g>
    </svg>
);

const SpeedRunnerPreview = () => (
    <svg width="100%" height="100%" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" className="bg-[#1D232A]" aria-label="A person running on a futuristic grid, dodging red obstacles and collecting yellow stars.">
        <defs>
            <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0074D9" />
                <stop offset="100%" stopColor="#2ECC71" />
            </linearGradient>
        </defs>
        <rect width="600" height="400" fill="#1D232A" />
        <g transform="skewY(-5)">
            <rect width="600" height="400" y="200" fill="url(#floor)" opacity="0.6"/>
            <line x1="0" y1="300" x2="600" y2="300" stroke="white" strokeOpacity="0.3" strokeWidth="2" strokeDasharray="20 10"/>
            <line x1="0" y1="350" x2="600" y2="350" stroke="white" strokeOpacity="0.3" strokeWidth="2" strokeDasharray="20 10"/>
        </g>
        <PersonStanding x="80" y="260" width="48" height="48" className="text-white"/>
        <g className="text-[#F1C40F]">
            <Star x="300" y="200" fill="currentColor" width="24" height="24"/>
            <Star x="450" y="230" fill="currentColor" width="24" height="24"/>
        </g>
        <g className="text-[#E74C3C]">
            <ShieldAlert x="250" y="290" width="36" height="36" fill="currentColor" stroke="white" strokeWidth={2}/>
            <ShieldAlert x="500" y="290" width="36" height="36" fill="currentColor" stroke="white" strokeWidth={2}/>
        </g>
    </svg>
);

const WhackAMolePreview = () => (
    <svg width="100%" height="100%" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" className="bg-[#6A8A42]" aria-label="A whack-a-mole game with brown moles popping out of holes in a green field.">
        <rect width="600" height="400" fill="#6A8A42" />
        <Timer x="550" y="20" width="28" height="28" className="text-white" />
        <g className="text-[#4B341C]">
            {[...Array(3)].map((_, row) =>
                [...Array(3)].map((_, col) => (
                    <circle key={`${row}-${col}`} cx={150 + col * 150} cy={120 + row * 100} r="40" fill="currentColor" />
                ))
            )}
        </g>
        <g className="text-[#8B572A]">
            <Bot x="265" y="165" width="70" height="70" />
            <Bot x="115" y="265" width="70" height="70" />
        </g>
    </svg>
);

const Match3Preview = () => (
    <svg width="100%" height="100%" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" className="bg-[#EAEAEA]" aria-label="A match-3 game grid with various colorful gems.">
         <defs>
            <radialGradient id="match3Bg" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{stopColor: '#FFFFFF'}} />
                <stop offset="100%" style={{stopColor: '#EAEAEA'}} />
            </radialGradient>
        </defs>
        <rect width="600" height="400" fill="url(#match3Bg)" />
        <g transform="translate(190, 90)">
            {[...Array(4)].map((_, row) =>
                [...Array(4)].map((_, col) => (
                    <rect key={`${row}-${col}`} x={col * 55} y={row * 55} width="50" height="50" rx="8" className="fill-black/10" />
                ))
            )}
            <Diamond x={0 * 55 + 13} y={0 * 55 + 13} className="text-[#3498DB]" fill="currentColor"/>
            <Diamond x={1 * 55 + 13} y={0 * 55 + 13} className="text-[#2ECC71]" fill="currentColor"/>
            <Diamond x={2 * 55 + 13} y={0 * 55 + 13} className="text-[#3498DB]" fill="currentColor"/>
            <Diamond x={3 * 55 + 13} y={0 * 55 + 13} className="text-[#9B59B6]" fill="currentColor"/>

            <Diamond x={0 * 55 + 13} y={1 * 55 + 13} className="text-[#2ECC71]" fill="currentColor"/>
            <Diamond x={1 * 55 + 13} y={1 * 55 + 13} className="text-[#3498DB]" fill="currentColor" />
            <Diamond x={2 * 55 + 13} y={1 * 55 + 13} className="text-[#9B59B6]" fill="currentColor"/>
            <Diamond x={3 * 55 + 13} y={1 * 55 + 13} className="text-[#2ECC71]" fill="currentColor"/>

            <Diamond x={0 * 55 + 13} y={2 * 55 + 13} className="text-[#3498DB]" fill="currentColor"/>
            <Diamond x={1 * 55 + 13} y={2 * 55 + 13} className="text-[#2ECC71]" fill="currentColor"/>
            <Diamond x={2 * 55 + 13} y={2 * 55 + 13} className="text-[#3498DB]" fill="currentColor"/>
            <Diamond x={3 * 55 + 13} y={2 * 55 + 13} className="text-[#9B59B6]" fill="currentColor"/>

            <Diamond x={0 * 55 + 13} y={3 * 55 + 13} className="text-[#9B59B6]" fill="currentColor"/>
            <Diamond x={1 * 55 + 13} y={3 * 55 + 13} className="text-[#9B59B6]" fill="currentColor"/>
            <Diamond x={2 * 55 + 13} y={3 * 55 + 13} className="text-[#2ECC71]" fill="currentColor"/>
            <Diamond x={3 * 55 + 13} y={3 * 55 + 13} className="text-[#3498DB]" fill="currentColor"/>
        </g>
    </svg>
);


const CrossyRoadPreview = () => (
    <svg width="100%" height="100%" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" aria-label="A crossy road game with a character crossing a gray road with cars and a blue river with logs.">
        {/* Grass */}
        <rect width="600" height="400" className="fill-[#5B8E3C]" />
        {/* Road */}
        <rect y="100" width="600" height="100" className="fill-[#6C7A89]" />
        {/* Water */}
        <rect y="200" width="600" height="100" className="fill-[#3498DB]" />
        {/* Character */}
        <Mountain x="288" y="350" width="24" height="24" className="text-[#2E401E]" fill="currentColor" />
        {/* Traffic */}
        <g className="text-[#E74C3C]">
            <Car x="50" y="115" width="48" height="48" fill="currentColor" />
            <Car x="300" y="115" width="48" height="48" fill="currentColor" />
        </g>
        {/* Logs */}
        <g className="text-[#795548]">
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
