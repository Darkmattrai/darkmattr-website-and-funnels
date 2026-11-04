import { site } from "@/content/site";

/**
 * The origin this deployment is served from, for share cards, canonical links and the sitemap.
 * SITE_ORIGIN wins. On Vercel it falls back to the project's production domain, otherwise darkmattr.co.
 */
const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
export const origin = (process.env.SITE_ORIGIN || (vercelProduction ? `https://${vercelProduction}` : site.url)).replace(/\/+$/, "");

/** SITE_MODE=hiring publishes only The Selling System funnel (see the redirect in next.config.ts). */
export const hiringOnly = process.env.SITE_MODE === "hiring";
