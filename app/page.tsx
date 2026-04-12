import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Vision } from "@/components/sections/vision";
import { Impact } from "@/components/sections/impact";
import { Journey } from "@/components/sections/journey";
import { ThoughtLeadership } from "@/components/sections/thought-leadership";
import { Recognition } from "@/components/sections/recognition";
import { Connect } from "@/components/sections/connect";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Vision />
        <Impact />
        <Journey />
        <ThoughtLeadership />
        <Recognition />
        <Connect />
      </main>
      <Footer />
    </>
  );
}
