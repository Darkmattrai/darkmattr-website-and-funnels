import { site } from "@/content/site";

/** SITE_MODE=hiring publishes only The Selling System funnel (see the redirect in next.config.ts). */
export const hiringOnly = process.env.SITE_MODE === "hiring";

/**
 * The origin this deployment is served from, for share cards, canonical links and the sitemap.
 * SITE_ORIGIN wins; otherwise the hiring funnel uses careers.darkmattr.co and the full site darkmattr.co.
 */
export const origin = (process.env.SITE_ORIGIN || (hiringOnly ? site.careersUrl : site.url)).replace(/\/+$/, "");
