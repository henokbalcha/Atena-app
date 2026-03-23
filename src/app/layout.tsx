import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProviders } from "./theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Athena App Store | Premium Digital Portal",
  description: "The world's most innovative applications, refined through a lens of absolute clarity and precision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased selection:bg-accent-blue/30 selection:text-white bg-white dark:bg-black transition-colors duration-500`}
      >
        <ThemeProviders>
          <div className="min-h-screen relative">
            {children}
          </div>
        </ThemeProviders>
      </body>
    </html>
  );
}
