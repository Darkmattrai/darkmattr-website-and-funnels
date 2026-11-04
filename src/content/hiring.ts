/**
 * ─────────────────────────────────────────────────────────────
 *  THE SELLING SYSTEM — HIRING FUNNEL CONTENT
 *  Landing copy, the three roles, the 8 survey questions and the
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
  eyebrow: "The Selling System · Hiring now · Remote",
  headline: { lineOne: "You sell.", lineTwo: "We bring the\nbuyers.", accent: "buyers." },
  sub: "Three seats open: DM/Phone Setter, Closer and Outbound Sales Specialist. If you can hold a conversation and close a loop, we want to hear from you.",
  primaryCta: "Start your application",
  secondaryCta: "See the roles",
  proof: [
    // PLACEHOLDER: confirm these perks.
    { value: "100%", label: "Remote, work from anywhere" },
    { value: "Weekly", label: "Call reviews and coaching" },
    { value: "Uncapped", label: "Commission on every deal" },
  ],
  mascots: {
    alt: "Clay figures of Aal and Mo, the founders of Dark Mattr, turning to each other and touching fingertips as you scroll",
    caption: "Aal & Mo, our founders, in clay",
  },
  founders: {
    label: "Meet the founders",
    title: "The real ones\nbehind the clay.",
    accent: "clay.",
    body: "Aal & Mo built Dark Mattr from Paris into an agency with $23,000,000+ in revenue generated. Now they're building the sales team behind it.",
    cta: "Apply to join the team",
    // From darkmattr.co (published results). Keep in sync with the main site.
    stats: [
      { label: "Total revenue generated", value: "$23,000,000+" },
      { label: "Average ROAS", value: "3.6" },
      { label: "Battle-tested strategies", value: "174" },
      { label: "Eyeballs grabbed", value: "71,000,000+" },
    ],
  },
  rolesIntro: { label: "Three seats open", title: "Pick the seat\nthat fits you.", accent: "you." },
  apply: {
    label: "Apply",
    title: "Two steps.\nTen minutes.",
    accent: "minutes.",
    body: "Leave your details now. The survey comes next: eight questions about how you actually sell, one at a time, plus your resume.",
    steps: ["Your details, one minute", "The survey, eight questions", "A call with our sales lead"],
  },
  trust: { seenOn: "As seen on", partners: "Partners" },
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

export const why = {
  title: "Why sell here",
  heading: { lead: "Sell what people", accent: "already want." },
  points: [
    { title: "Leads from our own engine", body: "Dark Mattr is a lead-generation agency. You sell to people who asked to talk, not a phone book." },
    { title: "Scripts, training, call reviews", body: "Weekly reviews with the sales lead. You get better every week or we're not doing our job." },
    { title: "Paid on results", body: "Commission on every deal you touch, paid out on a fixed schedule." }, // PLACEHOLDER: payout schedule
    { title: "A path, not a seat", body: "Setters become closers. Closers become team leads. We promote from inside first." },
  ],
};

export const process = {
  title: "How hiring works",
  steps: [
    { n: "01", title: "Apply", body: "Leave your details. Takes about a minute.", time: "1 min" },
    { n: "02", title: "Survey", body: "Eight questions about how you sell, one at a time, plus your resume.", time: "10 min" },
    { n: "03", title: "Call", body: "A 20-minute call with our sales lead. You'll do a short roleplay.", time: "20 min" },
    { n: "04", title: "Trial", body: "A paid trial week on real leads. Then we decide together.", time: "1 week" }, // PLACEHOLDER
  ],
};

export const faqTitle = "Before you ask";

export const faq = [
  { q: "Is this remote?", a: "Yes, fully. You need a quiet place, a stable connection and a laptop. Our calls run mostly in European and Middle East hours." }, // PLACEHOLDER: hours
  { q: "Do I need experience?", a: "Closers and outbound specialists: yes, with numbers to show. Setters: we'd rather see hunger and speed than a long CV." },
  { q: "How are you paid?", a: "Setters get a base plus a fee per qualified booked call; closers earn commission per closed deal; outbound earns on both. Details on the call." }, // PLACEHOLDER
  { q: "How fast do you reply?", a: "Within two business days. If you're a fit we'll book the call straight away." },
];

/** Step 1: contact details. Has its own webhook. */
export const stepOne = {
  title: "Start your application",
  sub: "Four details, then the survey. We'll use them to map your answers to your profile.",
  button: "Continue to the survey",
};

export type Question =
  | { id: string; kind: "choice"; title: string; help?: string; options: string[] }
  | { id: string; kind: "text"; title: string; help?: string; placeholder?: string; multiline?: boolean }
  | { id: string; kind: "file"; title: string; help?: string; accept: string; maxMB: number };

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
