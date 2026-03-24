"use client";

import { useEffect } from "react";
import { useProgressStore } from "@/store/useProgressStore";

const TASKS_KEY = "ditltech.completedTasks.v1";
const PO_KEY = "ditltech.po.v1";

export function ProgressHydrator({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const completedTasks = useProgressStore((s) => s.completedTasks);
  const hasHydrated = useProgressStore((s) => s.hasHydrated);
  const hydrateFromStorage = useProgressStore((s) => s.hydrateFromStorage);

  const poStakeholderOutcome = useProgressStore((s) => s.poStakeholderOutcome);
  const poMoodScore = useProgressStore((s) => s.poMoodScore);
  const poRequirementDraft = useProgressStore((s) => s.poRequirementDraft);
  const poTicketState = useProgressStore((s) => s.poTicketState);

  useEffect(() => {
    hydrateFromStorage();
    // Intentionally only on first mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    try {
      window.localStorage.setItem(
        TASKS_KEY,
        JSON.stringify({ completedTasks })
      );
    } catch {
      // localStorage may be blocked; simulation still works in-memory
    }
  }, [completedTasks, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    try {
      window.localStorage.setItem(
        PO_KEY,
        JSON.stringify({
          poStakeholderOutcome,
          poMoodScore,
          poRequirementDraft,
          poTicketState,
        })
      );
    } catch {
      // localStorage may be blocked
    }
  }, [hasHydrated, poStakeholderOutcome, poMoodScore, poRequirementDraft, poTicketState]);

  return <>{children}</>;
}
