import type { MetadataRoute } from "next";
import { hiringOnly, origin } from "@/lib/origin";

export default function sitemap(): MetadataRoute.Sitemap {
  const hiring = { url: `${origin}/selling-system`, changeFrequency: "weekly" as const, priority: hiringOnly ? 1 : 0.8 };
  return hiringOnly ? [hiring] : [{ url: origin, changeFrequency: "monthly", priority: 1 }, hiring];
}
