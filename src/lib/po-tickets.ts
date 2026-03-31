export type KanbanColumn = "backlog" | "inProgress" | "review" | "done";

export type KanbanCard = {
  id: string;
  title: string;
  userStory: string;
  acceptanceCriteria: string[];
  storyPoints: number;
  column: KanbanColumn;
};

export const INITIAL_TICKETS: KanbanCard[] = [
  {
    id: "t1",
    title: "Feed de Listagem de Vagas",
    userStory:
      "Como um candidato, eu posso navegar por um feed filtrável de vagas para encontrar rapidamente oportunidades relevantes para minhas habilidades e localização.",
    acceptanceCriteria: [
      "Filtrar por título da função, localização (cidade/remoto) e faixa salarial",
      "Cada cartão mostra: empresa, função, localização, faixa salarial e data de publicação",
      "Rolagem infinita ou paginação com pelo menos 20 resultados por página",
    ],
    storyPoints: 5,
    column: "backlog",
  },
  {
    id: "t2",
    title: "Perfil do Candidato",
    userStory:
      "Como um candidato, eu posso criar e editar meu perfil público para que os empregadores e o sistema de IA possam avaliar meu ajuste às vagas.",
    acceptanceCriteria: [
      "Campos do perfil: nome, foto, título, experiência, educação, habilidades, links",
      "Edição inline com salvamento automático e um medidor de completitude do perfil",
      "Perfil acessível via uma URL pública única",
    ],
    storyPoints: 5,
    column: "backlog",
  },
  {
    id: "t3",
    title: "Candidatura em Um Clique",
    userStory:
      "Como um candidato, eu posso me candidatar a uma vaga com um clique usando os dados do meu perfil para que o processo de candidatura seja rápido e sem atritos.",
    acceptanceCriteria: [
      "Pré-preenchimento da candidatura: nome, e-mail, título, URL do perfil",
      "Estado de confirmação mostrado imediatamente após a candidatura",
      "Prevenção de candidaturas duplicadas com estado de erro claro",
    ],
    storyPoints: 3,
    column: "backlog",
  },
  {
    id: "t4",
    title: "Pontuação de Correspondência com IA",
    userStory:
      "Como um candidato, eu posso ver uma pontuação de correspondência gerada por IA para cada vaga baseada no meu perfil para priorizar minhas candidaturas mais fortes.",
    acceptanceCriteria: [
      "Pontuação de correspondência (0–100%) mostrada com destaque em cada cartão de vaga",
      "A pontuação reflete a sobreposição de habilidades entre o perfil e os requisitos do trabalho",
      "Tooltip explica os 3 principais fatores de correspondência e habilidades ausentes",
    ],
    storyPoints: 8,
    column: "backlog",
  },
  {
    id: "t5",
    title: "Painel do Empregador",
    userStory:
      "Como um gerente de contratação, eu posso visualizar e gerenciar os candidatos para minhas vagas para conduzir o processo de contratação de forma eficiente.",
    acceptanceCriteria: [
      "A lista de candidatos mostra: nome, título, pontuação de correspondência, data da candidatura",
      "Filtrar por status: Novo / Revisado / Selecionado / Rejeitado",
      "Atualização de status em massa via caixas de seleção",
    ],
    storyPoints: 5,
    column: "backlog",
  },
  {
    id: "t6",
    title: "Rastreador de Status da Candidatura",
    userStory:
      "Como um candidato, eu posso acompanhar todas as minhas candidaturas e seus status em uma única visualização para me manter informado e fazer o acompanhamento no tempo certo.",
    acceptanceCriteria: [
      "Painel mostra todas as candidaturas: empresa, função, status, data de candidatura",
      "O status é atualizado quando o empregador o altera",
      "Lembrete aparece após 7 dias sem mudança de status",
    ],
    storyPoints: 3,
    column: "backlog",
  },
];
