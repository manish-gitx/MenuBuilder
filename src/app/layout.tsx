import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/components/ui/Toast";

// Inter font - matches Swiggy's typography
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Full range for precise matching
});

export const metadata: Metadata = {
  title: "MenuMaker - Beautiful Catering Menus Made Simple",
  description:
    "Create stunning digital catering menus in minutes. Professional, shareable, and always up-to-date.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.variable} font-inter antialiased`}>
          <main>{children}</main>
          <ToastProvider />
        </body>
      </html>
    </ClerkProvider>
  );
}