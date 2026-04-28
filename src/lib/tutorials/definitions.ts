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
  devops_outage: {
    moduleId: "devops_outage",
    title: "Tutorial: Alerta de Interrupção",
    objective: "Triar o incidente com rapidez para reduzir impacto em produção.",
    steps: [
      {
        id: "read-alert",
        title: "Leia o alerta com atenção",
        description: "Confira serviço afetado, severidade e janela do incidente.",
        targetSelector: "[data-tutorial='devops-alert-card']",
        action: { type: "observe", label: "Analisar alerta" },
      },
      {
        id: "acknowledge",
        title: "Assuma o incidente",
        description: "Confirme o recebimento para iniciar investigação estruturada.",
        targetSelector: "[data-tutorial='devops-ack-button']",
        action: { type: "click", label: "Assumir incidente" },
      },
    ],
  },
  devops_terminal: {
    moduleId: "devops_terminal",
    title: "Tutorial: Terminal de Diagnóstico",
    objective: "Executar comandos básicos para localizar sinais de falha.",
    steps: [
      {
        id: "focus-terminal",
        title: "Foque no terminal",
        description: "Ative a área de comando para iniciar a coleta de evidências.",
        targetSelector: "[data-tutorial='devops-terminal-input']",
        action: { type: "click", label: "Ativar terminal" },
      },
      {
        id: "run-first-command",
        title: "Execute o primeiro comando",
        description: "Rode um comando de inspeção para listar artefatos relevantes.",
        targetSelector: "[data-tutorial='devops-terminal-run']",
        action: { type: "command", label: "Executar comando" },
        tip: "Comece por comandos de leitura antes de qualquer ação destrutiva.",
      },
    ],
  },
  devops_investigation_resolution: {
    moduleId: "devops_investigation_resolution",
    title: "Tutorial: Investigação e Resolução",
    objective: "Diagnosticar causa raiz e aplicar correção com segurança operacional.",
    steps: [
      {
        id: "inspect-logs",
        title: "Inspecione os logs",
        description: "Colete evidências para confirmar onde a falha começou.",
        targetSelector: "[data-tutorial='devops-logs-panel']",
        action: { type: "observe", label: "Ler logs" },
      },
      {
        id: "apply-fix",
        title: "Aplique a correção",
        description: "Execute a ação de recuperação e valide retorno da aplicação.",
        targetSelector: "[data-tutorial='devops-resolution-actions']",
        action: { type: "command", label: "Executar correção" },
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
