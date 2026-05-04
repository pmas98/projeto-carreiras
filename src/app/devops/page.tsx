import { DevOpsStory } from "@/components/devops/DevOpsStory";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Engenharia DevOps // Career Architect",
  description: "Resolva incidentes reais e aprenda o dia a dia de DevOps.",
};

export default function DevOpsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        {/* Navigation Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 font-mono text-[10px] text-zinc-500">
          <Link href="/" className="flex items-center gap-1 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">
            <ChevronLeft size={10} />
            DASHBOARD
          </Link>
          <span className="opacity-30">/</span>
          <span className="text-zinc-900 dark:text-zinc-100 font-bold">DEVOPS_MODULE</span>
          <span className="ml-auto flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            STATION_CONNECTED
          </span>
        </nav>

        {/* Header Section */}
        <header className="mb-12 border-b border-zinc-100 pb-8 dark:border-zinc-800/50">
          <div className="flex items-center gap-3 font-mono text-[10px] text-zinc-400">
            <span className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800">CLASS: ENGENHARIA</span>
            <span className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800">SECTOR: INFRASTRUCTURE</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Simulação de Incidente
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            Bem-vindo à linha de frente. Como engenheiro DevOps, seu trabalho é garantir que a plataforma nunca pare. 
            Algo está errado no <code className="text-emerald-600 dark:text-emerald-400">NODE_04</code>. Investigue e resolva.
          </p>
        </header>

        {/* The Core Experience */}
        <DevOpsStory />
      </main>
    </div>
  );
}

