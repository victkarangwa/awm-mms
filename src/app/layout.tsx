import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import AuthHeader from "@/components/AuthHead";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gad Family | AWM/ZTCC",
  description: "Easily check or register as a Gad family member at ZTCC Ngoma Parish.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <div className="flex justify-center items-center mt-6">
          <Image
            src="/gad_family.png"
            alt="Gad Family"
            width={150}
            height={150}
          />
        </div> */}
        <AuthHeader />
        {children}
        <LanguageSwitcher />
      </body>
    </html>
  );
}
