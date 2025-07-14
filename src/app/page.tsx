import { GameGenWizard } from '@/components/gamegen/GameGenWizard';
import { Gamepad2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <Gamepad2 className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl font-bold">
              GameGen
            </span>
          </a>
        </div>
      </header>
      <main className="flex-1">
        <GameGenWizard />
      </main>
      <footer className="py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-center gap-4 py-10 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with AI by Firebase.
          </p>
        </div>
      </footer>
    </div>
  );
}
