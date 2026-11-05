/**
 * ─────────────────────────────────────────────────────────────
 *  THE SELLING SYSTEM — HIRING FUNNEL CONTENT
 *  Hero copy, the three roles, the 8 survey questions and the
 *  confirmation step. Edit here; the components pick it up.
 *
 *  Anything marked  // PLACEHOLDER  must be replaced before launch.
 * ─────────────────────────────────────────────────────────────
 */

export const MAX_ANSWER_CHARS = 4000;
export const MAX_RESUME_MB = 4; // Vercel rejects bodies over 4.5 MB before our code runs
export const RESUME_RETENTION_DAYS = 90;

export const hiring = {
  brand: "The Selling System",
  // PLACEHOLDER: confirm what The Selling System is in one line.
  about:
    "The Selling System is Dark Mattr's sales floor. Our lead-generation engine fills the calendar; setters, closers and outbound specialists turn it into revenue, and get paid for every deal.",
  eyebrow: "Dark Mattr · The Selling System · Hiring now · Remote",
  headline: { lineOne: "Join the fastest-growing", lineTwo: "sales team in the region.", accent: "fastest-growing" },
  sub: "Our own ad engine fills the calendar with buyers who asked to talk. We're hiring the setters, closers and outbound reps who turn that pipeline into revenue: fully remote, coached every week, paid on every deal you touch.",
  // PLACEHOLDER: confirm these perks.
  chips: [
    "Warm inbound from our own ad engine",
    "Uncapped commission on every deal",
    "Weekly call reviews with our sales lead",
    "A real path: setter to closer to lead",
  ],
  primaryCta: "Claim your seat",
  seats: "3 seats open: Setter · Closer · Outbound",
  riskReversal: "Takes 60 seconds to start. No CV until step 2. We reply within two business days.",
};

export type Role = {
  id: "setter" | "closer" | "outbound";
  title: string;
  tagline: string;
  summary: string;
  youWill: string[];
  weLookFor: string[];
  comp: string;
};

export const roles: Role[] = [
  {
    id: "setter",
    title: "DM/Phone Setter",
    tagline: "You open the door.",
    summary: "Turn inbound DMs, comments and leads into booked, qualified calls that show up.",
    youWill: ["Reply to inbound DMs and leads within minutes", "Qualify fast and book calls on the closers' calendars", "Follow up until they show, without being annoying"],
    weLookFor: ["Fast, warm typing and a clear phone voice", "Persistence with zero ego about follow-ups", "Comfortable in a CRM all day"],
    comp: "Base + pay per qualified booked call", // PLACEHOLDER
  },
  {
    id: "closer",
    title: "Closer",
    tagline: "You bring it home.",
    summary: "Run booked sales calls for high-ticket offers and close them, cleanly and honestly.",
    youWill: ["Run 4–8 booked calls a day", "Handle objections and close on the call", "Hand clients off to delivery with clean notes"],
    weLookFor: ["A track record on high-ticket offers", "A closing rate you can back up with numbers", "Coachable: you want your calls reviewed"],
    comp: "Commission per closed deal, uncapped", // PLACEHOLDER
  },
  {
    id: "outbound",
    title: "Outbound Sales Specialist",
    tagline: "You find the ones who haven't found us yet.",
    summary: "Build pipeline from scratch with cold email, DMs and calls, then book the meetings.",
    youWill: ["Build and clean target lists", "Run email and DM sequences, then pick up the phone", "Book meetings and keep the pipeline honest in the CRM"],
    weLookFor: ["Hunter mindset and real resilience", "Fluency with outbound tools and CRMs", "Writing that gets replies"],
    comp: "Base + commission on booked and closed", // PLACEHOLDER
  },
];

/** Step 1: contact details. Has its own webhook. */
export const stepOne = {
  title: "Start your application",
  sub: "Four details, then the survey. We'll use them to map your answers to your profile.",
  button: "Continue to the survey",
};

export type Question =
  | { id: string; kind: "choice"; title: string; help?: string; options: string[] }
  | { id: string; kind: "text"; title: string; help?: string; placeholder?: string; multiline?: boolean; format?: "loom"; formatError?: string }
  | { id: string; kind: "file"; title: string; help?: string; accept: string; maxMB: number };

/** A Loom share link: https://www.loom.com/share/<id> (or loom.com/..., www optional). */
export const LOOM_RE = /^(https?:\/\/)?(www\.)?loom\.com\/[^\s]+$/i;

/** Normalises a Loom link to https://..., or "" if it isn't one. */
export function normalizeLoomUrl(v: string): string {
  const t = v.trim();
  if (!LOOM_RE.test(t)) return "";
  return /^https?:\/\//i.test(t) ? t.replace(/^http:/i, "https:") : `https://${t}`;
}

/** Whether an answer is complete and in the right format for its question. */
export function isAnswerValid(q: Question, v: string | undefined): boolean {
  const t = (v ?? "").trim();
  if (!t) return false;
  if (q.kind === "text" && q.format === "loom") return Boolean(normalizeLoomUrl(t));
  return true;
}

/** Step 2: the survey, one question at a time. */
export const questions: Question[] = [
  {
    id: "position",
    kind: "choice",
    title: "We're currently hiring DM/Phone Setters, Closers, and Outbound Sales Specialists. Which position do you feel you fit in the best?",
    options: ["DM/Phone Setter", "Closer", "Outbound Sales Specialist"],
  },
  {
    id: "experience",
    kind: "text",
    multiline: true,
    title: "How many years of experience do you have in the sales industry, and in what specific position?",
    help: "For example: 3 years, 1 as an SDR at a SaaS company, 2 closing high-ticket coaching offers.",
  },
  {
    id: "training",
    kind: "text",
    multiline: true,
    title: "Have you taken any form of sales training? If yes, who were your mentors?",
    help: "Programs, courses, the people who trained you.",
  },
  {
    id: "objection",
    kind: "text",
    multiline: true,
    title: "Mention the most common objection you face, and how you handle it.",
    help: "The objection, then exactly what you say.",
  },
  {
    id: "closingRate",
    kind: "text",
    title: "What is your average closing rate based on your sales career history?",
    help: "For example: 28% on booked calls.",
    placeholder: "Your closing rate",
  },
  {
    id: "characteristics",
    kind: "text",
    multiline: true,
    title: "Name 3 of your main characteristics that make you a good sales person.",
    help: "Three, with a line on each.",
  },
  {
    id: "bestOffer",
    kind: "text",
    multiline: true,
    title: "In what offer did you best perform, and why?",
    help: "The offer, the numbers, and what made it work.",
  },
  {
    id: "loomUrl",
    kind: "text",
    format: "loom",
    title: "Sell us the best product you know: you. Paste a Loom link where you introduce yourself, your skill set and your biggest wins.",
    help: "2–3 minutes, camera on. Who you are, how you sell, and the results you're proudest of. Record free at loom.com, then paste the share link (https://www.loom.com/share/...).",
    placeholder: "https://www.loom.com/share/...",
    formatError: "Please paste a Loom link, like https://www.loom.com/share/...",
  },
  {
    id: "resume",
    kind: "file",
    title: "Please upload your resume.",
    help: "PDF or Word, up to 4 MB.",
    accept: ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    maxMB: MAX_RESUME_MB,
  },
];

export const confirmStep = {
  title: "Please confirm your information",
  sub: "We use it to map your answers to your profile. Edit anything that's changed.",
  button: "Submit my application",
  retention: "We keep your resume for 90 days to run this hiring round, then delete it.",
};

export const success = {
  title: "Application received.",
  body: "We read every one. If you're a fit, you'll get a call invite within two business days.",
};
