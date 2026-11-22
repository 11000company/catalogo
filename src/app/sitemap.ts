import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { getSiteUrl } from "@/lib/site-config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  return [
    { url: baseUrl, lastModified: new Date() },
    ...projects.map((p) => ({
      url: `${baseUrl}/projetos/${p.slug}`,
      lastModified: new Date(),
    })),
  ];
}
