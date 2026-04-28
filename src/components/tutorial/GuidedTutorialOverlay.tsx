"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { UseGuidedTutorialResult } from "@/hooks/useGuidedTutorial";
import { TutorialCard } from "./TutorialCard";

type GuidedTutorialOverlayProps = {
  tutorial: UseGuidedTutorialResult;
};

const CARD_MAX_WIDTH = 360;
const CARD_MARGIN = 16;
const CARD_GAP = 14;
const CARD_ESTIMATED_HEIGHT = 320;
const CARD_CENTER_Y_OFFSET = 0.5;
const CARD_TARGET_Y_OFFSET = 0.47;
const TARGET_PADDING = 8;
const SPOTLIGHT_DARKNESS = "rgba(9, 9, 11, 0.72)";
const FOCUSABLE_SELECTOR =
  "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function GuidedTutorialOverlay({ tutorial }: GuidedTutorialOverlayProps) {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const idsBase = useId();
  const headingId = `${idsBase}-heading`;
  const descriptionId = `${idsBase}-description`;
  const {
    isOpen,
    currentStep,
    currentStepIndex,
    totalSteps,
    hasTarget,
    targetRect,
    skip,
    back,
    next,
    finish,
  } = tutorial;

  const effectiveCardWidth = useMemo(() => {
    if (viewport.width <= 0) return CARD_MAX_WIDTH;
    return Math.max(280, Math.min(CARD_MAX_WIDTH, viewport.width - CARD_MARGIN * 2));
  }, [viewport.width]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => {
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  const spotlightRect = useMemo(() => {
    if (!hasTarget || !targetRect) return undefined;
    const left = Math.max(targetRect.left - TARGET_PADDING, CARD_MARGIN);
    const top = Math.max(targetRect.top - TARGET_PADDING, CARD_MARGIN);
    const width = Math.max(targetRect.width + TARGET_PADDING * 2, 0);
    const height = Math.max(targetRect.height + TARGET_PADDING * 2, 0);
    return { left, top, width, height };
  }, [hasTarget, targetRect]);

  const spotlightStyle = useMemo<CSSProperties | undefined>(() => {
    if (!spotlightRect) return undefined;
    return {
      left: spotlightRect.left,
      top: spotlightRect.top,
      width: spotlightRect.width,
      height: spotlightRect.height,
    };
  }, [spotlightRect]);

  const cardStyle = useMemo<CSSProperties>(() => {
    const maxX = Math.max(CARD_MARGIN, viewport.width - effectiveCardWidth - CARD_MARGIN);
    const centeredFallback = {
      left: clamp((viewport.width - effectiveCardWidth) / 2, CARD_MARGIN, maxX),
      top: clamp(
        viewport.height * CARD_CENTER_Y_OFFSET - CARD_ESTIMATED_HEIGHT / 2,
        CARD_MARGIN,
        Math.max(CARD_MARGIN, viewport.height - CARD_ESTIMATED_HEIGHT)
      ),
    };

    if (!hasTarget || !targetRect || viewport.width === 0 || viewport.height === 0) {
      return centeredFallback;
    }

    const preferredRightX = targetRect.right + CARD_GAP;
    const preferredLeftX = targetRect.left - effectiveCardWidth - CARD_GAP;
    const canPlaceRight = preferredRightX + effectiveCardWidth + CARD_MARGIN <= viewport.width;
    const canPlaceLeft = preferredLeftX >= CARD_MARGIN;

    const targetCenterY = targetRect.top + targetRect.height / 2;
    const rawY = targetCenterY - CARD_ESTIMATED_HEIGHT * CARD_TARGET_Y_OFFSET;
    const maxY = Math.max(CARD_MARGIN, viewport.height - CARD_ESTIMATED_HEIGHT);
    const y = clamp(rawY, CARD_MARGIN, maxY);

    if (canPlaceRight) {
      return { left: preferredRightX, top: y };
    }
    if (canPlaceLeft) {
      return { left: preferredLeftX, top: y };
    }

    const belowY = targetRect.bottom + CARD_GAP;
    const aboveY = targetRect.top - CARD_ESTIMATED_HEIGHT - CARD_GAP;
    const x = clamp(targetRect.left, CARD_MARGIN, maxX);
    if (belowY + CARD_ESTIMATED_HEIGHT + CARD_MARGIN <= viewport.height) {
      return { left: x, top: belowY };
    }
    if (aboveY >= CARD_MARGIN) {
      return { left: x, top: aboveY };
    }

    return centeredFallback;
  }, [effectiveCardWidth, hasTarget, targetRect, viewport.height, viewport.width]);

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (focusable.length > 0) {
      focusable[0].focus();
      return;
    }
    dialog.focus();
  }, [isOpen, currentStepIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        skip();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, skip]);

  if (!isOpen || !currentStep) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {spotlightRect ? (
        <>
          <div
            className="absolute left-0 right-0 top-0"
            style={{ height: spotlightRect.top, background: SPOTLIGHT_DARKNESS }}
          />
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              top: spotlightRect.top + spotlightRect.height,
              background: SPOTLIGHT_DARKNESS,
            }}
          />
          <div
            className="absolute left-0"
            style={{
              top: spotlightRect.top,
              width: spotlightRect.left,
              height: spotlightRect.height,
              background: SPOTLIGHT_DARKNESS,
            }}
          />
          <div
            className="absolute right-0"
            style={{
              top: spotlightRect.top,
              left: spotlightRect.left + spotlightRect.width,
              height: spotlightRect.height,
              background: SPOTLIGHT_DARKNESS,
            }}
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-zinc-950/55" />
      )}

      {spotlightStyle ? (
        <div
          className="absolute rounded-xl border border-blue-400/80 bg-transparent shadow-[0_0_0_1px_rgba(96,165,250,0.35)] transition-all"
          style={spotlightStyle}
        />
      ) : null}

      <div
        ref={dialogRef}
        role="dialog"
        aria-labelledby={headingId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="pointer-events-auto absolute"
        style={{ ...cardStyle, width: effectiveCardWidth }}
      >
        <span className="sr-only" aria-live="polite">
          Passo {currentStepIndex + 1} de {totalSteps}: {currentStep.action.label}
        </span>
        <TutorialCard
          stepNumber={currentStepIndex + 1}
          totalSteps={totalSteps}
          actionLabel={currentStep.action.label}
          instruction={currentStep.title}
          why={currentStep.description}
          hint={currentStep.tip}
          showMissingTargetHint={!hasTarget}
          isFirstStep={currentStepIndex === 0}
          isLastStep={currentStepIndex >= totalSteps - 1}
          onSkip={skip}
          onBack={back}
          onNext={next}
          onFinish={finish}
          headingId={headingId}
          descriptionId={descriptionId}
        />
      </div>
    </div>
  );
}
