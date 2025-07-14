import type { GameTemplate } from './types';

export const gameTemplates: GameTemplate[] = [
  {
    id: 'flappy-bird',
    name: 'Flappy Bird',
    description: 'Navigate a bird through an endless series of pipes. Simple, addictive, and challenging.',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'flying bird',
    defaultParams: {
      gravity: 0.6,
      lift: -10,
      pipeGap: 200,
      pipeSpeed: 5,
    },
  },
  {
    id: 'speed-runner',
    name: 'Speed Runner',
    description: 'An endless runner where you dodge obstacles and collect power-ups to achieve the highest score.',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'running person',
    defaultParams: {
      playerSpeed: 10,
      obstacleFrequency: 0.02,
      powerUpFrequency: 0.01,
    },
  },
  {
    id: 'whack-a-mole',
    name: 'Whack-the-Mole',
    description: 'Test your reflexes by whacking moles as they pop up from their holes before time runs out.',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'cartoon mole',
    defaultParams: {
      moleVisibleTime: 800,
      moleHiddenTime: 1200,
      gameDuration: 30,
    },
  },
  {
    id: 'match-3',
    name: 'Simple Match-3',
    description: 'Swap adjacent gems to create lines of three or more of the same color to score points.',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'colorful gems',
    defaultParams: {
      gridSize: 8,
      numColors: 6,
      timeLimit: 60,
    },
  },
  {
    id: 'crossy-road',
    name: 'Crossy Road',
    description: 'Guide your character across a series of busy roads and rivers without getting hit or falling in.',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'pixel chicken',
    defaultParams: {
      trafficSpeed: 2,
      logSpeed: 1.5,
      lanes: 10,
    },
  },
];
