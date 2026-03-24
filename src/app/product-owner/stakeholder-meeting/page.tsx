import type { Metadata } from "next";
import { StakeholderMeeting } from "@/components/po/StakeholderMeeting";

export const metadata: Metadata = {
  title: "The Stakeholder Meeting · Product Owner",
};

export default function StakeholderMeetingPage() {
  return <StakeholderMeeting />;
}
