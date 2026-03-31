import { RoleTasksPanel } from "@/components/RoleTasksPanel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Desenvolvimento Backend",
};

export default function BackendPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <RoleTasksPanel role="backend" />
    </main>
  );
}

