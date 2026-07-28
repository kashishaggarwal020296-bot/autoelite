import type { MetadataRoute } from "next";
import { dealer } from "@/data/site.data";

export default function robots(): MetadataRoute.Robots {
  const base = dealer.url.replace(/\/$/, "");
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
  };
}
