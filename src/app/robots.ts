import type { MetadataRoute } from "next";
import { origin } from "@/lib/origin";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${origin}/sitemap.xml` };
}
