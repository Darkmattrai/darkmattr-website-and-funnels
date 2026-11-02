import { Contact } from "@/components/Contact";
import { Faq } from "@/components/Faq";
import { Fit } from "@/components/Fit";
import { Footer } from "@/components/Footer";
import { Forces } from "@/components/Forces";
import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { Marquee } from "@/components/Marquee";
import { Method } from "@/components/Method";
import { Nav } from "@/components/Nav";
import { Numbers } from "@/components/Numbers";
import { Universe } from "@/components/Universe";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <Forces />
        <Method />
        <Universe />
        <Numbers />
        <Fit />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
