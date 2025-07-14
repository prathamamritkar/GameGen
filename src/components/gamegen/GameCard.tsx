import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { GameTemplate } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

interface GameCardProps {
  template: GameTemplate;
  onSelect: (template: GameTemplate) => void;
}

export default function GameCard({ template, onSelect }: GameCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="font-headline">{template.name}</CardTitle>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between">
        <div className="relative mb-4 aspect-video w-full">
            <Image 
                src={template.image} 
                alt={template.name} 
                fill
                className="rounded-md object-cover"
                data-ai-hint={template.dataAiHint}
            />
        </div>
        <Button onClick={() => onSelect(template)} className="w-full">
          Select Template <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
