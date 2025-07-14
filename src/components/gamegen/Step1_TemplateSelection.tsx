import { gameTemplates } from '@/lib/game-templates';
import type { GameTemplate, GameConfig } from '@/lib/types';
import GameCard from './GameCard';

interface Step1Props {
  onNext: () => void;
  onUpdateConfig: (config: Partial<GameConfig>) => void;
}

export default function Step1TemplateSelection({ onNext, onUpdateConfig }: Step1Props) {
  const handleSelect = (template: GameTemplate) => {
    onUpdateConfig({ template });
    onNext();
  };

  return (
    <section>
      <div className="text-center">
        <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
          Choose Your Game Template
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Select one of our classic game templates to start your creation.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {gameTemplates.map((template) => (
          <GameCard key={template.id} template={template} onSelect={handleSelect} />
        ))}
      </div>
    </section>
  );
}
