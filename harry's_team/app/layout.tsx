import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { getSiteSettings } from "@/models/SiteSettings";

// Fetch site settings at build time
async function getSiteMetadata(): Promise<{ title: string; description: string }> {
  try {
    const settings = await getSiteSettings();
    return {
      title: settings?.siteTitle || "PartyOrg - Community Events & Celebrations",
      description: settings?.siteDescription || "Bringing communities together through memorable events and celebrations."
    };
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return {
      title: "PartyOrg - Community Events & Celebrations",
      description: "Bringing communities together through memorable events and celebrations."
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const siteData = await getSiteMetadata();
  return {
    title: siteData.title,
    description: siteData.description,
  };
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
