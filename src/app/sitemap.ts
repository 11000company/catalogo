import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";

export const dynamic = "force-static";

const BASE_URL = "https://catalogo.onzemil.company";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, lastModified: new Date() },
    ...projects.map((p) => ({
      url: `${BASE_URL}/projetos/${p.slug}`,
      lastModified: new Date(),
    })),
  ];
}
