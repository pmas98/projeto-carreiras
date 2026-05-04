import { RoleTasksPanel } from "@/components/RoleTasksPanel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Engenharia DevOps // Career Architect",
  description: "Resolva incidentes reais e aprenda o dia a dia de DevOps.",
};

export default function DevOpsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <RoleTasksPanel role="devOps" />
    </main>
  );
}

