export type GameTemplateId = 'flappy-bird' | 'speed-runner' | 'whack-a-mole' | 'match-3' | 'crossy-road';

export type GameTemplate = {
  id: GameTemplateId;
  name: string;
  description: string;
  image: string;
  dataAiHint: string;
  defaultParams: Record<string, any>;
};

export type Difficulty = {
  easy: string;
  medium: string;
  hard: string;
};

export type ReskinInput = {
  story: string;
  theme: string;
  artStyle: string;
  environment: string;
  npcs: string;
  mainCharacter: string;
};

export type Assets = {
  newAssetsDescription: string;
  newMainCharacterImage: string;
  newEnvironmentImage: string;
  newNpcImages: string[];
  dataAiHint?: {
    mainCharacter: string;
    npc: string;
    environment: string;
  }
};

export type Music = {
  theme: string;
  duration: number;
  dataUri: string;
};

export type Parameters = {
  request: string;
  adjusted: Record<string, any>;
  explanation: string;
};


export type GameConfig = {
  template?: GameTemplate;
  reskinInput?: ReskinInput;
  difficulty?: Difficulty;
  assets?: Assets;
  music?: Music;
  parameters?: Parameters;
};

// Types for the Autofill flow
export type AutofillReskinBlanksInput = {
  gameTemplate: string;
  currentValues: {
    story?: string;
    theme?: string;
    artStyle?: string;
    environment?: string;
    npcs?: string;
    mainCharacter?: string;
    musicTheme?: string;
  };
};

export type AutofillReskinBlanksOutput = {
  filledValues: {
    story: string;
    theme: string;
    artStyle: string;
    environment: string;
    npcs: string;
    mainCharacter: string;
    musicTheme: string;
  };
};

// Types for the Parameter Autofill flow
export type AutofillParametersBlanksInput = {
  gameTemplate: string;
  currentRequest?: string;
};

export type AutofillParametersBlanksOutput = {
  filledRequest: string;
};

    