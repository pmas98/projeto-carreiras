import type { TaskId } from "@/lib/tasks";
import type { PORequirement } from "@/lib/po-personas";
import type { KanbanCard } from "@/lib/po-tickets";
import { create } from "zustand";

export type { KanbanCard } from "@/lib/po-tickets";
export type { PORequirement } from "@/lib/po-personas";
export type StakeholderOutcome = "great" | "good" | "medium" | "bad" | null;

const TASKS_KEY = "ditltech.completedTasks.v1";
const PO_KEY = "ditltech.po.v1";

type POStoredData = {
  poStakeholderOutcome: StakeholderOutcome;
  poMoodScore: number;
  poRequirementDraft: PORequirement[];
  poTicketState: KanbanCard[];
};

type ProgressState = {
  completedTasks: TaskId[];
  hasHydrated: boolean;
  hydrateFromStorage: () => void;
  markTaskComplete: (taskId: TaskId) => void;
  resetProgress: () => void;
  isTaskComplete: (taskId: TaskId) => boolean;

  // PO-specific state
  poStakeholderOutcome: StakeholderOutcome;
  poMoodScore: number;
  poRequirementDraft: PORequirement[];
  poTicketState: KanbanCard[];
  setPoStakeholderOutcome: (outcome: StakeholderOutcome, moodScore: number) => void;
  setPoRequirementDraft: (requirements: PORequirement[]) => void;
  setPoTicketState: (cards: KanbanCard[]) => void;
};

export const useProgressStore = create<ProgressState>((set, get) => ({
  completedTasks: [],
  hasHydrated: false,

  // PO initial state
  poStakeholderOutcome: null,
  poMoodScore: 70,
  poRequirementDraft: [],
  poTicketState: [],

  hydrateFromStorage: () => {
    if (typeof window === "undefined") return;
    try {
      // Load completedTasks
      const raw = window.localStorage.getItem(TASKS_KEY);
      let loadedCompleted: TaskId[] = [];
      if (raw) {
        const parsed = JSON.parse(raw) as { completedTasks?: TaskId[] };
        loadedCompleted = Array.isArray(parsed?.completedTasks)
          ? parsed.completedTasks.filter(Boolean)
          : [];
      }

      // Load PO data
      let poData: Partial<POStoredData> = {};
      const poRaw = window.localStorage.getItem(PO_KEY);
      if (poRaw) {
        try {
          poData = JSON.parse(poRaw) as Partial<POStoredData>;
        } catch {
          // ignore malformed PO data
        }
      }

      const currentCompleted = get().completedTasks;
      const mergedCompleted = Array.from(
        new Set([...currentCompleted, ...loadedCompleted])
      );

      set({
        completedTasks: mergedCompleted,
        hasHydrated: true,
        poStakeholderOutcome: poData.poStakeholderOutcome ?? null,
        poMoodScore: poData.poMoodScore ?? 70,
        poRequirementDraft: poData.poRequirementDraft ?? [],
        poTicketState: poData.poTicketState ?? [],
      });
    } catch {
      set({ hasHydrated: true });
    }
  },

  markTaskComplete: (taskId) => {
    const existing = get().completedTasks;
    if (existing.includes(taskId)) return;
    set({ completedTasks: [...existing, taskId] });
  },

  resetProgress: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(TASKS_KEY);
      window.localStorage.removeItem(PO_KEY);
    }
    set({
      completedTasks: [],
      hasHydrated: true,
      poStakeholderOutcome: null,
      poMoodScore: 70,
      poRequirementDraft: [],
      poTicketState: [],
    });
  },

  isTaskComplete: (taskId) => get().completedTasks.includes(taskId),

  setPoStakeholderOutcome: (outcome, moodScore) => {
    set({ poStakeholderOutcome: outcome, poMoodScore: moodScore });
  },

  setPoRequirementDraft: (requirements) => {
    set({ poRequirementDraft: requirements });
  },

  setPoTicketState: (cards) => {
    set({ poTicketState: cards });
  },
}));
