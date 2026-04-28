"use client";

import { useEffect, useState } from "react";
import { useProgressStore } from "@/store/useProgressStore";
import type { TaskId } from "@/lib/tasks";

interface ValidationOptions<T> {
  taskId: TaskId;
  currentState: T;
  validate: (state: T) => boolean;
  onSuccess?: () => void;
  successDelay?: number;
}

export function useTaskValidation<T>({ 
  taskId, 
  currentState, 
  validate, 
  onSuccess,
  successDelay = 0
}: ValidationOptions<T>) {
  const markTaskComplete = useProgressStore((s) => s.markTaskComplete);
  const isComplete = useProgressStore((s) => s.isTaskComplete(taskId));
  const [justCompleted, setJustCompleted] = useState(false);

  useEffect(() => {
    if (isComplete) return;

    const isValid = validate(currentState);
    
    if (isValid) {
      const timer = setTimeout(() => {
        markTaskComplete(taskId);
        setJustCompleted(true);
        if (onSuccess) onSuccess();
      }, successDelay);
      return () => clearTimeout(timer);
    } else {
      setJustCompleted(false);
    }
  }, [currentState, taskId, validate, isComplete, markTaskComplete, onSuccess, successDelay]);

  return {
    isComplete,
    justCompleted,
  };
}
