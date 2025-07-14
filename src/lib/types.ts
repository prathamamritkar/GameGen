export type GameTemplateId = 'flappy-bird' | 'speed-runner' | 'whack-a-mole' | 'match-3' | 'crossy-road';

export type GameTemplate = {
  id: GameTemplateId;
  name: string;
  description: string;
  image: string;
  dataAiHint: string;
  defaultParams: Record<string, any>;
};

export type ReskinInput = {
  story: string;
  theme: string;
  artStyle: string;
  environment: string;
  npcs: string;
  mainCharacter: string;
  difficultySettings: {
    easy: string;
    medium: string;
    hard: string;
  };
};

export type Assets = {
  newAssetsDescription: string;
  newMainCharacterImage: string;
  newEnvironmentImage: string;
  newNpcImages: string[];
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
  assets?: Assets;
  music?: Music;
  parameters?: Parameters;
};
