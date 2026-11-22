import Link from "next/link";
import { BrandMark } from "@/components/ui/BrandMark";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function SiteHeader() {
  return (
    <header className="border-b border-(--color-border)">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-6 py-5">
        <Link href="/" className="flex items-center gap-3 font-bold tracking-tight">
          <BrandMark size={32} />
          <span>
            ONZEMIL
            <small className="block text-[9px] tracking-[0.18em] text-(--color-text-dim)">
              COMPANY
            </small>
          </span>
        </Link>
        <a
          href={buildWhatsAppUrl(undefined, "general-budget")}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-(--color-border) px-4 py-3 text-sm transition hover:border-(--color-accent)"
        >
          Iniciar um projeto ↗
        </a>
      </div>
    </header>
  );
}
