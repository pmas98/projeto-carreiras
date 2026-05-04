import type { TaskId } from "@/lib/tasks";
import type { TutorialModuleDefinition } from "./types";

type TutorialDefinitionsMap = {
  [K in TaskId]: TutorialModuleDefinition & { moduleId: K };
};

// Contracto dos seletores: cada targetSelector usa tokens data-tutorial
// que serao adicionados/garantidos nas tarefas de integracao.
export const TUTORIAL_DEFINITIONS = {
  po_stakeholder_meeting: {
    moduleId: "po_stakeholder_meeting",
    title: "Tutorial: Reunião com Stakeholder",
    objective: "Conduza a conversa para um MVP viável sem perder o alinhamento com o cliente.",
    steps: [
      {
        id: "read-context",
        title: "Entenda o contexto da reunião",
        description: "Leia os objetivos e restrições antes de responder ao stakeholder.",
        targetSelector: "[data-tutorial='po-meeting-context']",
        action: { type: "observe", label: "Revise o briefing" },
      },
      {
        id: "pick-response",
        title: "Escolha uma resposta estratégica",
        description: "Selecione uma opção que preserve valor e reduza risco de escopo.",
        targetSelector: "[data-tutorial='po-meeting-options']",
        action: { type: "click", label: "Responder com foco em MVP" },
        tip: "Prefira respostas que negociem prioridade em vez de aceitar tudo.",
      },
    ],
  },
  po_defining_product: {
    moduleId: "po_defining_product",
    title: "Tutorial: Definindo o Produto",
    objective: "Transforme insumos de negócio em requisitos claros para o time técnico.",
    steps: [
      {
        id: "review-personas",
        title: "Revise personas e modelo",
        description: "Identifique necessidades reais de usuário e impacto no negócio.",
        targetSelector: "[data-tutorial='po-personas-panel']",
        action: { type: "observe", label: "Ler personas" },
      },
      {
        id: "prioritize-requirements",
        title: "Priorize os requisitos",
        description: "Marque o que entra no MVP e o que fica para fase posterior.",
        targetSelector: "[data-tutorial='po-requirements-list']",
        action: { type: "change", label: "Definir prioridade" },
      },
    ],
  },
  po_ticket_creation: {
    moduleId: "po_ticket_creation",
    title: "Tutorial: Criação de Tickets",
    objective: "Converter requisitos em histórias acionáveis com critérios de aceite objetivos.",
    steps: [
      {
        id: "open-ticket-form",
        title: "Abra o formulário do ticket",
        description: "Inicie uma nova história para o backlog do sprint.",
        targetSelector: "[data-tutorial='po-ticket-new']",
        action: { type: "click", label: "Criar ticket" },
      },
      {
        id: "fill-story",
        title: "Escreva a história e critérios",
        description: "Preencha narrativa de usuário e condições de aceite testáveis.",
        targetSelector: "[data-tutorial='po-ticket-editor']",
        action: { type: "input", label: "Completar conteúdo" },
      },
    ],
  },
  devops_incident_response: {
    moduleId: "devops_incident_response",
    title: "Tutorial: Gestão de Incidentes",
    objective: "Triar, diagnosticar e resolver uma queda de serviço em produção.",
    steps: [
      {
        id: "monitor-health",
        title: "Monitore a saúde",
        description: "Observe a telemetria para detectar anomalias no sistema.",
        targetSelector: "[data-tutorial='devops-incident-monitor']",
        action: { type: "observe", label: "Analisar telemetria" },
      },
      {
        id: "resolve-incident",
        title: "Resolva o problema",
        description: "Use o terminal para identificar a causa e aplicar a correção.",
        targetSelector: "[data-tutorial='devops-incident-resolve']",
        action: { type: "command", label: "Executar correção" },
      },
    ],
  },
  devops_deployment_pipeline: {
    moduleId: "devops_deployment_pipeline",
    title: "Tutorial: Pipeline de Deploy",
    objective: "Automatizar o fluxo de entrega de código com segurança.",
    steps: [
      {
        id: "configure-steps",
        title: "Configure os passos",
        description: "Garanta que o código passe por testes antes do deploy.",
        targetSelector: "[data-tutorial='devops-pipeline-config']",
        action: { type: "observe", label: "Revisar pipeline" },
      },
      {
        id: "trigger-deploy",
        title: "Dispare o deploy",
        description: "Inicie o processo de entrega para produção.",
        targetSelector: "[data-tutorial='devops-pipeline-run']",
        action: { type: "click", label: "Rodar pipeline" },
      },
    ],
  },
  devops_infrastructure_scaling: {
    moduleId: "devops_infrastructure_scaling",
    title: "Tutorial: Infraestrutura e Escala",
    objective: "Provisionar recursos para suportar picos de tráfego.",
    steps: [
      {
        id: "monitor-load",
        title: "Monitore a carga",
        description: "Verifique se os servidores atuais suportam a demanda.",
        targetSelector: "[data-tutorial='devops-scaling-monitor']",
        action: { type: "observe", label: "Checar carga" },
      },
      {
        id: "add-nodes",
        title: "Adicione nós",
        description: "Escale horizontalmente para distribuir o tráfego.",
        targetSelector: "[data-tutorial='devops-scaling-action']",
        action: { type: "click", label: "Escalar sistema" },
      },
    ],
  },
  frontend_inspector: {
    moduleId: "frontend_inspector",
    title: "Tutorial: Inspetor de Design",
    objective: "Ajustar propriedades visuais para aproximar componente e mockup.",
    steps: [
      {
        id: "adjust-controls",
        title: "Ajuste os controles CSS",
        description: "Use sliders para calibrar espaçamento, raio e tipografia.",
        targetSelector: "[data-tutorial='frontend-inspector-controls']",
        action: { type: "change", label: "Ajustar propriedades" },
      },
      {
        id: "compare-mockup",
        title: "Compare com o mockup",
        description: "Ative a sobreposição para validar alinhamento visual final.",
        targetSelector: "[data-tutorial='frontend-inspector-mockup-toggle']",
        action: { type: "click", label: "Mostrar mockup" },
      },
    ],
  },
  frontend_framer: {
    moduleId: "frontend_framer",
    title: "Tutorial: Micro-interações",
    objective: "Introduzir animações que deixem a experiência mais fluida e responsiva.",
    steps: [
      {
        id: "edit-motion-code",
        title: "Edite o código de animação",
        description: "Adicione propriedades de hover, spring e stagger no editor.",
        targetSelector: "[data-tutorial='frontend-framer-editor']",
        action: { type: "input", label: "Escrever código Framer" },
      },
      {
        id: "validate-preview",
        title: "Valide o preview animado",
        description: "Observe o formulário para confirmar fluidez e feedback visual.",
        targetSelector: "[data-tutorial='frontend-framer-preview']",
        action: { type: "observe", label: "Revisar resultado" },
      },
    ],
  },
  frontend_a11y: {
    moduleId: "frontend_a11y",
    title: "Tutorial: Acessibilidade",
    objective: "Corrigir semântica e contraste para melhorar navegação assistiva.",
    steps: [
      {
        id: "fix-semantic",
        title: "Corrija a semântica",
        description: "Troque elementos genéricos por tags adequadas para interação.",
        targetSelector: "[data-tutorial='frontend-a11y-editor']",
        action: { type: "input", label: "Ajustar HTML" },
      },
      {
        id: "check-reader-output",
        title: "Confira a visão do leitor de tela",
        description: "Valide se o robô reconhece botão nomeado e texto legível.",
        targetSelector: "[data-tutorial='frontend-a11y-tree']",
        action: { type: "observe", label: "Validar leitura" },
      },
    ],
  },
  backend_api_client: {
    moduleId: "backend_api_client",
    title: "Tutorial: Cliente de API",
    objective: "Montar uma requisição HTTP consistente com método, rota e payload.",
    steps: [
      {
        id: "configure-request",
        title: "Configure a requisição",
        description: "Defina método, endpoint e headers obrigatórios.",
        targetSelector: "[data-tutorial='backend-api-request-builder']",
        action: { type: "change", label: "Configurar requisição" },
      },
      {
        id: "send-request",
        title: "Dispare a chamada",
        description: "Envie a requisição e observe o retorno da API simulada.",
        targetSelector: "[data-tutorial='backend-api-send']",
        action: { type: "submit", label: "Enviar request" },
      },
    ],
  },
  backend_auth: {
    moduleId: "backend_auth",
    title: "Tutorial: Autenticação",
    objective: "Construir payload de login válido para obter token JWT simulado.",
    steps: [
      {
        id: "fill-credentials",
        title: "Preencha o payload de autenticação",
        description: "Informe credenciais no formato JSON esperado pelo endpoint.",
        targetSelector: "[data-tutorial='backend-auth-payload']",
        action: { type: "input", label: "Inserir credenciais" },
      },
      {
        id: "capture-token",
        title: "Capture o token retornado",
        description: "Confirme o JWT antes de avançar para as chamadas protegidas.",
        targetSelector: "[data-tutorial='backend-auth-token']",
        action: { type: "observe", label: "Copiar token" },
      },
    ],
  },
  backend_data_fetching: {
    moduleId: "backend_data_fetching",
    title: "Tutorial: Busca de Dados",
    objective: "Consumir endpoint protegido e aplicar filtros no dataset de resposta.",
    steps: [
      {
        id: "attach-jwt",
        title: "Anexe o JWT",
        description: "Inclua o token no header de autorização da requisição GET.",
        targetSelector: "[data-tutorial='backend-fetch-auth-header']",
        action: { type: "input", label: "Adicionar bearer token" },
      },
      {
        id: "apply-filters",
        title: "Aplique filtros de consulta",
        description: "Refine os resultados para retornar apenas os dados relevantes.",
        targetSelector: "[data-tutorial='backend-fetch-filters']",
        action: { type: "change", label: "Filtrar dados" },
      },
    ],
  },
} satisfies TutorialDefinitionsMap;

function isTaskId(value: string): value is TaskId {
  return Object.hasOwn(TUTORIAL_DEFINITIONS, value);
}

export function getTutorialDefinition(moduleId: string): TutorialModuleDefinition | null {
  if (!moduleId) return null;
  const normalizedModuleId = moduleId.trim();
  if (!isTaskId(normalizedModuleId)) return null;
  return TUTORIAL_DEFINITIONS[normalizedModuleId];
}
