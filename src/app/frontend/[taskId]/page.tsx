import { notFound } from "next/navigation";
import { TASKS_BY_ROLE } from "@/lib/tasks";
import { InspectorTask } from "@/components/frontend/tasks/InspectorTask";

interface PageProps {
  params: Promise<{ taskId: string }>;
}

export default async function FrontendTaskPage({ params }: PageProps) {
  const { taskId } = await params;
  
  const task = TASKS_BY_ROLE.frontend.find((t) => t.id === taskId);

  if (!task) {
    notFound();
  }

  if (taskId === "frontend_inspector") {
    return <InspectorTask />;
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 dark:bg-black p-8">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{task.title}</h1>
      <p className="text-zinc-600 dark:text-zinc-400 mt-2">{task.subtitle}</p>
      
      <div className="mt-8 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm max-w-2xl w-full">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
          O ambiente de trabalho para a tarefa "{task.title}" será implementado nos próximos passos...
        </p>
      </div>
    </div>
  );
}
