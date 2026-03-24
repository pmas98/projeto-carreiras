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
    title: "Job Listings Feed",
    userStory:
      "As a job seeker, I can browse a filterable feed of job listings so that I can quickly find opportunities relevant to my skills and location.",
    acceptanceCriteria: [
      "Filter by role title, location (city/remote), and salary range",
      "Each card shows: company, role, location, salary band, and post date",
      "Infinite scroll or pagination with at least 20 results per page",
    ],
    storyPoints: 5,
    column: "backlog",
  },
  {
    id: "t2",
    title: "Candidate Profile",
    userStory:
      "As a job seeker, I can create and edit my public profile so that employers and the AI system can evaluate my fit for roles.",
    acceptanceCriteria: [
      "Profile fields: name, photo, headline, experience, education, skills, links",
      "Inline editing with autosave and a profile completeness meter",
      "Profile accessible via a unique public URL",
    ],
    storyPoints: 5,
    column: "backlog",
  },
  {
    id: "t3",
    title: "One-Click Apply",
    userStory:
      "As a job seeker, I can apply to a job in one click using my profile data so that the application process is fast and frictionless.",
    acceptanceCriteria: [
      "Apply pre-fills: name, email, headline, profile URL",
      "Confirmation state shown immediately after applying",
      "Duplicate application prevention with clear error state",
    ],
    storyPoints: 3,
    column: "backlog",
  },
  {
    id: "t4",
    title: "AI Job Match Score",
    userStory:
      "As a job seeker, I can see an AI-generated match score for each listing based on my profile so that I can prioritize my strongest applications.",
    acceptanceCriteria: [
      "Match score (0–100%) shown prominently on each listing card",
      "Score reflects skill overlap between profile and job requirements",
      "Tooltip explains the top 3 matching and missing skill factors",
    ],
    storyPoints: 8,
    column: "backlog",
  },
  {
    id: "t5",
    title: "Employer Applicant Dashboard",
    userStory:
      "As a hiring manager, I can view and manage applicants for my job postings so that I can efficiently run the hiring process.",
    acceptanceCriteria: [
      "Applicant list shows: name, headline, match score, apply date",
      "Filter by status: New / Reviewed / Shortlisted / Rejected",
      "Bulk status update via checkboxes",
    ],
    storyPoints: 5,
    column: "backlog",
  },
  {
    id: "t6",
    title: "Application Status Tracker",
    userStory:
      "As a job seeker, I can track all my applications and their statuses in one view so that I stay informed and can follow up at the right time.",
    acceptanceCriteria: [
      "Dashboard shows all applications: company, role, status, date applied",
      "Status updates when employer changes it",
      "Reminder surfaces after 7 days with no status change",
    ],
    storyPoints: 3,
    column: "backlog",
  },
];
