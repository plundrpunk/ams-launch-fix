import { MotionConfig } from "motion/react";
import { nav } from "./content";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { SameTaskTwice } from "./components/SameTaskTwice";
import { MemoryTiers } from "./components/MemoryTiers";
import { Retrieval } from "./components/Retrieval";
import { Evidence } from "./components/Evidence";
import { Interfaces } from "./components/Interfaces";
import { Pricing } from "./components/Pricing";
import { Closing } from "./components/Closing";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div id="top" className="min-h-[100dvh] bg-bg text-ink">
        <a href="#content" className="skip-link">
          {nav.skip}
        </a>
        <Nav />
        <main id="content">
          <Hero />
          <SameTaskTwice />
          <MemoryTiers />
          <Retrieval />
          <Evidence />
          <Interfaces />
          <Pricing />
          <Closing />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
