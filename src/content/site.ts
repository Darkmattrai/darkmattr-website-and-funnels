/**
 * ─────────────────────────────────────────────────────────────
 *  DARK MATTR — SITE CONTENT
 *  Every word, number and link on the site lives in this file.
 *  Edit here; the components pick it up automatically.
 *
 *  Anything marked  // PLACEHOLDER  must be replaced with real
 *  information before the site goes live.
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  name: "Dark Mattr",
  url: "https://darkmattr.co",
  email: "info@darkmattr.co",
  location: "Paris, France",
  description:
    "Dark Mattr is a lead generation agency and a family of companies, digital products and software. We build the invisible system of ads, funnels, outreach and automation that pulls customers into your orbit.",
  socials: [
    { label: "Instagram", href: "https://instagram.com/" }, // PLACEHOLDER
    { label: "LinkedIn", href: "https://linkedin.com/" }, // PLACEHOLDER
    { label: "X", href: "https://x.com/" }, // PLACEHOLDER
  ],
};

export const nav = [
  { label: "Manifesto", href: "#manifesto", note: "Why the invisible wins" },
  { label: "Forces", href: "#forces", note: "What we do" },
  { label: "Method", href: "#method", note: "How we work" },
  { label: "Universe", href: "#universe", note: "Our companies & software" },
  { label: "Fit", href: "#fit", note: "Who we work with" },
  { label: "Contact", href: "#contact", note: "Book a strategy call" },
];

export const hero = {
  eyebrow: "Lead generation agency · Companies · Software",
  lineOne: "You can't see it.",
  lineTwo: "You'll feel the pull.",
  sub: "We're the invisible force behind your pipeline: ads, funnels, outreach and automation that pull qualified buyers into your orbit, every single day.",
  primaryCta: "Book a strategy call",
  secondaryCta: "Explore the universe",
  hint: "Move to bend the galaxy · Hold to collapse it",
};

export const marquee = [
  "Paid acquisition",
  "Funnels that convert",
  "Cold outbound",
  "CRM automation",
  "Scroll-stopping creative",
  "Booked calls",
  "Qualified pipeline",
  "Revenue, not reach",
];

export const manifesto = {
  label: "Sector 01 · Manifesto",
  text: "85% of the universe is matter nobody can see. It's the only reason galaxies don't fly apart. We're that for your revenue: the unseen system working in the background so leads keep falling toward you while you get on with running the business.",
  highlight: ["nobody can see", "fly apart", "leads keep falling toward you"],
};

export type Force = {
  id: string;
  title: string;
  line: string;
  points: string[];
};

export const forces: Force[] = [
  {
    id: "01",
    title: "Paid Acquisition",
    line: "Meta, Google, TikTok and LinkedIn ads engineered for cost-per-lead, not vanity reach.",
    points: ["Offer & angle testing", "Full-funnel media buying", "Retargeting that actually closes"],
  },
  {
    id: "02",
    title: "Funnels & Landing Pages",
    line: "Pages built like gravity wells: one idea, one action, no way back out.",
    points: ["Lead magnets & VSL funnels", "Quiz & application funnels", "Relentless A/B testing"],
  },
  {
    id: "03",
    title: "Outbound & Cold Email",
    line: "Infrastructure, data and copy that books meetings with people who've never heard of you. Yet.",
    points: ["Deliverability infrastructure", "Hand-built lead lists", "Personalised sequences at scale"],
  },
  {
    id: "04",
    title: "CRM & Automation",
    line: "Every lead caught, tagged, nurtured and followed up in seconds, even while you sleep.",
    points: ["Speed-to-lead automations", "SMS, email & AI follow-up", "Pipeline & booking systems"],
  },
  {
    id: "05",
    title: "Creative & Content",
    line: "Hooks, ads and UGC that stop the thumb and earn the click.",
    points: ["Static & motion ads", "UGC & founder-led video", "Copy that sells without shouting"],
  },
  {
    id: "06",
    title: "Tracking & Optimisation",
    line: "Data you can trust, tests that compound, and dashboards that tell the truth.",
    points: ["Server-side tracking", "Attribution you can act on", "Weekly growth sprints"],
  },
];

export const method = {
  label: "Sector 03 · The Gravity Method",
  title: "Four phases.\nOne direction: up.",
  steps: [
    {
      n: "01",
      name: "Map the dark",
      time: "Week 1",
      body: "We dissect your offer, market, numbers and competitors to find the demand nobody's capturing yet, and we put a target cost-per-lead in writing.",
    },
    {
      n: "02",
      name: "Build the mass",
      time: "Weeks 2–3",
      body: "Funnels, creative, tracking, CRM and outbound infrastructure, all assembled into one system before a single dollar goes live.",
    },
    {
      n: "03",
      name: "Switch on gravity",
      time: "Week 4",
      body: "Traffic and outreach go live across channels. Leads start landing in your calendar, already qualified and already warm.",
    },
    {
      n: "04",
      name: "Compound",
      time: "Every week after",
      body: "We kill what's weak, scale what works and report every number openly. The pull gets stronger every month.",
    },
  ],
};

export type Body = {
  name: string;
  kind: "Agency" | "Software" | "Digital product" | "Sub-brand";
  line: string;
  href?: string;
  color: string;
};

/** The Dark Mattr universe: sub-companies, digital products and software. */
export const universe: { label: string; title: string; sub: string; bodies: Body[] } = {
  label: "Sector 04 · The Universe",
  title: "More than an agency.\nA whole galaxy.",
  sub: "Dark Mattr is the core. Around it orbits a family of companies, digital products and software we've built, run and battle-tested on ourselves first.",
  bodies: [
    // PLACEHOLDER: replace these six with your real sub-companies, products and software.
    { name: "Nebula", kind: "Software", line: "The CRM and automation engine behind our client pipelines.", color: "#8b5cff" },
    { name: "Event Horizon", kind: "Agency", line: "Specialist performance studio for high-ticket offers.", color: "#ff5b2e" },
    { name: "Pulsar", kind: "Software", line: "Cold-email infrastructure and deliverability at scale.", color: "#5ce1ff" },
    { name: "Quasar Academy", kind: "Digital product", line: "Lead generation training, playbooks and templates.", color: "#f3c9b3" },
    { name: "Halo", kind: "Sub-brand", line: "Creative and UGC production house.", color: "#c8ff5c" },
    { name: "Singularity", kind: "Digital product", line: "Plug-and-play funnel templates that convert from day one.", color: "#ff9bd2" },
  ],
};

export const numbers = {
  label: "Sector 05 · Measured mass",
  // PLACEHOLDER: replace with your real, verifiable results.
  stats: [
    { value: 40, prefix: "$", suffix: "M+", label: "Pipeline generated for clients" },
    { value: 250, prefix: "", suffix: "k+", label: "Leads delivered" },
    { value: 3.4, prefix: "", suffix: "x", label: "Average return on ad spend", decimals: 1 },
    { value: 14, prefix: "", suffix: "", label: "Days from kickoff to first leads" },
  ],
};

export const fit = {
  label: "Sector 06 · Gravitational fit",
  title: "We don't work with everyone.\nThat's the point.",
  yes: [
    "You have an offer that already sells, and you want more of the right people seeing it",
    "You can handle more leads than you're getting right now",
    "You want a partner who talks in numbers, not buzzwords",
    "You're ready to move fast and test faster",
  ],
  no: [
    "You're still figuring out what you sell",
    "You want likes and followers, not booked calls",
    "You need results by Friday with zero budget",
    "You'd rather not see the real numbers",
  ],
};

export const faq = [
  {
    q: "How fast will we see leads?",
    a: "Most clients see their first qualified leads within 14 days of kickoff. Weeks 1–3 are spent building the system properly, because rushing that part is how agencies burn your budget.",
  },
  {
    q: "Do you lock us into long contracts?",
    a: "No. We start with a focused 90-day engagement so both sides can see the numbers. After that it's month-to-month. We keep clients by performing, not by paperwork.",
  },
  {
    q: "What industries do you work with?",
    a: "Service businesses, B2B, coaching and education, local businesses and high-ticket offers. If a qualified conversation is worth real money to you, we can probably help.",
  },
  {
    q: "What do you need from us?",
    a: "A clear offer, access to your ad accounts and CRM (or we set them up), and someone on your side who can take the calls we book. We handle everything else.",
  },
  {
    q: "How much does it cost?",
    a: "It depends on channels and scope. Every engagement is quoted after a free strategy call, where we'll show you the numbers and what's realistic before you commit to anything.",
  },
];

export const contact = {
  label: "Sector 07 · Contact",
  title: "Step into\nour orbit.",
  sub: "Tell us where you are and where you want to be. We'll come back within one business day with an honest take on whether we can get you there.",
  services: ["Paid ads", "Funnels", "Cold outbound", "CRM & automation", "Creative", "Not sure yet"],
  budgets: ["Under $3k / mo", "$3k–$10k / mo", "$10k–$30k / mo", "$30k+ / mo"],
  timelines: ["ASAP", "This month", "This quarter", "Just exploring"],
  success: "Signal received. We'll be in touch within one business day.",
};
