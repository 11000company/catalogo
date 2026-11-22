import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-6xl px-6 py-10 text-xs text-(--color-text-dim)">
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-(--color-border) pt-6">
        <span>© {new Date().getFullYear()} ONZEMIL COMPANY</span>
        <div className="flex gap-4">
          <a
            href="https://instagram.com/onzemil.company"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <a
            href={buildWhatsAppUrl(undefined, "general-budget")}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
