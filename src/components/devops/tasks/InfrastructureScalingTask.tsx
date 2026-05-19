"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server,
  Users,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Layers,
  Cpu,
  Coins,
  AlertTriangle,
  AlertCircle,
  Plus,
  Minus,
  Zap,
  Sparkles
} from "lucide-react";
import { useProgressStore } from "@/store/useProgressStore";
import { useRouter } from "next/navigation";
import type { TaskId } from "@/lib/tasks";

interface MachineType {
  id: string;
  name: string;
  capacity: number; // in k users/s
  cost: number;     // in $/month
  description: string;
}

const MACHINE_TYPES: MachineType[] = [
  { id: "micro", name: "t3.micro", capacity: 20, cost: 10, description: "Instância de entrada. Econômica, mas de baixo desempenho." },
  { id: "medium", name: "t3.medium", capacity: 50, cost: 18, description: "Excelente equilíbrio de CPU/RAM para cargas médias." },
  { id: "large", name: "t3.large", capacity: 100, cost: 40, description: "Alta performance. Projetada para cargas estáveis e pesadas." },
  { id: "xlarge", name: "t3.xlarge", capacity: 200, cost: 85, description: "Poder massivo. Capacidade de processamento extrema." }
];

const DEMAND = 100; // 100k users/s
const BUDGET_LIMIT = 55; // $55/month budget limit

export function InfrastructureScalingTask() {
  const [nodes, setNodes] = useState<number>(1);
  const [machineIndex, setMachineIndex] = useState<number>(0);
  
  const markTaskComplete = useProgressStore(s => s.markTaskComplete);
  const router = useRouter();
  const completedTasks = useProgressStore((s) => s.completedTasks);

  const currentMachine = MACHINE_TYPES[machineIndex];
  const totalCapacity = nodes * currentMachine.capacity;
  
  // Calculate average load per node
  const loadPerNode = Math.round((DEMAND / totalCapacity) * 100);
  const totalCost = nodes * currentMachine.cost;

  // System is stable if each node has load <= 80%
  const isHealthy = loadPerNode <= 80;
  // Custo é ótimo se está sob o orçamento ideal de $55 (ótimo real = $54 com 3x t3.medium)
  const isCostOptimal = totalCost <= BUDGET_LIMIT;
  
  const isSuccess = isHealthy && isCostOptimal;

  const allDevOpsTasksDone = useMemo(() => {
    const devOpsTaskIds: TaskId[] = ["devops_incident_response", "devops_deployment_pipeline", "devops_infrastructure_scaling"];
    return devOpsTaskIds.every(id => id === "devops_infrastructure_scaling" ? isSuccess : completedTasks.includes(id));
  }, [completedTasks, isSuccess]);

  const handleFinish = () => {
    markTaskComplete("devops_infrastructure_scaling");
    router.push("/devops");
  };

  const handleScaleHorizontal = (amount: number) => {
    setNodes(prev => {
      const next = prev + amount;
      return Math.min(8, Math.max(1, next));
    });
  };

  const handleScaleVertical = (direction: "up" | "down") => {
    setMachineIndex(prev => {
      if (direction === "up") {
        return Math.min(MACHINE_TYPES.length - 1, prev + 1);
      } else {
        return Math.max(0, prev - 1);
      }
    });
  };

  // Determine status styles and texts
  let statusText = "SOBRECARREGADO (Sistema Instável)";
  let statusColorClass = "text-red-500 border-red-500/20 bg-red-500/5";
  let statusIcon = <AlertCircle className="text-red-500 animate-pulse" size={18} />;

  if (isHealthy) {
    if (isCostOptimal) {
      statusText = "SISTEMA ESTÁVEL E CUSTO OTIMIZADO";
      statusColorClass = "text-emerald-500 border-emerald-500/20 bg-emerald-500/5";
      statusIcon = <CheckCircle2 className="text-emerald-500" size={18} />;
    } else {
      statusText = "SISTEMA ESTÁVEL (Custo Ineficiente)";
      statusColorClass = "text-amber-500 border-amber-500/20 bg-amber-500/5";
      statusIcon = <AlertTriangle className="text-amber-500" size={18} />;
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Tarefa 3: Infraestrutura e Escala</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Garanta que o sistema suporte o crescimento do tráfego equilibrando performance e custos.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <Layers size={14} className="text-amber-500" />
          <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-zinc-500">INFRA_SCALING</span>
        </div>
      </div>

      {/* Briefing / Desafio */}
      <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="text-red-500 animate-bounce" size={24} />
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Alerta de Infraestrutura: Servidores caindo!</h2>
        </div>
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          O tráfego aumentou repentinamente para <strong className="text-zinc-900 dark:text-white">{DEMAND}k usuários/s</strong>! 
          Nossos servidores atuais estão operando no vermelho (<strong className="text-red-500">{loadPerNode}% de carga</strong>). 
          Precisamos que você dimensione a infraestrutura para manter a carga média por servidor em um nível seguro (<strong className="text-emerald-500 font-bold">≤ 80%</strong>), 
          mas mantendo o orçamento mensal sob controle (<strong className="text-indigo-500 font-bold">≤ ${BUDGET_LIMIT}/mês</strong>).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Painel de Controle */}
        <div className="space-y-6">
          {/* Status Geral */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-zinc-400">Status Geral do Cluster</h3>
            
            <div className={`flex items-center gap-2 p-3 rounded-xl border ${statusColorClass} text-xs font-bold font-mono uppercase`}>
              {statusIcon}
              <span>{statusText}</span>
            </div>

            <div className="space-y-3">
              {/* Demanda vs Capacidade */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-500 dark:text-zinc-400">Capacidade Total</span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-zinc-50">{totalCapacity}k / {DEMAND}k requisições/s</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${totalCapacity >= DEMAND ? 'bg-emerald-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(100, (totalCapacity / DEMAND) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Orçamento */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-500 dark:text-zinc-400">Custo Mensal</span>
                  <span className={`font-mono font-bold ${isCostOptimal ? 'text-emerald-500' : 'text-red-500 animate-pulse'}`}>
                    ${totalCost} / ${BUDGET_LIMIT}
                  </span>
                </div>
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${isCostOptimal ? 'bg-emerald-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(100, (totalCost / BUDGET_LIMIT) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Controles de Escalonamento */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6 space-y-6">
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-zinc-400">Controles de Dimensionamento</h3>

            {/* Escalonamento Horizontal */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Escalar Horizontalmente</span>
                <span className="text-xs font-mono font-bold bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-800 dark:text-zinc-200">
                  {nodes} {nodes === 1 ? "Máquina" : "Máquinas"}
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-tight">Adiciona ou remove servidores idênticos para dividir a carga de tráfego.</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleScaleHorizontal(-1)}
                  disabled={nodes <= 1}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all disabled:opacity-30"
                >
                  <Minus size={14} />
                  Reduzir Frota
                </button>
                <button
                  onClick={() => handleScaleHorizontal(1)}
                  disabled={nodes >= 8}
                  data-tutorial="devops-scaling-action"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all disabled:opacity-30"
                >
                  <Plus size={14} />
                  Adicionar Servidor
                </button>
              </div>
            </div>

            {/* Escalonamento Vertical */}
            <div className="space-y-2 border-t border-zinc-200 dark:border-zinc-800 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Escalar Verticalmente</span>
                <span className="text-xs font-mono font-bold bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 rounded text-indigo-600 dark:text-indigo-400">
                  {currentMachine.name}
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-tight">Melhora ou piora a capacidade individual de processamento de cada máquina.</p>
              
              <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl space-y-1">
                <span className="text-[10px] font-bold font-mono text-zinc-400 uppercase">ESPECIFICAÇÕES DE CADA MÁQUINA:</span>
                <div className="grid grid-cols-2 text-[11px] font-mono">
                  <div className="text-zinc-600 dark:text-zinc-400">Capacidade:</div>
                  <div className="text-right font-bold text-zinc-900 dark:text-white">{currentMachine.capacity}k req/s</div>
                  <div className="text-zinc-600 dark:text-zinc-400">Custo Unitário:</div>
                  <div className="text-right font-bold text-zinc-900 dark:text-white">${currentMachine.cost}/mês</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleScaleVertical("down")}
                  disabled={machineIndex <= 0}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all disabled:opacity-30"
                >
                  <Minus size={14} />
                  Reduzir Máquina
                </button>
                <button
                  onClick={() => handleScaleVertical("up")}
                  disabled={machineIndex >= MACHINE_TYPES.length - 1}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all disabled:opacity-30"
                >
                  <Plus size={14} />
                  Melhorar Máquina
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa da Infraestrutura */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm flex flex-col h-full min-h-[420px]" data-tutorial="devops-scaling-monitor">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-zinc-400">Servidores do Cluster</h3>
              <div className="flex items-center gap-2">
                <Users size={14} className="text-indigo-500" />
                <span className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400">{DEMAND}k requisições/s de tráfego total</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1 content-center">
              <AnimatePresence>
                {Array.from({ length: nodes }).map((_, i) => {
                  let loadBg = "bg-blue-500/5 border-blue-500/30 text-blue-500";
                  let progressBg = "bg-blue-500";
                  
                  if (loadPerNode > 100) {
                    loadBg = "bg-red-500/10 border-red-500/40 text-red-500 shadow-lg shadow-red-500/10 animate-pulse";
                    progressBg = "bg-red-500";
                  } else if (loadPerNode > 80) {
                    loadBg = "bg-amber-500/10 border-amber-500/40 text-amber-500 shadow-md shadow-amber-500/5";
                    progressBg = "bg-amber-500";
                  } else if (loadPerNode >= 50) {
                    loadBg = "bg-emerald-500/10 border-emerald-500/40 text-emerald-500 shadow-md shadow-emerald-500/5";
                    progressBg = "bg-emerald-500";
                  } else {
                    loadBg = "bg-indigo-500/5 border-indigo-500/20 text-indigo-500";
                    progressBg = "bg-indigo-500";
                  }

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -10 }}
                      className={`relative flex flex-col p-4 rounded-xl border ${loadBg} transition-colors duration-300`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Server size={22} className="opacity-80" />
                        <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10">
                          {currentMachine.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-70">
                        NODE_0{i+1}
                      </span>
                      
                      <div className="mt-4 space-y-1">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span>Carga:</span>
                          <span className="font-bold">{loadPerNode}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${progressBg} transition-all duration-500`}
                            style={{ width: `${Math.min(100, loadPerNode)}%` }}
                          />
                        </div>
                        {loadPerNode > 80 && (
                          <div className="flex items-center gap-1 text-[8px] mt-1 font-bold animate-pulse text-red-500 dark:text-red-400">
                            <AlertCircle size={10} />
                            <span>SOBRECARGA!</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Explicação da Estratégia de Escalonamento */}
            <div className="mt-6 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
              <div className="flex items-start gap-3">
                <Zap className="text-indigo-500 shrink-0 mt-0.5" size={16} />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50">Estratégia Cloud: Horizontal vs. Vertical</h4>
                  <p className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                    <strong>Escalabilidade Vertical (Scale Up)</strong> aumenta a potência de uma máquina existente. É fácil de fazer, mas tem limites físicos e custos exponenciais. 
                    <strong> Escalabilidade Horizontal (Scale Out)</strong> adiciona novas máquinas ao pool. Permite redundância e alta disponibilidade, dividindo o tráfego uniformemente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success or Optimization Message Cards */}
      <AnimatePresence>
        {isHealthy && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border-2 p-6 shadow-xl space-y-4 ${
              isSuccess 
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-emerald-500/10" 
                : "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-amber-500/10"
            }`}
          >
            <div className="flex items-center gap-2 font-bold font-mono text-sm">
              {isSuccess ? (
                <>
                  <Sparkles size={18} className="animate-bounce" />
                  SISTEMA ESTÁVEL E OTIMIZADO!
                </>
              ) : (
                <>
                  <AlertTriangle size={18} />
                  SISTEMA ESTÁVEL, MAS O CUSTO ESTÁ ALTO!
                </>
              )}
            </div>

            <p className="text-xs leading-relaxed">
              {isSuccess ? (
                <span>
                  Excelente! Você encontrou a configuração ideal com <strong className="font-bold">{nodes}x instâncias {currentMachine.name}</strong>. 
                  Com um custo mensal de <strong className="font-bold">${totalCost}/mês</strong> (dentro do limite ideal de ${BUDGET_LIMIT}) 
                  e cada servidor operando em uma carga saudável de <strong className="font-bold">{loadPerNode}%</strong> (menor que o limite de 80%). 
                  Esta é a arquitetura em nuvem mais eficiente para lidar com {DEMAND}k requisições/s!
                </span>
              ) : (
                <span>
                  O cluster de servidores está operando em uma carga segura de <strong className="font-bold">{loadPerNode}%</strong>. 
                  Contudo, o custo mensal total é de <strong className="font-bold">${totalCost}/mês</strong>, ultrapassando nosso limite ideal de <strong className="font-bold">${BUDGET_LIMIT}/mês</strong>. 
                  Tente ajustar a infraestrutura reduzindo o número de máquinas ou alterando o tipo de instância para encontrar uma combinação mais barata!
                </span>
              )}
            </p>

            {isSuccess && (
              <button
                onClick={handleFinish}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-emerald-700 active:scale-[0.98]"
              >
                {allDevOpsTasksDone ? "Concluir Carreira" : "Concluir Tarefa"}
                <ArrowRight size={16} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabela de Preço e Capacidade (Dica pedagógica) */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-zinc-400">Guia de Custos de Infraestrutura</h3>
        <p className="text-xs text-zinc-500 leading-relaxed">
          Para alcançar o melhor custo-benefício mantendo a carga de todos os servidores abaixo de 80%, você deve encontrar uma combinação cujos servidores somem capacidade suficiente para {DEMAND}k req/s, sem provisionar capacidade excessiva.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {MACHINE_TYPES.map((m) => (
            <div key={m.id} className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/30 text-center space-y-1">
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">{m.name}</span>
              <span className="text-[10px] text-zinc-400 block">${m.cost}/mês unitário</span>
              <span className="text-[10px] font-mono text-indigo-500 font-bold block">{m.capacity}k cap. unitária</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
