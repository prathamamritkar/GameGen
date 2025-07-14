"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { controlGameParameters } from '@/ai/flows/control-game-parameters';
import type { GameConfig, Parameters } from '@/lib/types';
import LoadingIndicator from './LoadingIndicator';
import { ArrowLeft, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Step3Props {
  config: GameConfig;
  onNext: () => void;
  onBack: () => void;
  onUpdateConfig: (config: Partial<GameConfig>) => void;
}

const paramSchema = z.object({
  request: z.string().min(10, 'Please describe the changes you want to make.'),
});

type ParamFormData = z.infer<typeof paramSchema>;

export default function Step3Parameters({ config, onNext, onBack, onUpdateConfig }: Step3Props) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const currentParams = config.parameters?.adjusted || config.template?.defaultParams;

  const { register, handleSubmit, formState: { errors } } = useForm<ParamFormData>({
    resolver: zodResolver(paramSchema),
    defaultValues: {
      request: config.parameters?.request || '',
    },
  });

  const onSubmit = async (data: ParamFormData) => {
    if (!config.template) {
        toast({ title: "Error", description: "No game template selected.", variant: "destructive" });
        return;
    }
    setIsLoading(true);

    try {
        const result = await controlGameParameters({
            gameType: config.template.name,
            parameterAdjustmentRequest: data.request,
            currentParameters: currentParams,
        });

        const newParameters: Parameters = {
            request: data.request,
            ...result
        };
        onUpdateConfig({ parameters: newParameters });
        toast({ title: "Success!", description: "Game parameters have been adjusted." });

    } catch (error) {
        console.error('AI parameter control failed:', error);
        toast({ title: "Adjustment Failed", description: "The AI failed to adjust parameters. Please try a different request.", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <section>
      <div className="text-center">
        <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
          Control Game Parameters
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Describe how you want to change the gameplay in plain English.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><SlidersHorizontal /> Adjust Gameplay</CardTitle>
              <CardDescription>
                Examples: "make the game faster and more challenging", "add more power-ups", "lower the gravity".
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="request">How should the game change?</Label>
                <Textarea
                  id="request"
                  {...register('request')}
                  placeholder="e.g., Make the game easier for a beginner..."
                  rows={5}
                />
                {errors.request && <p className="text-sm text-destructive mt-1">{errors.request.message}</p>}
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <LoadingIndicator text="Adjusting..." /> : 'Generate New Parameters'}
              </Button>
            </CardContent>
          </Card>
        </form>

        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Game Parameters</CardTitle>
                    <CardDescription>Review the AI-adjusted game parameters.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading && <LoadingIndicator text="AI is tuning your game..." />}
                    {!isLoading && (
                        <div className="space-y-4">
                             <div>
                                <h3 className="font-bold">Current Parameters:</h3>
                                <pre className="mt-2 w-full rounded-md bg-muted p-4 text-sm">
                                    <code>{JSON.stringify(currentParams, null, 2)}</code>
                                </pre>
                            </div>
                           {config.parameters?.explanation && (
                             <div>
                                <h3 className="font-bold">AI's Explanation:</h3>
                                <p className="mt-2 text-muted-foreground italic p-4 border rounded-md">{config.parameters.explanation}</p>
                            </div>
                           )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-between">
                <Button variant="outline" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                <Button onClick={onNext}>Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
        </div>
      </div>
    </section>
  );
}
