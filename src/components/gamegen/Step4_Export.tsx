"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { GameConfig } from '@/lib/types';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';
import { exportGameAsHtml } from '@/lib/export-game';

interface Step4Props {
  config: GameConfig;
  onBack: () => void;
  onReset: () => void;
}

export default function Step4Export({ config, onBack, onReset }: Step4Props) {

  const handleExport = () => {
    exportGameAsHtml(config);
  };

  return (
    <section className="mx-auto max-w-2xl text-center">
      <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
        Your Game Is Ready!
      </h2>
      <p className="mt-4 text-lg text-muted-foreground">
        Download your game as a single HTML file and play it anywhere, anytime.
      </p>

      <Card className="mt-12 text-left">
        <CardHeader>
          <CardTitle className="font-headline">Game Summary</CardTitle>
          <CardDescription>A quick look at your creation.</CardDescription>
        </CardHeader>
        <CardContent>
          {config.template ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="sm:col-span-1">
                 {config.assets?.newMainCharacterImage ? (
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
                        <Image src={config.assets.newMainCharacterImage} alt="Main Character" layout="fill" objectFit="contain" />
                    </div>
                    ) : (
                    <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        No Image
                    </div>
                )}
              </div>
              <div className="space-y-4 sm:col-span-2">
                <div>
                  <h3 className="font-bold">Template</h3>
                  <p className="text-muted-foreground">{config.template.name}</p>
                </div>
                <div>
                  <h3 className="font-bold">Theme</h3>
                  <p className="text-muted-foreground">{config.reskinInput?.theme || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-bold">Story</h3>
                  <p className="text-muted-foreground line-clamp-2">{config.reskinInput?.story || 'N/A'}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No game data available. Please start over.</p>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button size="lg" onClick={handleExport} disabled={!config.template}>
            <Download className="mr-2 h-5 w-5" /> Export Game
        </Button>
        <Button size="lg" variant="outline" onClick={onReset}>
            <RefreshCw className="mr-2 h-5 w-5" /> Create New Game
        </Button>
      </div>

       <div className="mt-8 flex justify-center">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Parameters
        </Button>
      </div>

    </section>
  );
}
