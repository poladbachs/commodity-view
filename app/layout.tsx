import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import { ConvexClerkProvider } from "./providers";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CommodityView — Pre-Shipment Document Intelligence",
  description:
    "Upload COA and contract PDFs. CommodityView extracts all quality parameters and returns a COMPLIANT or NON_COMPLIANT verdict with full source traceability in under 30 seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} h-full antialiased`}
      style={{ colorScheme: "dark" }}
    >
      <body
        className="min-h-full flex flex-col font-sans"
        style={{ backgroundColor: "#0A0F1E", color: "#E8EDF5" }}
      >
        <ClerkProvider>
          <ConvexClerkProvider>
            <Navbar />
            <div className="flex-1">{children}</div>
          </ConvexClerkProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
