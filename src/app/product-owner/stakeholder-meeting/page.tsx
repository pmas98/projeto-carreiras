import type { Metadata } from "next";
import { StakeholderMeeting } from "@/components/po/StakeholderMeeting";

export const metadata: Metadata = {
  title: "Reunião de Stakeholder · Product Owner",
};

export default function StakeholderMeetingPage() {
  return <StakeholderMeeting />;
}
