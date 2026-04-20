import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI UI Tracker — Interface Evolution Archive",
  description: "Track how AI coding and design tools evolve their interfaces over time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg text-text antialiased">{children}</body>
    </html>
  );
}
