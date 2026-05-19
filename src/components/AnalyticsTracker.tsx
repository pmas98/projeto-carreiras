"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { captureEvent } from "@/lib/posthog";
import { useProgressStore } from "@/store/useProgressStore";
import type { TaskId } from "@/lib/tasks";

type TaskTrackingMeta = {
  taskId: TaskId;
  role: string;
  title: string;
};

const TRACKED_TASKS: Record<string, TaskTrackingMeta> = {
  "/product-owner/stakeholder-meeting": {
    taskId: "po_stakeholder_meeting",
    role: "productOwner",
    title: "A Reunião com Stakeholder",
  },
  "/product-owner/defining-product": {
    taskId: "po_defining_product",
    role: "productOwner",
    title: "Definindo o Produto",
  },
  "/product-owner/ticket-creation": {
    taskId: "po_ticket_creation",
    role: "productOwner",
    title: "Criação de Tickets",
  },
  "/frontend/frontend_inspector": {
    taskId: "frontend_inspector",
    role: "frontend",
    title: "Inspetor de Design",
  },
  "/frontend/frontend_framer": {
    taskId: "frontend_framer",
    role: "frontend",
    title: "Micro-interações",
  },
  "/frontend/frontend_a11y": {
    taskId: "frontend_a11y",
    role: "frontend",
    title: "O Pesadelo do Leitor de Tela",
  },
  "/devops/devops_incident_response": {
    taskId: "devops_incident_response",
    role: "devOps",
    title: "Gestão de Incidentes",
  },
  "/devops/devops_deployment_pipeline": {
    taskId: "devops_deployment_pipeline",
    role: "devOps",
    title: "Pipeline de Deploy",
  },
  "/devops/devops_infrastructure_scaling": {
    taskId: "devops_infrastructure_scaling",
    role: "devOps",
    title: "Infraestrutura e Escala",
  },
  "/backend/backend_api_client": {
    taskId: "backend_api_client",
    role: "backend",
    title: "O Cliente de API",
  },
  "/backend/backend_auth": {
    taskId: "backend_auth",
    role: "backend",
    title: "Autenticação",
  },
  "/backend/backend_data_fetching": {
    taskId: "backend_data_fetching",
    role: "backend",
    title: "Busca de Dados",
  },
};

const HUB_ROLES: Record<string, { role: string; label: string }> = {
  "/product-owner": { role: "productOwner", label: "Product Owner" },
  "/devops": { role: "devOps", label: "DevOps" },
  "/frontend": { role: "frontend", label: "Frontend" },
  "/backend": { role: "backend", label: "Backend" },
};

export function AnalyticsTracker() {
  const pathname = usePathname();
  const completedTasks = useProgressStore((s) => s.completedTasks);
  const previousPathnameRef = useRef<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const previousPathname = previousPathnameRef.current;
    
    // 1. Detect task page exit and capture abandonment
    if (previousPathname && previousPathname !== pathname) {
      // Capture generic page leave for bounce rate & session duration
      const prevMeta = TRACKED_TASKS[previousPathname];
      if (prevMeta) {
        const isCompleted = completedTasks.includes(prevMeta.taskId);
        const startKey = `task_start_${prevMeta.taskId}`;
        const startTimeStr = sessionStorage.getItem(startKey);
        
        if (!isCompleted && startTimeStr) {
          const durationSpent = (Date.now() - parseInt(startTimeStr, 10)) / 1000;
          
          // Only track abandonment if they stayed for more than 3 seconds (filters out quick clicks)
          if (durationSpent > 3) {
            captureEvent("task_abandoned", {
              task_id: prevMeta.taskId,
              role: prevMeta.role,
              title: prevMeta.title,
              duration_seconds_spent: parseFloat(durationSpent.toFixed(2)),
            });
          }
        }
        
        // Clean up start time from session when exiting the page
        sessionStorage.removeItem(startKey);
      }
    }

    // 2. Track entrance into a task page
    const currentMeta = TRACKED_TASKS[pathname];
    if (currentMeta) {
      const startKey = `task_start_${currentMeta.taskId}`;
      
      // Store start time in sessionStorage if not already set (retains through page refreshes)
      if (!sessionStorage.getItem(startKey)) {
        sessionStorage.setItem(startKey, Date.now().toString());
      }

      captureEvent("task_started", {
        task_id: currentMeta.taskId,
        role: currentMeta.role,
        title: currentMeta.title,
        already_completed: completedTasks.includes(currentMeta.taskId),
      });
    }

    // 3. Track entrance into a main career role section/hub
    const hubMeta = HUB_ROLES[pathname];
    if (hubMeta) {
      // Find how many tasks are completed in this role's category
      let completedCountInHub = 0;
      if (hubMeta.role === "productOwner") {
        completedCountInHub = completedTasks.filter((id) => id.startsWith("po_")).length;
      } else if (hubMeta.role === "devOps") {
        completedCountInHub = completedTasks.filter((id) => id.startsWith("devops_")).length;
      } else if (hubMeta.role === "frontend") {
        completedCountInHub = completedTasks.filter((id) => id.startsWith("frontend_")).length;
      } else if (hubMeta.role === "backend") {
        completedCountInHub = completedTasks.filter((id) => id.startsWith("backend_")).length;
      }

      captureEvent("role_section_viewed", {
        role: hubMeta.role,
        label: hubMeta.label,
        path: pathname,
        completed_tasks_count: completedCountInHub,
        total_tasks_count: 3,
      });
    }

    // Update previous pathname reference
    previousPathnameRef.current = pathname;
  }, [pathname, completedTasks]);

  return null;
}
