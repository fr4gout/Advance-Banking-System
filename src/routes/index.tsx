import { createFileRoute } from "@tanstack/react-router";
import { BankingApp } from "@/features/banking/BankingApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pacific Standard Bank — FiveM Banking" },
      { name: "description", content: "Premium FiveM NUI banking dashboard with accounts, transfers, and invoices." },
      { property: "og:title", content: "Pacific Standard Bank — FiveM Banking" },
      { property: "og:description", content: "Premium FiveM NUI banking dashboard with accounts, transfers, and invoices." },
    ],
  }),
  component: Index,
});

function Index() {
  return <BankingApp />;
}
