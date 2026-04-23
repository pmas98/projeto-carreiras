import { useState, useMemo } from 'react';

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  explanation: string;
  targetSnippet: string;
  hint: string;
  validate: (code: string) => boolean;
}

export function useTutorialProgress(steps: TutorialStep[], currentCode: string) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  
  const isStepComplete = useMemo(() => {
    return currentStep.validate(currentCode);
  }, [currentStep, currentCode]);

  const goToNextStep = () => {
    if (!isLastStep && isStepComplete) {
      setCurrentStepIndex(prev => prev + 1);
      return true;
    }
    return false;
  };

  return {
    currentStep,
    currentStepIndex,
    totalSteps: steps.length,
    isStepComplete,
    isLastStep,
    goToNextStep,
    progress: ((currentStepIndex) / steps.length) * 100
  };
}
