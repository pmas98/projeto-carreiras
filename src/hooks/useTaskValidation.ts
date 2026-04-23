"use client";

import { useEffect, useState } from "react";
import { useProgressStore } from "@/store/useProgressStore";
import type { TaskId } from "@/lib/tasks";

interface ValidationOptions<T> {
  taskId: TaskId;
  currentState: T;
  validate: (state: T) => boolean;
  onSuccess?: () => void;
}

export function useTaskValidation<T>({ 
  taskId, 
  currentState, 
  validate, 
  onSuccess 
}: ValidationOptions<T>) {
  const markTaskComplete = useProgressStore((s) => s.markTaskComplete);
  const isComplete = useProgressStore((s) => s.isTaskComplete(taskId));
  const [justCompleted, setJustCompleted] = useState(false);

  useEffect(() => {
    if (isComplete) return;

    const isValid = validate(currentState);
    
    if (isValid) {
      markTaskComplete(taskId);
      setJustCompleted(true);
      if (onSuccess) onSuccess();
    }
  }, [currentState, taskId, validate, isComplete, markTaskComplete, onSuccess]);

  return {
    isComplete,
    justCompleted,
  };
}
