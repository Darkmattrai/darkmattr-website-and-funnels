import Image from "next/image";
import logo from "@/assets/brand/dark-mattr-logo.png";

/** The Dark Mattr logo as used on darkmattr.co (white mark + wordmark). */
export function BrandLogo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return <Image src={logo} alt="Dark Mattr" priority={priority} sizes="220px" className={className} />;
}
