import type { TaskId } from "@/lib/tasks";
import type { PORequirement } from "@/lib/po-personas";
import type { KanbanCard } from "@/lib/po-tickets";
import { create } from "zustand";

export type { KanbanCard } from "@/lib/po-tickets";
export type { PORequirement } from "@/lib/po-personas";
export type StakeholderOutcome = "great" | "good" | "medium" | "bad" | null;

const TASKS_KEY = "ditltech.completedTasks.v1";
const PO_KEY = "ditltech.po.v1";
const TUTORIAL_KEY = "ditltech.tutorial.v1";

type POStoredData = {
  poStakeholderOutcome: StakeholderOutcome;
  poMoodScore: number;
  poRequirementDraft: PORequirement[];
  poTicketState: KanbanCard[];
};

type ProgressState = {
  completedTasks: TaskId[];
  tutorialSeen: Record<string, boolean>;
  hasHydrated: boolean;
  hydrateFromStorage: () => void;
  markTaskComplete: (taskId: TaskId) => void;
  markTutorialSeen: (moduleId: string) => void;
  resetTutorial: (moduleId: string) => void;
  resetTask: (taskId: TaskId) => void;
  resetProgress: () => void;
  isTaskComplete: (taskId: TaskId) => boolean;
  isTutorialSeen: (moduleId: string) => boolean;

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
  tutorialSeen: {},
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

      // Load tutorial seen data
      let tutorialSeen: Record<string, boolean> = {};
      const tutorialRaw = window.localStorage.getItem(TUTORIAL_KEY);
      if (tutorialRaw) {
        try {
          const parsed = JSON.parse(tutorialRaw) as {
            tutorialSeen?: Record<string, boolean>;
          };
          if (parsed && typeof parsed === "object" && parsed.tutorialSeen) {
            tutorialSeen = Object.entries(parsed.tutorialSeen).reduce(
              (acc, [moduleId, seen]) => {
                if (typeof moduleId === "string" && typeof seen === "boolean") {
                  acc[moduleId] = seen;
                }
                return acc;
              },
              {} as Record<string, boolean>
            );
          }
        } catch {
          // ignore malformed tutorial data
        }
      }

      const currentCompleted = get().completedTasks;
      const mergedCompleted = Array.from(
        new Set([...currentCompleted, ...loadedCompleted])
      );
      const currentTutorialSeen = get().tutorialSeen;
      const mergedTutorialSeen = { ...currentTutorialSeen, ...tutorialSeen };

      set({
        completedTasks: mergedCompleted,
        tutorialSeen: mergedTutorialSeen,
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
  
  resetTask: (taskId) => {
    const existing = get().completedTasks;
    set({ completedTasks: existing.filter(id => id !== taskId) });
  },

  markTutorialSeen: (moduleId) => {
    const normalizedModuleId = moduleId.trim();
    if (!normalizedModuleId) return;

    const existing = get().tutorialSeen;
    if (existing[normalizedModuleId]) return;
    const nextTutorialSeen = { ...existing, [normalizedModuleId]: true };
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(
          TUTORIAL_KEY,
          JSON.stringify({ tutorialSeen: nextTutorialSeen })
        );
      } catch {
        // ignore localStorage write failures
      }
    }
    set({ tutorialSeen: nextTutorialSeen });
  },

  resetTutorial: (moduleId) => {
    const normalizedModuleId = moduleId.trim();
    if (!normalizedModuleId) return;

    const existing = get().tutorialSeen;
    if (!existing[normalizedModuleId]) return;
    const remainingTutorials = { ...existing };
    delete remainingTutorials[normalizedModuleId];
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(
          TUTORIAL_KEY,
          JSON.stringify({ tutorialSeen: remainingTutorials })
        );
      } catch {
        // ignore localStorage write failures
      }
    }
    set({ tutorialSeen: remainingTutorials });
  },

  resetProgress: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(TASKS_KEY);
      window.localStorage.removeItem(PO_KEY);
      window.localStorage.removeItem(TUTORIAL_KEY);
    }
    set({
      completedTasks: [],
      tutorialSeen: {},
      hasHydrated: true,
      poStakeholderOutcome: null,
      poMoodScore: 70,
      poRequirementDraft: [],
      poTicketState: [],
    });
  },

  isTaskComplete: (taskId) => get().completedTasks.includes(taskId),
  isTutorialSeen: (moduleId) => {
    const normalizedModuleId = moduleId.trim();
    if (!normalizedModuleId) return false;
    return !!get().tutorialSeen[normalizedModuleId];
  },

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
