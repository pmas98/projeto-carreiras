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
    role: "Recent Graduate",
    age: 24,
    emoji: "🎓",
    tagline: "Just graduated, trying to break into tech",
    gradient: "from-sky-500 to-cyan-400",
    noteColor: "bg-sky-100 border-sky-300 text-sky-900",
    notes: [
      "Needs a simple, mobile-first apply flow",
      "Wants to showcase portfolio & GitHub projects",
      "Gets overwhelmed by too many options",
      "Price-sensitive — free tier is essential",
    ],
  },
  {
    id: "maria",
    name: "Maria",
    role: "Career Switcher",
    age: 35,
    emoji: "🔄",
    tagline: "Pivoting from finance to product management",
    gradient: "from-purple-500 to-pink-400",
    noteColor: "bg-pink-100 border-pink-300 text-pink-900",
    notes: [
      "Needs skill-gap analysis vs job requirements",
      "Values mentorship and career coaching resources",
      "Wants to track all applications in one place",
      "Would pay for advanced career coaching features",
    ],
  },
  {
    id: "jordan",
    name: "Jordan",
    role: "Hiring Manager",
    age: 42,
    emoji: "💼",
    tagline: "Reviewing 200+ applications every week",
    gradient: "from-amber-500 to-orange-400",
    noteColor: "bg-amber-100 border-amber-300 text-amber-900",
    notes: [
      "Needs fast, filterable candidate dashboards",
      "Wants team-fit scoring and culture match data",
      "Must integrate with existing ATS (Greenhouse, Lever)",
      "Has budget for B2B seat-based pricing",
    ],
  },
];

export const BUSINESS_MODELS: BusinessModel[] = [
  {
    id: "freemium",
    name: "Freemium",
    emoji: "🆓",
    tagline: "Free for seekers, paid for power users",
    gradient: "from-green-500 to-emerald-400",
    noteColor: "bg-green-100 border-green-300 text-green-900",
    notes: [
      "Free tier must deliver genuine value before paywall",
      "Premium unlocks: AI insights, analytics, coaching",
      "Conversion funnel is critical to design from day one",
    ],
  },
  {
    id: "b2b",
    name: "B2B SaaS",
    emoji: "🏢",
    tagline: "Charge companies per recruiter seat",
    gradient: "from-blue-500 to-indigo-400",
    noteColor: "bg-indigo-100 border-indigo-300 text-indigo-900",
    notes: [
      "Company admin portal and team management needed",
      "Enterprise contracts need data residency / SOC2",
      "Multi-seat billing requires strong account management",
    ],
  },
  {
    id: "commission",
    name: "Commission",
    emoji: "💰",
    tagline: "% of successful hire fee from employers",
    gradient: "from-yellow-500 to-amber-400",
    noteColor: "bg-yellow-100 border-yellow-300 text-yellow-900",
    notes: [
      "Hire-tracking and employer verification are core",
      "Requires integrated payment flow from launch",
      "Success rate reporting builds employer trust",
    ],
  },
];

export const MVP_REQUIREMENTS: PORequirement[] = [
  {
    id: "r1",
    text: "Job listings feed with search & filter by role, location, and salary range",
    source: "Alex + Jordan",
  },
  {
    id: "r2",
    text: "One-click apply using a pre-filled candidate profile",
    source: "Alex + Maria",
  },
  {
    id: "r3",
    text: "Candidate profile with skills, experience, education & portfolio links",
    source: "All personas",
  },
  {
    id: "r4",
    text: "AI job-match score per listing based on skills overlap (core differentiator)",
    source: "Maria + Jordan",
  },
  {
    id: "r5",
    text: "Employer applicant dashboard with filtering and status management",
    source: "Jordan + B2B",
  },
  {
    id: "r6",
    text: "Application status tracker so job seekers can follow up at the right time",
    source: "Maria + Alex",
  },
];
