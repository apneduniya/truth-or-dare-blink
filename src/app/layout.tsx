import type { Metadata } from "next";
import { Tilt_Neon } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Wallet } from "@/provider/WalletProvider";


const titleNeon = Tilt_Neon({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Truth & Dare",
  // description: "Truth & Dare",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={titleNeon.className}>
        <Wallet>
          <Navbar />
          {children}
        </Wallet>
      </body>
    </html>
  );
}
