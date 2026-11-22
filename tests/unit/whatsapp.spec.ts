import { expect, test } from "vitest";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

test("similar-project intent includes the project title", () => {
  const url = buildWhatsAppUrl({ title: "Aurora Hospedagens" }, "similar-project");
  expect(url).toBe(
    "https://wa.me/5583986497309?text=" +
      encodeURIComponent(
        "Olá, conheci o projeto Aurora Hospedagens no catálogo da ONZEMIL e gostaria de desenvolver uma solução semelhante para minha empresa.",
      ),
  );
});

test("general-budget intent has no project name", () => {
  const url = buildWhatsAppUrl(undefined, "general-budget");
  expect(url).toBe(
    "https://wa.me/5583986497309?text=" +
      encodeURIComponent("Olá, vi o portfólio da ONZEMIL e quero um orçamento."),
  );
});
