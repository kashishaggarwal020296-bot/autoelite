import type { MetadataRoute } from "next";
import { models } from "@/data/scooters.data";
import { stores, dealer } from "@/data/site.data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = dealer.url.replace(/\/$/, "");
  const staticPaths = [
    "",
    "/scooters",
    "/test-ride",
    "/on-road-price",
    "/finance",
    "/service",
    "/charging",
    "/ownership",
    "/contact",
    "/faq",
  ];
  const now = new Date();
  return [
    ...staticPaths.map((p) => ({ url: `${base}${p}`, lastModified: now })),
    ...models.map((m) => ({ url: `${base}/scooters/${m.id}`, lastModified: now })),
    ...stores.map((s) => ({ url: `${base}/stores/${s.slug}`, lastModified: now })),
  ];
}
