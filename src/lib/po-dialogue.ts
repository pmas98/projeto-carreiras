export type Speaker = "stakeholder" | "player" | "system";
export type EndType = "great" | "good" | "medium" | "bad";
export type ChoiceLabel = "good" | "risky" | "neutral";

export type DialogueChoice = {
  id: string;
  text: string;
  nextId: string;
  moodDelta: number;
  label: ChoiceLabel;
};

export type DialogueNode = {
  id: string;
  speaker: Speaker;
  speakerName?: string;
  text: string;
  choices?: DialogueChoice[];
  nextId?: string;
  isEnd?: boolean;
  endType?: EndType;
  tipText?: string;
  endSummary?: {
    scope: string[];
    outcome: string;
    sprintResult: string;
    reflection: string;
  };
};

export const INITIAL_MOOD = 70;

export const DIALOGUE_TREE: Record<string, DialogueNode> = {
  start: {
    id: "start",
    speaker: "system",
    text: "Você entra na Sala de Reunião B. Marcus Chen, CEO, está no quadro branco, pincel na mão, visivelmente cheio de energia. Ele preencheu cada centímetro do quadro com post-its, setas e nomes de funcionalidades. Ele se vira e sorri enquanto você se senta.",
    nextId: "marcus_vision",
  },

  marcus_vision: {
    id: "marcus_vision",
    speaker: "stakeholder",
    speakerName: "Marcus Chen, CEO",
    text: "OK — aqui está a visão geral para o Carreiras. Estamos construindo um ecossistema completo: correspondência de empregos via IA, um feed social profissional estilo LinkedIn, salas de entrevista em vídeo ao vivo, um construtor de currículos com IA, assistente de negociação salarial, redes de indicação de pares e um centro de aprendizado de habilidades. Tudo pronto para o lançamento no Q1. Isso vai destruir o LinkedIn.",
    choices: [
      {
        id: "agree_all",
        text: "Visão incrível, Marcus! Vamos nos comprometer a construir tudo para o lançamento no Q1.",
        nextId: "marcus_agree_all",
        moodDelta: 15,
        label: "risky",
      },
      {
        id: "smart_scope",
        text: "Adorei a energia! Vamos alinhar os objetivos principais do usuário e definir um MVP enxuto que prove o conceito.",
        nextId: "marcus_smart_scope",
        moodDelta: 5,
        label: "good",
      },
      {
        id: "harsh_cut",
        text: "Marcus — para ser sincero, conseguiremos entregar realisticamente 2 funcionalidades no Q1. Todo o resto fica para a Fase 2.",
        nextId: "marcus_harsh",
        moodDelta: -25,
        label: "neutral",
      },
    ],
  },

  marcus_agree_all: {
    id: "marcus_agree_all",
    speaker: "stakeholder",
    speakerName: "Marcus Chen, CEO",
    text: "ISSO! Essa é a atitude que eu preciso de um PO. E sabe de uma coisa — eu andei pensando — devemos adicionar também gamificação. Medalhas, placares, um sistema de ofensiva para candidaturas diárias. Vai para a lista do Q1!",
    tipText: "⚠️ Concordar com tudo sem avaliar a viabilidade é o clássico 'scope creep'. Um bom PO canaliza a empolgação do stakeholder para o valor mensurável do usuário — e não para o volume de funcionalidades.",
    choices: [
      {
        id: "add_gamification",
        text: "Gamificação é uma ótima mecânica de engajamento — vamos incluir!",
        nextId: "bad_end",
        moodDelta: 10,
        label: "risky",
      },
      {
        id: "gentle_redirect",
        text: "Eu adorei a ideia. Vamos colocar a gamificação no backlog e priorizá-la depois que validarmos o fluxo principal dos usuários.",
        nextId: "medium_end",
        moodDelta: -10,
        label: "neutral",
      },
    ],
  },

  marcus_smart_scope: {
    id: "marcus_smart_scope",
    speaker: "stakeholder",
    speakerName: "Marcus Chen, CEO",
    text: "OK... eu entendo onde você quer chegar. Mas eu ainda preciso da correspondência com IA, do feed social E das entrevistas em vídeo no lançamento. Nossos investidores da Series A esperam um produto real — não um protótipo.",
    tipText: "💡 Você abriu a porta para uma conversa real sobre escopo. Guie o Marcus para a funcionalidade com maior impacto para o usuário. Use evidências e empatia, não apenas restrições.",
    choices: [
      {
        id: "match_core",
        text: "O fluxo principal é: o candidato encontra um emprego → se candidata → é contratado. A correspondência via IA é a mágica desse fluxo. Vamos acertar isso primeiro — todo o resto amplifica esse ponto.",
        nextId: "great_end",
        moodDelta: -5,
        label: "good",
      },
      {
        id: "matching_and_feed",
        text: "Justo — correspondência + feed social para o lançamento. Entrevistas em vídeo ficam para a Fase 2 com uma data firme no roadmap para os investidores.",
        nextId: "good_end",
        moodDelta: 5,
        label: "neutral",
      },
    ],
  },

  marcus_harsh: {
    id: "marcus_harsh",
    speaker: "stakeholder",
    speakerName: "Marcus Chen, CEO",
    text: "Duas funcionalidades?! Meus investidores esperam uma PLATAFORMA. Não uma landing page com uma barra de busca. Isso é completamente inaceitável.",
    tipText: "⚠️ Cortes bruscos sem dados de apoio queimam a confiança rapidamente. Enquadre as restrições de escopo em termos de qualidade e sucesso do usuário — não apenas capacidade da equipe ou pressão de prazo.",
    choices: [
      {
        id: "backpedal",
        text: "Você tem razão, Marcus. Vamos nos comprometer com correspondência, feed social e entrevistas em vídeo para o lançamento.",
        nextId: "medium_end",
        moodDelta: 15,
        label: "neutral",
      },
      {
        id: "defend_with_data",
        text: "O Airbnb lançou com 3 anúncios em uma cidade. Profundidade vence amplitude no lançamento. Se formos de classe mundial na correspondência, o resto virá — e investidores amam uma história focada.",
        nextId: "good_end",
        moodDelta: 0,
        label: "good",
      },
    ],
  },

  great_end: {
    id: "great_end",
    speaker: "system",
    isEnd: true,
    endType: "great",
    text: "Marcus faz uma pausa. Ele larga o pincel. 'Sabe de uma coisa... você tem razão. Se acertarmos o fluxo de correspondência, todo o resto pode crescer a partir daí. Listagem de vagas + correspondência via IA para o Q1. Vou atualizar a apresentação para os investidores.' Ele parece visivelmente aliviado — talvez até animado com o foco.",
    endSummary: {
      scope: ["Feed de Vagas", "Correspondência via IA"],
      outcome: "MVP Fechado ✓",
      sprintResult: "Sucesso Absoluto! A equipe entregou antes do prazo e com zero bugs reportados. O foco permitiu polir cada detalhe.",
      reflection:
        "Você guiou Marcus para a experiência principal de maior valor. Um escopo enxuto significa um Q1 entregável, execução de alta qualidade e uma base real para iterar. É assim que bons POs operam.",
    },
  },

  good_end: {
    id: "good_end",
    speaker: "system",
    isEnd: true,
    endType: "good",
    text: "'OK — eu aceito,' diz Marcus, estendendo a mão. 'Correspondência + feed social para o Q1. Entrevistas em vídeo na Fase 2 — mas quero uma data firme no roadmap.' O escopo é razoável. Sua equipe tem espaço para respirar.",
    endSummary: {
      scope: ["Feed de Vagas", "Correspondência via IA", "Feed Social"],
      outcome: "Bom MVP ✓",
      sprintResult: "Sucesso! A equipe entregou tudo conforme o planejado. Houve alguns bugs menores corrigidos no primeiro deploy.",
      reflection:
        "Três funcionalidades bem escolhidas é um Q1 realista. O feed social adiciona diferenciação sem inflar o escopo. Sólido trabalho de PO — agora mãos à obra na criação de tickets.",
    },
  },

  medium_end: {
    id: "medium_end",
    speaker: "system",
    isEnd: true,
    endType: "medium",
    text: "Marcus sorri amplamente. 'É disso que eu estou falando! Quatro funcionalidades — totalmente gerenciável, certo?' Você assente com cuidado, já calculando a capacidade da sprint. Este Q1 será apertado.",
    endSummary: {
      scope: ["Listagem de Vagas", "Correspondência via IA", "Feed Social", "Entrevistas em Vídeo"],
      outcome: "Escopo Arriscado ⚠️",
      sprintResult: "Entrega Atrasada. A equipe precisou de 2 semanas extras e o sistema de vídeo foi lançado com bugs de compatibilidade.",
      reflection:
        "Quatro funcionalidades é tecnicamente alcançável, mas não deixa margem para erros. Você precisará de uma priorização implacável. Considere negociar um limite claro para a Fase 2 agora mesmo.",
    },
  },

  bad_end: {
    id: "bad_end",
    speaker: "system",
    isEnd: true,
    endType: "bad",
    text: "Marcus está absolutamente entusiasmado. O quadro branco está transbordando de funcionalidades, setas e rótulos do Q1. Enquanto você volta para sua mesa, calcula silenciosamente: isso levará no mínimo 18 meses. A engenharia vai ficar devastada.",
    endSummary: {
      scope: [
        "Feed de Vagas",
        "Correspondência via IA",
        "Feed Social",
        "Entrevistas em Vídeo",
        "Construtor de Currículo",
        "Ferramenta Salarial",
        "Indicações",
        "Centro de Aprendizado",
        "Gamificação",
      ],
      outcome: "Escopo Descontrolado 🚨",
      sprintResult: "Caos Total. A equipe não conseguiu entregar metade do escopo, o sistema caiu no lançamento e o time está exausto.",
      reflection:
        "Dizer sim a tudo deixa o CEO feliz a curto prazo — mas prepara a equipe para o fracasso e esgotamento. O trabalho de um PO é proteger a capacidade e entregar valor real, não ser uma máquina de aprovação.",
    },
  },
};
