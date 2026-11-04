import Image from "next/image";
import markCream from "@/assets/clay/mark-cream.webp";
import markInk from "@/assets/clay/mark-ink.webp";

/** Dark Mattr in clay: the sculpted mark plus the wordmark set in the display face. */
export function BrandLogo({
  tone = "ink",
  size = "md",
  priority = false,
  className = "",
}: {
  tone?: "ink" | "cream";
  size?: "sm" | "md" | "lg";
  priority?: boolean;
  className?: string;
}) {
  const h = { sm: "h-8", md: "h-9 md:h-10", lg: "h-12" }[size];
  const text = { sm: "text-[1.15rem]", md: "text-[1.25rem] md:text-[1.4rem]", lg: "text-[1.75rem]" }[size];
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Image src={tone === "ink" ? markInk : markCream} alt="" priority={priority} sizes="40px" className={`${h} w-auto`} />
      <span className={`clay-type clay-type-sm ${tone === "cream" ? "clay-type-chalk" : ""} ${text} leading-none`}>Dark Mattr</span>
    </span>
  );
}
