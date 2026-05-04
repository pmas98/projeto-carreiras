"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Users, ArrowUpRight, TrendingUp, CheckCircle2, ArrowRight, Layers } from "lucide-react";
import { useProgressStore } from "@/store/useProgressStore";
import { useRouter } from "next/navigation";

export function InfrastructureScalingTask() {
  const [nodes, setNodes] = useState<number>(1);
  const [traffic, setTraffic] = useState<number>(45);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const markTaskComplete = useProgressStore(s => s.markTaskComplete);
  const router = useRouter();

  const handleScale = () => {
    if (nodes < 4) {
      const newNodes = nodes + 1;
      setNodes(newNodes);
      // Simulate more traffic as we scale
      setTraffic(prev => Math.min(100, prev + 15));
      
      if (newNodes === 4) {
        setIsSuccess(true);
      }
    }
  };

  const handleFinish = () => {
    markTaskComplete("devops_infrastructure_scaling");
    router.push("/devops");
  };

  // Calculate load per node
  const loadPerNode = Math.round(traffic / nodes);

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Tarefa 3: Infraestrutura e Escala</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Garanta que o sistema suporte o crescimento do tráfego.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <Layers size={14} className="text-amber-500" />
          <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-zinc-500">INFRA_SCALING</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 shadow-sm" data-tutorial="devops-scaling-monitor">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-zinc-400">Mapa de Infraestrutura</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-blue-500" />
                    <span className="text-xs font-bold">{traffic}k users/s</span>
                  </div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4 h-64 content-center">
                <AnimatePresence>
                  {Array.from({ length: nodes }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="relative flex flex-col items-center justify-center p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 text-emerald-600"
                    >
                      <Server size={32} />
                      <span className="mt-2 text-[10px] font-mono font-bold uppercase tracking-tighter">NODE_0{i+1}</span>
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        <div className={`h-1.5 w-1.5 rounded-full ${loadPerNode > 80 ? 'bg-red-500' : 'bg-emerald-500'}`} />
                        <span className="text-[8px] font-bold">LOAD: {loadPerNode}%</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
             </div>
          </div>

          <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400">
            <p className="text-xs leading-relaxed">
              <strong>Escalabilidade Horizontal:</strong> Em vez de comprar um computador maior (Vertical), adicionamos mais computadores iguais para dividir o trabalho. Isso é o que permite sites como o Netflix aguentarem milhões de pessoas ao mesmo tempo.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6 space-y-6">
             <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Demanda de Tráfego</span>
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{traffic}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "45%" }}
                    animate={{ width: `${traffic}%` }}
                    className={`h-full ${traffic > 80 ? 'bg-amber-500' : 'bg-blue-500'}`} 
                  />
                </div>
             </div>

             <div className="space-y-2">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Controle de Frota</div>
                <button
                  onClick={handleScale}
                  disabled={nodes >= 4 || isSuccess}
                  data-tutorial="devops-scaling-action"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 px-4 py-3 text-sm font-bold text-white dark:text-zinc-900 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  <ArrowUpRight size={18} />
                  Adicionar Servidor
                </button>
             </div>
          </div>

          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border-2 border-emerald-500 bg-emerald-500/10 p-6 text-emerald-600 dark:text-emerald-400 shadow-xl shadow-emerald-500/20"
              >
                <div className="flex items-center gap-2 font-bold font-mono text-sm mb-3">
                  <CheckCircle2 size={18} />
                  SISTEMA ESTÁVEL
                </div>
                <p className="text-[11px] leading-relaxed mb-4">
                  Sua infraestrutura agora está distribuída em 4 nós. Mesmo com o pico de usuários, a carga por servidor está baixa.
                </p>
                <button
                  onClick={handleFinish}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-700"
                >
                  Concluir Carreira
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
