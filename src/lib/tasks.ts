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
      title: "The Stakeholder Meeting",
      subtitle: "Negotiate scope to an MVP without angering the stakeholder.",
    },
    {
      id: "po_defining_product",
      title: "Defining the Product",
      subtitle: "Synthesize MVP requirements from personas & business model notes.",
    },
    {
      id: "po_ticket_creation",
      title: "Ticket Creation",
      subtitle: "Convert requirements into User Stories and Acceptance Criteria.",
    },
  ],
  devOps: [
    {
      id: "devops_outage",
      title: "The Outage",
      subtitle: "Receive a simulated PagerDuty-style alert.",
    },
    {
      id: "devops_terminal",
      title: "The Terminal",
      subtitle: "Use a browser CLI with basic commands like `ls` and `cat`.",
    },
    {
      id: "devops_investigation_resolution",
      title: "Investigation & Resolution",
      subtitle: "Run the right command(s) to fix the machine.",
    },
  ],
  frontend: [
    {
      id: "frontend_broken_ui",
      title: "The Broken UI",
      subtitle: "A deliberately bad component—misaligned, ugly colors, confusing layout.",
    },
    {
      id: "frontend_code_editor",
      title: "The Code Editor",
      subtitle: "Edit raw CSS/React/Frontr Motion values in a lightweight editor.",
    },
    {
      id: "frontend_fix",
      title: "The Fix",
      subtitle: "Adjust the specific values to match the design mockup.",
    },
  ],
  backend: [
    {
      id: "backend_api_client",
      title: "The API Client",
      subtitle: "Simulated Postman/Insomnia UI for building requests.",
    },
    {
      id: "backend_auth",
      title: "Authentication",
      subtitle: "Create a POST payload that returns a mock JWT.",
    },
    {
      id: "backend_data_fetching",
      title: "Data Fetching",
      subtitle: "Attach the JWT and filter a local dataset.",
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
    description: "Stakeholders, scoping, and agile thinking.",
  },
  devOps: {
    label: "DevOps",
    path: "/devops",
    description: "Incidents, logs, and system recovery.",
  },
  frontend: {
    label: "Frontend Developer",
    path: "/frontend",
    description: "UI/UX, CSS control, and live feedback.",
  },
  backend: {
    label: "Backend Developer",
    path: "/backend",
    description: "APIs, auth, and data filtering flows.",
  },
};

