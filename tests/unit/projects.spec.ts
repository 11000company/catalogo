import { describe, expect, test } from "vitest";
import { projects } from "@/data/projects";

describe("projects data", () => {
  test("slugs are unique", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  test("development-status projects have no liveUrl and unavailable preview", () => {
    for (const p of projects.filter((p) => p.status === "development")) {
      expect(p.liveUrl).toBeUndefined();
      expect(p.previewMode).toBe("unavailable");
    }
  });

  test("euclides-fitness never uses iframe preview", () => {
    const euclides = projects.find((p) => p.slug === "euclides-fitness");
    expect(euclides?.previewMode).not.toBe("iframe");
  });
});
