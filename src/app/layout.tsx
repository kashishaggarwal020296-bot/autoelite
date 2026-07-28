import type { Metadata } from "next";
import { Hanken_Grotesk, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import { Analytics } from "@/lib/analytics";
import { dealer } from "@/data/site.data";

const hanken = Hanken_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-hanken" });
const space = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-space" });

export const metadata: Metadata = {
  metadataBase: new URL(dealer.url),
  title: {
    default: "Autoelite — Authorized Ather Dealer in Bengaluru (Koramangala & HSR)",
    template: "%s | Autoelite",
  },
  description:
    "Autoelite is an authorized Ather dealer for south Bengaluru. Book a test ride, get your real on-road price, finance and service — Koramangala & HSR Layout.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Autoelite",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${hanken.variable} ${space.variable}`}>
      <body>
        <div className="page">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
        <MobileBar />
        <Analytics />
      </body>
    </html>
  );
}
