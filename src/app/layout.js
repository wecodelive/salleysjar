import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Salley's Jar - Pastry Delivery",
  description: "Fresh pastries delivered to your doorstep. Order from Salley's Jar exclusive selection of baked goods, proteins, drinks, and ready-made mixes. Same-day delivery available.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
      <Analytics />
    </html>
  );
}
