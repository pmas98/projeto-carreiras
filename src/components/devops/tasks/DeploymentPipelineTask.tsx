"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, CheckCircle2, XCircle, Play, Loader2, ArrowRight, Settings2 } from "lucide-react";
import { useProgressStore } from "@/store/useProgressStore";
import { useRouter } from "next/navigation";

type PipelineStep = {
  id: string;
  label: string;
  description: string;
  status: 'idle' | 'running' | 'success' | 'error';
};

export function DeploymentPipelineTask() {
  const [steps, setSteps] = useState<PipelineStep[]>([
    { id: 'lint', label: 'Linting', description: 'Verifica padrões de código e erros de sintaxe.', status: 'idle' },
    { id: 'test', label: 'Unit Tests', description: 'Garante que cada parte do código funciona isoladamente.', status: 'idle' },
    { id: 'build', label: 'Build', description: 'Compila o código e prepara os arquivos para produção.', status: 'idle' },
    { id: 'deploy', label: 'Deploy', description: 'Envia os arquivos para o servidor final.', status: 'idle' },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  
  const markTaskComplete = useProgressStore(s => s.markTaskComplete);
  const router = useRouter();

  const runPipeline = async () => {
    setIsRunning(true);
    setCurrentStepIndex(0);
    
    const newSteps: PipelineStep[] = steps.map((s) => ({ ...s, status: "idle" }));
    setSteps(newSteps);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStepIndex(i);
      newSteps[i].status = 'running';
      setSteps([...newSteps]);
      
      // Simulate step duration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      newSteps[i].status = 'success';
      setSteps([...newSteps]);
    }
    
    setIsRunning(false);
  };

  const isComplete = steps.every(s => s.status === 'success');

  const handleFinish = () => {
    markTaskComplete("devops_deployment_pipeline");
    router.push("/devops");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Tarefa 2: Pipeline de Deploy</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Automatize o fluxo de entrega do software.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <Settings2 size={14} className="text-indigo-500" />
          <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-zinc-500">CI_CD_WORKFLOW</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Um pipeline de <code className="text-indigo-600 dark:text-indigo-400">CI/CD</code> é uma série de passos automáticos que garantem que o código seja testado e entregue com segurança. 
            Sem isso, o deploy manual seria lento e cheio de erros humanos.
          </p>
          
          <div className="space-y-3" data-tutorial="devops-pipeline-config">
            {steps.map((step, idx) => (
              <motion.div
                key={step.id}
                initial={false}
                animate={{
                  opacity: isRunning && idx !== currentStepIndex ? 0.5 : 1,
                  scale: idx === currentStepIndex ? 1.02 : 1
                }}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                  step.status === 'success' ? 'border-emerald-500/50 bg-emerald-500/5' : 
                  step.status === 'running' ? 'border-indigo-500 bg-indigo-500/5 shadow-lg shadow-indigo-500/10' :
                  'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950'
                }`}
              >
                <div className="mt-1">
                  {step.status === 'idle' && <div className="w-5 h-5 rounded-full border-2 border-zinc-300 dark:border-zinc-700" />}
                  {step.status === 'running' && <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />}
                  {step.status === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  {step.status === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{step.label}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{step.description}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {!isComplete && (
            <button
              onClick={runPipeline}
              disabled={isRunning}
              data-tutorial="devops-pipeline-run"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-600/30"
            >
              {isRunning ? 'Rodando Pipeline...' : 'Iniciar Pipeline'}
              {!isRunning && <Play size={18} fill="currentColor" />}
            </button>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {isComplete ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border-2 border-emerald-500 bg-emerald-500/10 p-8 text-emerald-600 dark:text-emerald-400 shadow-xl shadow-emerald-500/20 text-center"
              >
                <div className="flex justify-center mb-4">
                  <Rocket size={48} className="animate-bounce" />
                </div>
                <h3 className="text-xl font-bold font-mono mb-2">DEPLOY REALIZADO!</h3>
                <p className="text-sm leading-relaxed mb-6">
                  Seu código passou por todos os testes e foi enviado para o ambiente de produção automaticamente.
                </p>
                <button
                  onClick={handleFinish}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-700"
                >
                  Concluir Tarefa
                  <ArrowRight size={18} />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-8 text-center"
              >
                <Settings2 size={32} className="mx-auto text-zinc-400 mb-4" />
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2">Simulador de CI/CD</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Clique em "Iniciar Pipeline" para ver como o código viaja de forma segura até os usuários finais.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
