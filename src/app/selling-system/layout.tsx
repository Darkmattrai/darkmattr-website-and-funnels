import { Montserrat } from "next/font/google";

/** The hiring funnel wears darkmattr.co's brand: Montserrat, charcoal and chartreuse (see .theme-dm in globals.css). */
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });

export default function SellingSystemLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${montserrat.variable} theme-dm`}>{children}</div>;
}
