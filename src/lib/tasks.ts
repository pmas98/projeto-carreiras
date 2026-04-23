export type CareerRole = "productOwner" | "devOps" | "frontend" | "backend";

export type TaskId =
  | "po_stakeholder_meeting"
  | "po_defining_product"
  | "po_ticket_creation"
  | "devops_outage"
  | "devops_terminal"
  | "devops_investigation_resolution"
  | "frontend_inspector"
  | "frontend_framer"
  | "frontend_a11y"
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
      id: "frontend_inspector",
      title: "Inspetor de Design",
      subtitle: "Ajuste o layout para alinhar perfeitamente com o mockup.",
    },
    {
      id: "frontend_framer",
      title: "Micro-interações",
      subtitle: "Adicione polimento premium usando Framer Motion.",
    },
    {
      id: "frontend_a11y",
      title: "O Pesadelo do Leitor de Tela",
      subtitle: "Conserte a semântica para tornar a página acessível.",
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

