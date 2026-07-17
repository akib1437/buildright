import "./globals.css";
import { Archivo, Inter, IBM_Plex_Mono } from "next/font/google";
import { SITE } from "@/lib/constants";

const display = Archivo({ subsets: ["latin"], weight: ["500", "700", "800", "900"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export const metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description:
    "Licensed home repairs, full remodels and additions. Book a visit online in under a minute.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
