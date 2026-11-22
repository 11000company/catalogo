import { afterEach, describe, expect, test } from "vitest";
import { getSiteUrl, isSiteUrlConfigured } from "@/lib/site-config";

describe("site-config", () => {
  const originalEnv = process.env.NEXT_PUBLIC_SITE_URL;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    } else {
      process.env.NEXT_PUBLIC_SITE_URL = originalEnv;
    }
  });

  test("getSiteUrl returns the env var when set", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://catalogo.onzemil.company";
    expect(getSiteUrl()).toBe("https://catalogo.onzemil.company");
  });

  test("getSiteUrl strips a trailing slash from the env var", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://catalogo.onzemil.company/";
    expect(getSiteUrl()).toBe("https://catalogo.onzemil.company");
  });

  test("getSiteUrl falls back to localhost when unset", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });

  test("isSiteUrlConfigured is true only when the env var is set", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://catalogo.onzemil.company";
    expect(isSiteUrlConfigured()).toBe(true);
    delete process.env.NEXT_PUBLIC_SITE_URL;
    expect(isSiteUrlConfigured()).toBe(false);
  });
});
