const LOCAL_FALLBACK_URL = "http://localhost:3000";

export function isSiteUrlConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SITE_URL);
}

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (!configured) return LOCAL_FALLBACK_URL;
  return configured.replace(/\/+$/, "");
}
