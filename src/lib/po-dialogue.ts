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
    reflection: string;
  };
};

export const INITIAL_MOOD = 70;

export const DIALOGUE_TREE: Record<string, DialogueNode> = {
  start: {
    id: "start",
    speaker: "system",
    text: "You walk into Conference Room B. Marcus Chen, CEO, is at the whiteboard, marker in hand, visibly buzzing with energy. He's filled every inch of the board with sticky notes, arrows, and feature names. He turns and grins as you sit down.",
    nextId: "marcus_vision",
  },

  marcus_vision: {
    id: "marcus_vision",
    speaker: "stakeholder",
    speakerName: "Marcus Chen, CEO",
    text: "OK — here's the full picture for Carreiras. We're building a complete ecosystem: AI-powered job matching, a LinkedIn-style professional social feed, live video interview rooms, an AI resume builder, a salary negotiation assistant, peer referral networks, and a skills learning hub. All of it, ready for Q1 launch. This is going to absolutely destroy LinkedIn.",
    choices: [
      {
        id: "agree_all",
        text: "Incredible vision, Marcus! Let's commit to building everything for the Q1 launch.",
        nextId: "marcus_agree_all",
        moodDelta: 15,
        label: "risky",
      },
      {
        id: "smart_scope",
        text: "Love the energy! Let's align on the core jobs-to-be-done and define a tight MVP that proves the concept.",
        nextId: "marcus_smart_scope",
        moodDelta: 5,
        label: "good",
      },
      {
        id: "harsh_cut",
        text: "Marcus — to be honest, we can realistically ship 2 features in Q1. Everything else is Phase 2.",
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
    text: "YES! That's the attitude I need from a PO. And you know what — I've been thinking — we should also add a gamification layer. Badges, leaderboards, a streak system for daily applications. Goes on the Q1 list!",
    tipText: "⚠️ Agreeing to everything without evaluating feasibility is classic scope creep. A strong PO channels stakeholder excitement toward measurable user value — not feature volume.",
    choices: [
      {
        id: "add_gamification",
        text: "Gamification is a great engagement mechanic — let's include it!",
        nextId: "bad_end",
        moodDelta: 10,
        label: "risky",
      },
      {
        id: "gentle_redirect",
        text: "I love the idea. Let's park gamification in the backlog and prioritize it after we validate core user flows.",
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
    text: "OK... I can see where you're going. But I still need AI matching, the social feed, AND video interviews at launch. Our Series A investors are expecting a real product — not a prototype.",
    tipText: "💡 You've opened the door to a real scoping conversation. Steer Marcus toward the feature with the highest user impact. Use evidence and empathy, not just constraints.",
    choices: [
      {
        id: "match_core",
        text: "The core loop is: job seeker finds a job → applies → gets hired. AI matching is the magic in that loop. Let's nail it first — everything else amplifies it.",
        nextId: "great_end",
        moodDelta: -5,
        label: "good",
      },
      {
        id: "matching_and_feed",
        text: "Fair — matching + social feed for launch. Video interviews goes to Phase 2 with a firm roadmap date for investors.",
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
    text: "Two features?! My investors are expecting a PLATFORM. Not a landing page with a search bar. This is completely unacceptable.",
    tipText: "⚠️ Blunt cuts without supporting data burn trust fast. Frame scope constraints in terms of quality and user success — not just team capacity or timeline pressure.",
    choices: [
      {
        id: "backpedal",
        text: "You're right, Marcus. Let's commit to matching, social feed, and video interviews for launch.",
        nextId: "medium_end",
        moodDelta: 15,
        label: "neutral",
      },
      {
        id: "defend_with_data",
        text: "Airbnb launched with 3 listings in one city. Depth beats breadth at launch. If we're world-class at matching, the rest follows — and investors love a focused story.",
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
    text: "Marcus pauses. He sets down his marker. 'You know what… you're actually right. If we nail the matching loop, everything else can grow from there. Job listings + AI matching for Q1. I'll update the investor deck.' He looks visibly relieved — maybe even excited about the focus.",
    endSummary: {
      scope: ["Job Listings Feed", "AI Job Matching"],
      outcome: "MVP Locked ✓",
      reflection:
        "You guided Marcus to the highest-value core experience. A tight scope means a shippable Q1, high-quality execution, and a real foundation to iterate from. This is how great POs operate.",
    },
  },

  good_end: {
    id: "good_end",
    speaker: "system",
    isEnd: true,
    endType: "good",
    text: "'OK — I can live with that,' Marcus says, extending his hand. 'Matching + social feed for Q1. Video interviews Phase 2 — but I want a firm date on the roadmap.' The scope is reasonable. Your team has room to breathe.",
    endSummary: {
      scope: ["Job Listings Feed", "AI Job Matching", "Social Feed"],
      outcome: "Good MVP ✓",
      reflection:
        "Three well-chosen features is a realistic Q1. The social feed adds differentiation without bloating scope. Solid PO work — now get to ticket creation.",
    },
  },

  medium_end: {
    id: "medium_end",
    speaker: "system",
    isEnd: true,
    endType: "medium",
    text: "Marcus smiles broadly. 'That's what I'm talking about! Four features — totally manageable, right?' You nod carefully, already calculating sprint capacity. This Q1 is going to be tight.",
    endSummary: {
      scope: ["Job Listings", "AI Matching", "Social Feed", "Video Interviews"],
      outcome: "Risky Scope ⚠️",
      reflection:
        "Four features is technically achievable but leaves no margin for error. You'll need ruthless prioritization. Consider negotiating a clear Phase 2 boundary now.",
    },
  },

  bad_end: {
    id: "bad_end",
    speaker: "system",
    isEnd: true,
    endType: "bad",
    text: "Marcus is absolutely thrilled. The whiteboard is overflowing with features, arrows, and Q1 labels. As you walk back to your desk, you calculate quietly: this will take 18 months minimum. Engineering is going to be devastated.",
    endSummary: {
      scope: [
        "Job Listings",
        "AI Matching",
        "Social Feed",
        "Video Interviews",
        "Resume Builder",
        "Salary Tool",
        "Referrals",
        "Learning Hub",
        "Gamification",
      ],
      outcome: "Scope Creep 🚨",
      reflection:
        "Saying yes to everything keeps the CEO happy short-term — but it sets the team up for failure and burnout. A PO's job is to protect capacity and deliver real value, not to be an approval machine.",
    },
  },
};
