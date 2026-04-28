"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getTutorialDefinition } from "@/lib/tutorials/definitions";
import type { TutorialStepDefinition } from "@/lib/tutorials/types";
import { useProgressStore } from "@/store/useProgressStore";

export type UseGuidedTutorialResult = {
  moduleId: string;
  isOpen: boolean;
  hasTutorial: boolean;
  currentStepIndex: number;
  currentStep: TutorialStepDefinition | null;
  totalSteps: number;
  hasTarget: boolean;
  targetRect: DOMRect | null;
  start: () => void;
  close: () => void;
  next: () => void;
  back: () => void;
  goToStep: (index: number) => void;
  skip: () => void;
  finish: () => void;
};

function getSafeModuleId(moduleId: string): string {
  return moduleId.trim();
}

function querySelectorSafely(selector: string): Element | null {
  if (!selector || typeof document === "undefined") return null;
  try {
    return document.querySelector(selector);
  } catch {
    return null;
  }
}

export function useGuidedTutorial(moduleId: string): UseGuidedTutorialResult {
  const normalizedModuleId = useMemo(() => getSafeModuleId(moduleId), [moduleId]);
  const definition = useMemo(
    () => getTutorialDefinition(normalizedModuleId),
    [normalizedModuleId]
  );
  const steps = definition?.steps ?? [];
  const totalSteps = steps.length;
  const hasTutorial = totalSteps > 0;

  const hasHydrated = useProgressStore((state) => state.hasHydrated);
  const tutorialSeen = useProgressStore((state) =>
    normalizedModuleId ? !!state.tutorialSeen[normalizedModuleId] : false
  );
  const markTutorialSeen = useProgressStore((state) => state.markTutorialSeen);

  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [hasTarget, setHasTarget] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const autoOpenedRef = useRef(false);
  const autoOpenTimeoutRef = useRef<number | null>(null);
  const resetTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    autoOpenedRef.current = false;
    if (autoOpenTimeoutRef.current !== null) {
      window.clearTimeout(autoOpenTimeoutRef.current);
      autoOpenTimeoutRef.current = null;
    }
    if (resetTimeoutRef.current !== null) {
      window.clearTimeout(resetTimeoutRef.current);
    }
    resetTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
      setCurrentStepIndex(0);
      setHasTarget(false);
      setTargetRect(null);
      resetTimeoutRef.current = null;
    }, 0);
    return () => {
      if (resetTimeoutRef.current !== null) {
        window.clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = null;
      }
    };
  }, [normalizedModuleId]);

  useEffect(() => {
    if (!hasHydrated || !hasTutorial || tutorialSeen || autoOpenedRef.current) return;
    autoOpenedRef.current = true;
    if (autoOpenTimeoutRef.current !== null) {
      window.clearTimeout(autoOpenTimeoutRef.current);
    }
    autoOpenTimeoutRef.current = window.setTimeout(() => {
      setCurrentStepIndex(0);
      setIsOpen(true);
      autoOpenTimeoutRef.current = null;
    }, 0);
    return () => {
      if (autoOpenTimeoutRef.current !== null) {
        window.clearTimeout(autoOpenTimeoutRef.current);
        autoOpenTimeoutRef.current = null;
      }
    };
  }, [hasHydrated, hasTutorial, tutorialSeen, normalizedModuleId]);

  const boundedStepIndex = hasTutorial
    ? Math.min(Math.max(currentStepIndex, 0), totalSteps - 1)
    : 0;

  const currentStep = hasTutorial ? steps[boundedStepIndex] ?? null : null;
  const currentSelector = currentStep?.targetSelector ?? "";

  const updateTargetMetrics = useCallback(() => {
    if (!isOpen || !currentSelector || typeof document === "undefined") {
      setHasTarget(false);
      setTargetRect(null);
      return;
    }

    const element = querySelectorSafely(currentSelector);
    if (!element) {
      setHasTarget(false);
      setTargetRect(null);
      return;
    }

    setHasTarget(true);
    setTargetRect(element.getBoundingClientRect());
  }, [isOpen, currentSelector]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const frameId = window.requestAnimationFrame(() => {
      updateTargetMetrics();
    });
    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [updateTargetMetrics]);

  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return;

    const handleViewportChange = () => {
      updateTargetMetrics();
    };

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [isOpen, updateTargetMetrics]);

  const start = useCallback(() => {
    if (!hasTutorial) return;
    setCurrentStepIndex(0);
    setIsOpen(true);
  }, [hasTutorial]);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const next = useCallback(() => {
    if (!hasTutorial) return;
    setCurrentStepIndex((previous) => Math.min(previous + 1, totalSteps - 1));
  }, [hasTutorial, totalSteps]);

  const back = useCallback(() => {
    setCurrentStepIndex((previous) => Math.max(previous - 1, 0));
  }, []);

  const goToStep = useCallback(
    (index: number) => {
      if (!hasTutorial || !Number.isFinite(index)) return;
      const boundedIndex = Math.min(Math.max(Math.trunc(index), 0), totalSteps - 1);
      setCurrentStepIndex(boundedIndex);
    },
    [hasTutorial, totalSteps]
  );

  const markSeenAndClose = useCallback(() => {
    if (normalizedModuleId) {
      markTutorialSeen(normalizedModuleId);
    }
    setIsOpen(false);
  }, [markTutorialSeen, normalizedModuleId]);

  const skip = useCallback(() => {
    markSeenAndClose();
  }, [markSeenAndClose]);

  const finish = useCallback(() => {
    markSeenAndClose();
  }, [markSeenAndClose]);

  return {
    moduleId: normalizedModuleId,
    isOpen,
    hasTutorial,
    currentStepIndex: boundedStepIndex,
    currentStep,
    totalSteps,
    hasTarget,
    targetRect,
    start,
    close,
    next,
    back,
    goToStep,
    skip,
    finish,
  };
}
