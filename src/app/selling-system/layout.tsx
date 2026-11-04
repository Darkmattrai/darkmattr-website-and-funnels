import { Chewy, Montserrat } from "next/font/google";

/**
 * The hiring funnel wears the new claymation identity: Chewy for hand-rolled display type,
 * Montserrat for reading, a sunny plasticine palette (see .theme-clay in globals.css).
 */
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });
const chewy = Chewy({ subsets: ["latin"], weight: "400", variable: "--font-chewy", display: "swap" });

export default function SellingSystemLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${montserrat.variable} ${chewy.variable} theme-clay`}>
      {/* Stop-motion "boil": the edges of display type redraw a few times a second */}
      <svg aria-hidden width="0" height="0" className="absolute">
        <filter id="clay-boil">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="1">
            <animate attributeName="seed" values="1;4;7" dur="0.42s" calcMode="discrete" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      {children}
    </div>
  );
}
