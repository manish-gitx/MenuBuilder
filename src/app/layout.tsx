import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

import { ToastProvider } from "@/components/ui/Toast";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MenuMaker - Beautiful Catering Menus Made Simple",
  description: "Create stunning digital catering menus in minutes. Professional, shareable, and always up-to-date.",
};

function ConditionalClerkProvider({ children }: { children: ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // Only wrap with ClerkProvider if we have a valid publishable key
  if (publishableKey && publishableKey.startsWith('pk_')) {
    return <ClerkProvider>{children}</ClerkProvider>;
  }
  
  // During build or without valid key, just return children
  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConditionalClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <main>
            {children}
          </main>
          <ToastProvider />
        </body>
      </html>
    </ConditionalClerkProvider>
  );
}
