
'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Gamepad2, Loader } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { useEffect } from 'react';

interface GamePreviewProps {
  htmlContent: string | null;
  isLoading: boolean;
  onRebuild: () => void;
}

export default function GamePreview({ htmlContent, isLoading, onRebuild }: GamePreviewProps) {
  const cardClasses = cn(
    'relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg transition-all duration-400 ease-in-out',
    {
      'border-2 border-primary animate-in fade-in-0 slide-in-from-bottom-2': !isLoading && htmlContent,
      'border-2 border-dashed border-accent': isLoading,
      'border-2 border-destructive': !isLoading && !htmlContent
    }
  );

  useEffect(() => {
    // This effect ensures that if the htmlContent changes,
    // we give the iframe a moment to re-render before showing it.
    // This helps prevent showing a stale preview.
  }, [htmlContent]);

  return (
    <Card className={cardClasses}>
      <CardContent className="p-0">
        <div 
          className="relative w-full aspect-video bg-muted"
          aria-live="polite"
        >
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <Loader className="h-12 w-12 animate-spin text-accent" />
              <p className="font-headline text-lg">Building preview...</p>
            </div>
          )}

          {!isLoading && htmlContent && (
            <>
              <Badge variant="secondary" className="absolute top-2 right-2 z-10 font-mono uppercase text-accent-foreground bg-accent/80 backdrop-blur-sm">
                Playable Preview
              </Badge>
              <iframe
                srcDoc={htmlContent}
                className="h-full w-full border-0"
                title="Game Preview"
                sandbox="allow-scripts allow-same-origin"
                tabIndex={0}
              />
            </>
          )}

          {!isLoading && !htmlContent && (
             <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4 text-destructive">
               <AlertCircle className="h-12 w-12" />
               <p className="font-headline text-lg">Oops! Preview failed to build.</p>
               <Button onClick={onRebuild}>
                 <Gamepad2 className="mr-2 h-4 w-4" />
                 Rebuild Preview
               </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
