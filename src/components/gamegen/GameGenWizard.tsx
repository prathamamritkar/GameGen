"use client";

import { useState } from 'react';
import type { GameConfig } from '@/lib/types';
import StepIndicator from './StepIndicator';
import Step1TemplateSelection from './Step1_TemplateSelection';
import Step2Reskin from './Step2_Reskin';
import Step3Parameters from './Step3_Parameters';
import Step4Export from './Step4_Export';

export function GameGenWizard() {
  const [step, setStep] = useState(1);
  const [gameConfig, setGameConfig] = useState<GameConfig>({});

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 4));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));
  const handleReset = () => {
    setGameConfig({});
    setStep(1);
  };

  const updateConfig = (newConfig: Partial<GameConfig>) => {
    setGameConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const STEPS = [
    { number: 1, label: 'Template' },
    { number: 2, label: 'Customize' },
    { number: 3, label: 'Parameters' },
    { number: 4, label: 'Export' },
  ];

  return (
    <div className="container py-8 md:py-12">
      <StepIndicator steps={STEPS} currentStep={step} />
      <div className="mt-8">
        {step === 1 && (
          <Step1TemplateSelection onNext={handleNext} onUpdateConfig={updateConfig} />
        )}
        {step === 2 && (
          <Step2Reskin
            config={gameConfig}
            onNext={handleNext}
            onBack={handleBack}
            onUpdateConfig={updateConfig}
          />
        )}
        {step === 3 && (
          <Step3Parameters
            config={gameConfig}
            onNext={handleNext}
            onBack={handleBack}
            onUpdateConfig={updateConfig}
          />
        )}
        {step === 4 && (
          <Step4Export
            config={gameConfig}
            onBack={handleBack}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}
