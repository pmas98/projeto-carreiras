import type { Metadata } from "next";
import { TicketCreationKanban } from "@/components/po/TicketCreationKanban";

export const metadata: Metadata = {
  title: "Ticket Creation · Product Owner",
};

export default function TicketCreationPage() {
  return <TicketCreationKanban />;
}
