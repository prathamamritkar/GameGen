
"use client";

import { Button } from '@/components/ui/button';
import type { GameConfig } from '@/lib/types';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';
import { exportGameAsHtml, createHtmlContentForGame } from '@/lib/export-game';
import GamePreview from './GamePreview';
import { useEffect, useState } from 'react';

interface Step4Props {
  config: GameConfig;
  onBack: () => void;
  onReset: () => void;
}

export default function Step4Export({ config, onBack, onReset }: Step4Props) {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const generatePreview = () => {
    setIsLoading(true);
    const content = createHtmlContentForGame(config);
    setHtmlContent(content);
    // Simulate build time
    setTimeout(() => setIsLoading(false), 500);
  };

  useEffect(() => {
    generatePreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);


  const handleExport = () => {
    if (htmlContent) {
      exportGameAsHtml(htmlContent, config);
    }
  };

  return (
    <section className="mx-auto max-w-4xl text-center">
      <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
        Your Game Is Ready!
      </h2>
      <p className="mt-4 text-lg text-muted-foreground">
        Preview your final game below, or download it and play it anywhere, anytime.
      </p>

      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button size="lg" onClick={handleExport} disabled={!htmlContent || isLoading}>
            <Download className="mr-2 h-5 w-5" /> Export as HTML
        </Button>
        <Button size="lg" variant="outline" onClick={onReset}>
            <RefreshCw className="mr-2 h-5 w-5" /> Create New Game
        </Button>
      </div>

       <div className="mt-8 mb-6">
        <GamePreview 
            htmlContent={htmlContent} 
            isLoading={isLoading}
            onRebuild={generatePreview}
        />
      </div>
      
       <div className="mt-8 flex justify-center">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Parameters
        </Button>
      </div>

    </section>
  );
}
