import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ProgressHydrator } from "@/components/ProgressHydrator";
import { PostHogProvider } from "@/components/PostHogProvider";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { FeedbackWidget } from "@/components/FeedbackWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Formação de Carreiras",
  description:
    "Uma simulação educacional das funções de Product Owner, DevOps, Frontend e Backend.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50">
        <PostHogProvider>
          <AnalyticsTracker />
          <div className="relative flex min-h-screen flex-col">
            <div className="fixed inset-0 bg-dot-grid pointer-events-none" />
            <div className="relative flex flex-1 flex-col">
              <ProgressHydrator>{children}</ProgressHydrator>
            </div>
            <FeedbackWidget />
          </div>
        </PostHogProvider>
      </body>
    </html>
  );
}
