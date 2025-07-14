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
import { autofillParametersBlanks } from '@/ai/flows/autofill-parameters-blanks';
import type { GameConfig, Parameters } from '@/lib/types';
import LoadingIndicator from './LoadingIndicator';
import { ArrowLeft, ArrowRight, SlidersHorizontal, Sparkles } from 'lucide-react';
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
  const { toast, dismiss } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isAutofilling, setIsAutofilling] = useState(false);
  
  const currentParams = config.parameters?.adjusted || config.template?.defaultParams;

  const { register, handleSubmit, formState: { errors }, getValues, setValue, setFocus } = useForm<ParamFormData>({
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

  const handleAutofill = async () => {
    if (!config.template) {
        toast({ title: "Error", description: "No game template selected.", variant: "destructive" });
        return;
    }
    setIsAutofilling(true);
    const currentRequest = getValues('request');
    const previousRequest = currentRequest;

    try {
        const result = await autofillParametersBlanks({
            gameTemplate: config.template.name,
            currentRequest: currentRequest,
        });

        if (result.filledRequest) {
            setValue('request', result.filledRequest, { shouldValidate: true, shouldDirty: true });
            setFocus('request');

            const { id } = toast({
                title: "Request field filled by AI",
                description: (
                    <Button variant="link" className="p-0 h-auto" onClick={() => {
                        setValue('request', previousRequest, { shouldValidate: true });
                        dismiss(id);
                        toast({ title: "Undo successful", description: "Your previous request has been restored." });
                    }}>Undo</Button>
                ),
                duration: 5000,
            });
        } else {
             toast({ title: "Request field is already filled!", description: "AI didn't find any blanks to fill." });
        }

    } catch(error) {
        console.error('AI parameter autofill failed:', error);
        toast({ title: "Autofill Failed", description: "The AI failed to generate a suggestion. Please try again.", variant: "destructive" });
    } finally {
        setIsAutofilling(false);
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
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-4 gap-3">
                  <Button 
                      type="button" 
                      variant="outline"
                      onClick={handleAutofill} 
                      disabled={isAutofilling || isLoading} 
                      className="w-full sm:w-auto sm:min-w-[220px] border-primary text-primary hover:border-accent hover:text-accent-foreground"
                  >
                      {isAutofilling ? <LoadingIndicator text="Autofilling..."/> : <><Sparkles className="mr-2 h-4 w-4"/> AI Autofill Blanks</>}
                  </Button>
                  <Button 
                      type="submit" 
                      disabled={isLoading || isAutofilling} 
                      className="w-full sm:w-auto sm:min-w-[220px]"
                  >
                      {isLoading ? <LoadingIndicator text="Adjusting..." /> : 'Generate New Parameters'}
                  </Button>
              </div>
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
