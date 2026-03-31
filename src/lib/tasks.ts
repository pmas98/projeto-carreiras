export type CareerRole = "productOwner" | "devOps" | "frontend" | "backend";

export type TaskId =
  | "po_stakeholder_meeting"
  | "po_defining_product"
  | "po_ticket_creation"
  | "devops_outage"
  | "devops_terminal"
  | "devops_investigation_resolution"
  | "frontend_broken_ui"
  | "frontend_code_editor"
  | "frontend_fix"
  | "backend_api_client"
  | "backend_auth"
  | "backend_data_fetching";

export type TaskDef = {
  id: TaskId;
  title: string;
  subtitle: string;
};

export const TASKS_BY_ROLE: Record<CareerRole, TaskDef[]> = {
  productOwner: [
    {
      id: "po_stakeholder_meeting",
      title: "A Reunião com Stakeholder",
      subtitle: "Negocie o escopo para um MVP sem irritar o stakeholder.",
    },
    {
      id: "po_defining_product",
      title: "Definindo o Produto",
      subtitle: "Sintetize os requisitos do MVP a partir de personas e notas do modelo de negócio.",
    },
    {
      id: "po_ticket_creation",
      title: "Criação de Tickets",
      subtitle: "Converta requisitos em Histórias de Usuário e Critérios de Aceite.",
    },
  ],
  devOps: [
    {
      id: "devops_outage",
      title: "A Interrupção",
      subtitle: "Receba um alerta simulado no estilo PagerDuty.",
    },
    {
      id: "devops_terminal",
      title: "O Terminal",
      subtitle: "Use uma CLI de navegador com comandos básicos como `ls` e `cat`.",
    },
    {
      id: "devops_investigation_resolution",
      title: "Investigação e Resolução",
      subtitle: "Execute os comandos certos para consertar a máquina.",
    },
  ],
  frontend: [
    {
      id: "frontend_broken_ui",
      title: "A Interface Quebrada",
      subtitle: "Um componente deliberadamente ruim — desalinhado, cores feias, layout confuso.",
    },
    {
      id: "frontend_code_editor",
      title: "O Editor de Código",
      subtitle: "Edite valores brutos de CSS/React/Framer Motion em um editor leve.",
    },
    {
      id: "frontend_fix",
      title: "A Correção",
      subtitle: "Ajuste os valores específicos para corresponder ao mockup do design.",
    },
  ],
  backend: [
    {
      id: "backend_api_client",
      title: "O Cliente de API",
      subtitle: "Interface simulada de Postman/Insomnia para construir requisições.",
    },
    {
      id: "backend_auth",
      title: "Autenticação",
      subtitle: "Crie um payload POST que retorne um mock de JWT.",
    },
    {
      id: "backend_data_fetching",
      title: "Busca de Dados",
      subtitle: "Anexe o JWT e filtre um conjunto de dados local.",
    },
  ],
};

export const ROLE_META: Record<
  CareerRole,
  { label: string; path: string; description: string }
> = {
  productOwner: {
    label: "Product Owner",
    path: "/product-owner",
    description: "Stakeholders, escopo e pensamento ágil.",
  },
  devOps: {
    label: "DevOps",
    path: "/devops",
    description: "Incidentes, logs e recuperação de sistemas.",
  },
  frontend: {
    label: "Desenvolvedor Frontend",
    path: "/frontend",
    description: "UI/UX, controle de CSS e feedback em tempo real.",
  },
  backend: {
    label: "Desenvolvedor Backend",
    path: "/backend",
    description: "APIs, autenticação e fluxos de filtragem de dados.",
  },
};

