
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { reskinGameAssets } from '@/ai/flows/reskin-game-assets';
import { generateGameMusic } from '@/ai/flows/generate-game-music';
import { autofillReskinBlanks } from '@/ai/flows/autofill-reskin-blanks';
import type { GameConfig, ReskinInput, Assets, Music, Difficulty } from '@/lib/types';
import { getFallbackDataForTemplate } from '@/lib/fallback-data';
import LoadingIndicator from './LoadingIndicator';
import { ArrowLeft, ArrowRight, Wand2, Music as MusicIcon, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { getFallbackAssetsForTemplate } from './FallbackAssets';

interface Step2Props {
  config: GameConfig;
  onNext: () => void;
  onBack: () => void;
  onUpdateConfig: (config: Partial<GameConfig>) => void;
}

const reskinSchema = z.object({
  story: z.string().min(10, 'Please describe the story in a bit more detail.'),
  theme: z.string().min(3, 'Theme is required.'),
  artStyle: z.string().min(3, 'Art style is required.'),
  environment: z.string().min(10, 'Please describe the environment.'),
  npcs: z.string().min(3, 'Describe the NPCs.'),
  mainCharacter: z.string().min(3, 'Describe the main character.'),
  difficulty: z.object({
    easy: z.string().optional(),
    medium: z.string().optional(),
    hard: z.string().optional(),
  }),
  musicTheme: z.string().min(3, 'Music theme is required.'),
  musicDuration: z.number().min(5).max(60),
});

type ReskinFormData = z.infer<typeof reskinSchema>;

export default function Step2Reskin({ config, onNext, onBack, onUpdateConfig }: Step2Props) {
  const { toast, dismiss } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAutofilling, setIsAutofilling] = useState(false);
  const [generatedAssets, setGeneratedAssets] = useState<Assets | null>(config.assets || null);
  const [generatedMusic, setGeneratedMusic] = useState<Music | null>(config.music || null);

  const { register, handleSubmit, control, formState: { errors }, getValues, setValue, setFocus } = useForm<ReskinFormData>({
    resolver: zodResolver(reskinSchema),
    defaultValues: {
      story: config.reskinInput?.story || '',
      theme: config.reskinInput?.theme || '',
      artStyle: config.reskinInput?.artStyle || '',
      environment: config.reskinInput?.environment || '',
      npcs: config.reskinInput?.npcs || '',
      mainCharacter: config.reskinInput?.mainCharacter || '',
      difficulty: {
        easy: config.difficulty?.easy || 'Slower speed, fewer obstacles.',
        medium: config.difficulty?.medium || 'Normal speed and obstacles.',
        hard: config.difficulty?.hard || 'Faster speed, many obstacles.',
      },
      musicTheme: config.music?.theme || '',
      musicDuration: config.music?.duration || 30,
    },
  });

  const onSubmit = async (data: ReskinFormData) => {
    if (!config.template) {
        toast({ title: "Error", description: "No game template selected.", variant: "destructive" });
        return;
    }
    setIsGenerating(true);
    setGeneratedAssets(null);
    setGeneratedMusic(null);

    const reskinInput: ReskinInput = {
      story: data.story,
      theme: data.theme,
      artStyle: data.artStyle,
      environment: data.environment,
      npcs: data.npcs,
      mainCharacter: data.mainCharacter,
    };
    
    const difficulty: Difficulty = {
        easy: data.difficulty.easy || 'Slower speed, fewer obstacles.',
        medium: data.difficulty.medium || 'Normal speed and obstacles.',
        hard: data.difficulty.hard || 'Faster speed, many obstacles.',
    };

    onUpdateConfig({ reskinInput, difficulty });

    try {
      const assetsPromise = reskinGameAssets({
        gameTemplate: config.template.name as any,
        ...reskinInput,
        difficulty: difficulty,
      });

      const musicPromise = generateGameMusic({
        theme: data.musicTheme,
        duration: data.musicDuration,
      }).catch(err => {
        console.error("Music generation failed, proceeding without music.", err);
        const errorMessage = (err.message || '').toLowerCase();
        if (errorMessage.includes('429') || errorMessage.includes('quota')) {
             toast({ title: "Music Quota Reached", description: "Visuals will be created, but music was skipped due to rate limits.", variant: "destructive" });
        } else {
            toast({ title: "Music Generation Failed", description: "An unexpected error occurred while creating audio. Visuals were created, but music was skipped.", variant: "destructive" });
        }
        return null; // Return null if music generation fails
      });

      const [assetsResult, musicResult] = await Promise.all([assetsPromise, musicPromise]);

      if (!assetsResult) {
        throw new Error("Asset generation failed.");
      }

      const assets: Assets = { ...assetsResult };
      setGeneratedAssets(assets);
      onUpdateConfig({ assets });
      
      let finalMusic: Music | undefined = undefined;
      if (musicResult) {
        finalMusic = {
            theme: data.musicTheme,
            duration: data.musicDuration,
            dataUri: musicResult.musicDataUri,
        };
        setGeneratedMusic(finalMusic);
      }
      onUpdateConfig({ music: finalMusic });

      toast({ title: "Success!", description: "Your game has been customized." });

    } catch (error: any) {
        console.error('AI generation failed:', error);
        const errorMessage = (error.message || '').toLowerCase();
        if (errorMessage.includes('429') || errorMessage.includes('quota')) {
          const fallbackAssets = getFallbackAssetsForTemplate(config.template?.id);
          toast({
            title: "AI Quota Reached",
            description: "Used fallback placeholder assets instead.",
            variant: "destructive",
          });
          setGeneratedAssets(fallbackAssets);
          onUpdateConfig({ assets: fallbackAssets, music: undefined });
        } else {
          toast({
            title: "Generation Failed",
            description: "The AI failed to generate assets. Please try again.",
            variant: "destructive",
          });
        }
    } finally {
        setIsGenerating(false);
    }
  };
  
  const handleAutofill = async () => {
    if (!config.template) {
        toast({ title: "Error", description: "No game template selected.", variant: "destructive" });
        return;
    }
    setIsAutofilling(true);
    const currentValues = getValues();
    const previousValues = {...currentValues}; // Backup for undo
    
    try {
        const result = await autofillReskinBlanks({
            gameTemplate: config.template.name as any,
            currentValues: {
                story: currentValues.story,
                theme: currentValues.theme,
                artStyle: currentValues.artStyle,
                environment: currentValues.environment,
                npcs: currentValues.npcs,
                mainCharacter: currentValues.mainCharacter,
                musicTheme: currentValues.musicTheme,
            }
        });

        let firstFilledField: (keyof ReskinFormData) | null = null;
        let filledCount = 0;

        Object.entries(result.filledValues).forEach(([key, value]) => {
            if(value) {
                setValue(key as any, value, { shouldValidate: true, shouldDirty: true });
                if (!firstFilledField) {
                    firstFilledField = key as any;
                }
                filledCount++;
            }
        });

        if (firstFilledField) {
            setFocus(firstFilledField as any);
        }

        if (filledCount > 0) {
            const { id } = toast({
                title: `${filledCount} fields filled by AI`,
                description: (
                    <Button variant="link" className="p-0 h-auto" onClick={() => {
                        Object.entries(previousValues).forEach(([key, value]) => {
                            setValue(key as any, value, { shouldValidate: true });
                        });
                        dismiss(id);
                        toast({ title: "Undo successful", description: "Your previous values have been restored." });
                    }}>Undo</Button>
                ),
                duration: 5000,
            });
        } else {
            toast({ title: "All fields are already filled!", description: "AI didn't find any blanks to fill." });
        }

    } catch(error: any) {
        console.error('AI autofill failed:', error);
        const errorMessage = (error.message || '').toLowerCase();
        if (errorMessage.includes('429') || errorMessage.includes('quota')) {
          toast({ title: "AI Quota Reached", description: "Used a fallback theme instead. Your existing input was preserved.", variant: "destructive" });
          
          const fallbackValues = getFallbackDataForTemplate(config.template?.id).reskinForm;
          const currentFormValues = getValues();
          let firstFilledField: keyof typeof fallbackValues | null = null;
          
          (Object.keys(fallbackValues) as Array<keyof typeof fallbackValues>).forEach(key => {
            if (!currentFormValues[key as keyof typeof currentFormValues]) {
              setValue(key as any, fallbackValues[key as keyof typeof fallbackValues], { shouldValidate: true, shouldDirty: true });
              if (!firstFilledField) {
                  firstFilledField = key as any;
              }
            }
          });
          if (firstFilledField) {
              setFocus(firstFilledField);
          }

        } else {
          toast({ title: "Autofill Failed", description: "The AI failed to generate suggestions. Please try again.", variant: "destructive" });
        }
    } finally {
        setIsAutofilling(false);
    }
  };


  return (
    <section>
        <div className="text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Customize with AI
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
            Fill in the details below, or let our AI autofill to get you started.
            </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                 {/* Reskinning Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline"><Wand2/> Visual Reskinning</CardTitle>
                        <CardDescription>Describe the look and feel of your game.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Object.keys(errors).length > 0 && <p className="text-sm text-destructive">Please fill out all required fields.</p>}
                        
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                           <div>
                                <Label htmlFor="theme">Theme</Label>
                                <Input id="theme" {...register('theme')} placeholder="e.g., Sci-Fi, Fantasy, Spooky" />
                            </div>
                            <div>
                                <Label htmlFor="artStyle">Art Style</Label>
                                <Input id="artStyle" {...register('artStyle')} placeholder="e.g., Pixel Art, Cartoon, Realistic" />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="story">Story</Label>
                            <Textarea id="story" {...register('story')} placeholder="A brief story for your game..." />
                        </div>

                         <div>
                            <Label htmlFor="mainCharacter">Main Character</Label>
                            <Input id="mainCharacter" {...register('mainCharacter')} placeholder="e.g., A brave knight, a curious robot" />
                        </div>

                        <div>
                            <Label htmlFor="environment">Environment</Label>
                            <Input id="environment" {...register('environment')} placeholder="e.g., A lush forest, a futuristic city" />
                        </div>
                         <div>
                            <Label htmlFor="npcs">NPCs / Obstacles</Label>
                            <Input id="npcs" {...register('npcs')} placeholder="e.g., Goombas, ghosts, asteroids" />
                        </div>
                        
                        {/* Difficulty Settings */}
                        <div className="space-y-2 pt-2">
                            <h4 className="font-medium text-sm">Difficulty Descriptions</h4>
                            <div>
                                <Label htmlFor="difficultyEasy">Easy</Label>
                                <Input id="difficultyEasy" {...register('difficulty.easy')} />
                            </div>
                             <div>
                                <Label htmlFor="difficultyMedium">Medium</Label>
                                <Input id="difficultyMedium" {...register('difficulty.medium')} />
                            </div>
                             <div>
                                <Label htmlFor="difficultyHard">Hard</Label>
                                <Input id="difficultyHard" {...register('difficulty.hard')} />
                            </div>
                        </div>

                    </CardContent>
                </Card>

                {/* Music Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline"><MusicIcon/> Background Music</CardTitle>
                        <CardDescription>Generate unique background music for your game.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="musicTheme">Music Theme</Label>
                            <Input id="musicTheme" {...register('musicTheme')} placeholder="e.g., Epic orchestral, 8-bit chiptune" />
                        </div>
                        <div>
                            <Label>Duration: <Controller
                                name="musicDuration"
                                control={control}
                                render={({ field }) => <span>{field.value}s</span>}
                                /></Label>
                            <Controller
                                name="musicDuration"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <Slider
                                    value={[value]}
                                    onValueChange={(vals) => onChange(vals[0])}
                                    min={5}
                                    max={60}
                                    step={1}
                                    />
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>
                
                <div className="flex w-full gap-4">
                    <Button 
                        type="submit" 
                        disabled={isGenerating || isAutofilling} 
                        className="w-3/4"
                    >
                        {isGenerating ? <LoadingIndicator text="Generating..."/> : <>Generate Assets &amp; Music</>}
                    </Button>
                    <Button 
                        type="button" 
                        variant="outline"
                        onClick={handleAutofill} 
                        disabled={isAutofilling || isGenerating} 
                        className="w-1/4 border-primary text-primary hover:border-accent hover:text-accent-foreground"
                    >
                        {isAutofilling ? <LoadingIndicator text="Autofilling..."/> : <><Sparkles className="mr-2 h-4 w-4"/>AI Autofill</>}
                    </Button>
                </div>
            </form>

            {/* Preview Section */}
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Preview</CardTitle>
                        <CardDescription>Your generated assets will appear here.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {(isGenerating || isAutofilling) && <LoadingIndicator text={isGenerating ? "AI is creating your world..." : "AI is filling the blanks..."} />}
                        {!isGenerating && !isAutofilling && !generatedAssets && (
                            <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                                <Wand2 className="h-12 w-12 mb-4" />
                                <p>Your generated game assets will be shown here.</p>
                            </div>
                        )}
                        {generatedAssets && (
                            <div className={cn("space-y-4", (isGenerating || isAutofilling) && "opacity-50")}>
                                <div>
                                    <h3 className="font-bold text-lg">Main Character</h3>
                                    <div className="relative w-full aspect-square rounded-lg overflow-hidden border bg-muted mt-2">
                                        <Image src={generatedAssets.newMainCharacterImage} alt="Generated Main Character" fill className="object-contain p-2" />
                                    </div>
                                </div>
                                 <div>
                                    <h3 className="font-bold text-lg">NPCs / Obstacles</h3>
                                    <div className="relative w-full aspect-square rounded-lg overflow-hidden border bg-muted mt-2">
                                        {generatedAssets.newNpcImages.length > 0 ? (
                                             <Image src={generatedAssets.newNpcImages[0]} alt="Generated NPCs" fill className="object-contain p-2" />
                                        ) : <p className="text-muted-foreground p-4">No NPC image generated.</p>}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Environment</h3>
                                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-muted mt-2">
                                        <Image src={generatedAssets.newEnvironmentImage} alt="Generated Environment" fill className="object-cover" />
                                    </div>
                                </div>
                            </div>
                        )}
                        {generatedMusic && (
                            <div className={cn("mt-4", (isGenerating || isAutofilling) && "opacity-50")}>
                                <h3 className="font-bold text-lg mb-2">Background Music</h3>
                                <audio controls src={generatedMusic.dataUri} className="w-full">
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        )}
                    </CardContent>
                </Card>
                 <div className="flex justify-between">
                    <Button variant="outline" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                    <Button onClick={onNext} disabled={!generatedAssets}>Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
            </div>
        </div>
    </section>
  );
}
