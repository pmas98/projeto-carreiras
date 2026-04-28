import type { TaskId } from "@/lib/tasks";

export type TutorialActionType =
  | "click"
  | "input"
  | "change"
  | "observe"
  | "command"
  | "submit"
  | "navigate";

export type TutorialStepDefinition = {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  action: {
    type: TutorialActionType;
    label: string;
  };
  tip?: string;
};

export type TutorialModuleDefinition = {
  moduleId: TaskId;
  title: string;
  objective: string;
  steps: TutorialStepDefinition[];
};
