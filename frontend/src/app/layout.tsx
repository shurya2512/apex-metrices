import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import F1ScrollTracker from "@/components/F1ScrollTracker";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ApexMetrics | Motorsport Telemetry Dashboard",
  description:
    "Real-time F1 telemetry analysis. Compare driver lap data, monitor live timing, and explore historical race sessions with precision engineering.",
  keywords: ["F1", "Formula 1", "telemetry", "motorsport", "racing", "data analysis"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${firaCode.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-am-bg text-am-text antialiased">
        <Navbar />
        <main className="flex flex-1 flex-col">{children}</main>
        <F1ScrollTracker />
      </body>
    </html>
  );
}
