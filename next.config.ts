import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // SITE_MODE=hiring serves only The Selling System funnel, so the agency homepage stays unpublished.
  // Temporary on purpose: browsers won't cache it once the full site goes live on this project.
  async redirects() {
    if (process.env.SITE_MODE !== "hiring") return [];
    return [{ source: "/", destination: "/selling-system", permanent: false }];
  },
};

export default nextConfig;
