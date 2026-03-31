import type { Metadata } from "next";
import { TicketCreationKanban } from "@/components/po/TicketCreationKanban";

export const metadata: Metadata = {
  title: "Criação de Tickets · Product Owner",
};

export default function TicketCreationPage() {
  return <TicketCreationKanban />;
}
