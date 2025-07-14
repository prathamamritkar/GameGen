'use client';
import { cn } from "@/lib/utils";

interface LoadingIndicatorProps {
  text?: string;
}

export default function LoadingIndicator({ text = "Generating..." }: LoadingIndicatorProps) {
  return (
    <div className="flex w-full flex-col items-center gap-4 text-center">
        <p className="font-headline text-lg text-muted-foreground">{text}</p>
        <div className="relative h-4 w-full max-w-sm overflow-hidden rounded-full bg-muted">
            <div className="absolute left-0 top-0 h-full w-full animate-pulse bg-primary/50" />
            <div className="absolute left-0 top-0 h-full w-full">
                {/* Sparkles */}
                <div className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent sparkle-animation" style={{ left: '10%', animationDelay: '0ms' }} />
                <div className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent sparkle-animation" style={{ left: '30%', animationDelay: '200ms' }} />
                <div className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent sparkle-animation" style={{ left: '50%', animationDelay: '400ms' }} />
                <div className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent sparkle-animation" style={{ left: '70%', animationDelay: '100ms' }} />
                <div className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent sparkle-animation" style={{ left: '90%', animationDelay: '300ms' }} />

                <div className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary/80 dark:bg-primary sparkle-animation" style={{ left: '20%', animationDelay: '500ms' }} />
                <div className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary/80 dark:bg-primary sparkle-animation" style={{ left: '40%', animationDelay: '150ms' }} />
                <div className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary/80 dark:bg-primary sparkle-animation" style={{ left: '60%', animationDelay: '250ms' }} />
                <div className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary/80 dark:bg-primary sparkle-animation" style={{ left: '80%', animationDelay: '550ms' }} />
            </div>
        </div>
    </div>
  );
}
