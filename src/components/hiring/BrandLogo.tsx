import Image from "next/image";
import logo from "@/assets/brand/dark-mattr-logo.png";

/** The Dark Mattr logo, white mark and wordmark, for the dark pages. */
export function BrandLogo({ priority = false, className = "h-5 w-auto" }: { priority?: boolean; className?: string }) {
  return <Image src={logo} alt="Dark Mattr" priority={priority} sizes="120px" className={className} />;
}
