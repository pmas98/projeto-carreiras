export type PORequirement = {
  id: string;
  text: string;
  source: string;
};

export type PersonaId = "alex" | "maria" | "jordan";
export type BusinessModelId = "freemium" | "b2b" | "commission";

export type Persona = {
  id: PersonaId;
  name: string;
  role: string;
  age: number;
  emoji: string;
  tagline: string;
  gradient: string;
  noteColor: string;
  notes: string[];
};

export type BusinessModel = {
  id: BusinessModelId;
  name: string;
  emoji: string;
  tagline: string;
  gradient: string;
  noteColor: string;
  notes: string[];
};

export const PERSONAS: Persona[] = [
  {
    id: "alex",
    name: "Alex",
    role: "Recém-graduado",
    age: 24,
    emoji: "🎓",
    tagline: "Acabou de se formar, tentando entrar na área de tecnologia",
    gradient: "from-sky-500 to-cyan-400",
    noteColor: "bg-sky-100 border-sky-300 text-sky-900",
    notes: [
      "Precisa de um fluxo de candidatura simples e focado em dispositivos móveis",
      "Quer exibir portfólio e projetos do GitHub",
      "Fica sobrecarregado com muitas opções",
      "Sensível ao preço — plano gratuito é essencial",
    ],
  },
  {
    id: "maria",
    name: "Maria",
    role: "Transição de Carreira",
    age: 35,
    emoji: "🔄",
    tagline: "Migrando de finanças para gestão de produtos",
    gradient: "from-purple-500 to-pink-400",
    noteColor: "bg-pink-100 border-pink-300 text-pink-900",
    notes: [
      "Precisa de análise de lacunas de habilidades em relação aos requisitos da vaga",
      "Valoriza mentoria e recursos de coaching de carreira",
      "Quer acompanhar todas as candidaturas em um só lugar",
      "Pagaria por funcionalidades avançadas de coaching de carreira",
    ],
  },
  {
    id: "jordan",
    name: "Jordan",
    role: "Gerente de Contratação",
    age: 42,
    emoji: "💼",
    tagline: "Analisando mais de 200 candidaturas por semana",
    gradient: "from-amber-500 to-orange-400",
    noteColor: "bg-amber-100 border-amber-300 text-amber-900",
    notes: [
      "Precisa de painéis de candidatos rápidos e filtráveis",
      "Quer pontuação de ajuste à equipe e dados de afinidade cultural",
      "Deve integrar-se com ATS existentes (Greenhouse, Lever)",
      "Tem orçamento para preços baseados em assentos B2B",
    ],
  },
];

export const BUSINESS_MODELS: BusinessModel[] = [
  {
    id: "freemium",
    name: "Freemium",
    emoji: "🆓",
    tagline: "Grátis para candidatos, pago para usuários avançados",
    gradient: "from-green-500 to-emerald-400",
    noteColor: "bg-green-100 border-green-300 text-green-900",
    notes: [
      "Nível gratuito deve entregar valor real antes do paywall",
      "Premium desbloqueia: insights de IA, análises, coaching",
      "Funil de conversão é crítico para o design desde o primeiro dia",
    ],
  },
  {
    id: "b2b",
    name: "B2B SaaS",
    emoji: "🏢",
    tagline: "Cobrança por assento de recrutador para empresas",
    gradient: "from-blue-500 to-indigo-400",
    noteColor: "bg-indigo-100 border-indigo-300 text-indigo-900",
    notes: [
      "Portal administrativo da empresa e gestão de equipe necessários",
      "Contratos corporativos precisam de residência de dados / SOC2",
      "Faturamento multi-assento exige forte gestão de contas",
    ],
  },
  {
    id: "commission",
    name: "Comissão",
    emoji: "💰",
    tagline: "% de taxa sobre contratação bem-sucedida paga pelo empregador",
    gradient: "from-yellow-500 to-amber-400",
    noteColor: "bg-yellow-100 border-yellow-300 text-yellow-900",
    notes: [
      "Acompanhamento de contratação e verificação do empregador são fundamentais",
      "Exige fluxo de pagamento integrado desde o lançamento",
      "Relatórios de taxa de sucesso constroem confiança do empregador",
    ],
  },
];

export const MVP_REQUIREMENTS: PORequirement[] = [
  {
    id: "r1",
    text: "Feed de vagas com busca e filtros por função, localização e faixa salarial",
    source: "Alex + Jordan",
  },
  {
    id: "r2",
    text: "Candidatura em um clique usando um perfil de candidato pré-preenchido",
    source: "Alex + Maria",
  },
  {
    id: "r3",
    text: "Perfil do candidato com habilidades, experiência, educação e links de portfólio",
    source: "Todas as personas",
  },
  {
    id: "r4",
    text: "Pontuação de correspondência de IA por vaga baseada em sobreposição de habilidades (diferencial principal)",
    source: "Maria + Jordan",
  },
  {
    id: "r5",
    text: "Painel do empregador com filtragem e gestão de status dos candidatos",
    source: "Jordan + B2B",
  },
  {
    id: "r6",
    text: "Rastreador de status da candidatura para que os candidatos possam acompanhar no tempo certo",
    source: "Maria + Alex",
  },
];
