import { notFound } from "next/navigation";
import { TASKS_BY_ROLE } from "@/lib/tasks";
import { IncidentManagementTask } from "@/components/devops/tasks/IncidentManagementTask";
import { DeploymentPipelineTask } from "@/components/devops/tasks/DeploymentPipelineTask";
import { InfrastructureScalingTask } from "@/components/devops/tasks/InfrastructureScalingTask";

interface PageProps {
  params: Promise<{ taskId: string }>;
}

export default async function DevOpsTaskPage({ params }: PageProps) {
  const { taskId } = await params;
  
  const task = TASKS_BY_ROLE.devOps.find((t) => t.id === taskId);

  if (!task) {
    notFound();
  }

  if (taskId === "devops_incident_response") {
    return <IncidentManagementTask />;
  }

  if (taskId === "devops_deployment_pipeline") {
    return <DeploymentPipelineTask />;
  }

  if (taskId === "devops_infrastructure_scaling") {
    return <InfrastructureScalingTask />;
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 dark:bg-black p-8">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{task.title}</h1>
      <p className="text-zinc-600 dark:text-zinc-400 mt-2">{task.subtitle}</p>
      
      <div className="mt-8 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm max-w-2xl w-full">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
          O ambiente de trabalho para a tarefa &quot;{task.title}&quot; está em manutenção...
        </p>
      </div>
    </div>
  );
}
