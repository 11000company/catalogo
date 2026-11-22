import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-32 text-center">
      <h1 className="mb-4 text-4xl font-bold tracking-tighter">Página não encontrada</h1>
      <p className="mb-8 text-(--color-text-dim)">
        O projeto ou a página que você procura não existe ou foi removida.
      </p>
      <Link
        href="/"
        className="rounded-full bg-(--color-accent) px-5 py-3 text-sm font-semibold text-black"
      >
        Voltar para o catálogo
      </Link>
    </div>
  );
}
