import { createFileRoute } from "@tanstack/react-router";
import ScrollHero from "@/components/ScrollHero.jsx";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Welcome Itz Fizz — Scroll-Driven Hero" },
      { name: "description", content: "A scroll-driven car hero animation built with React, Tailwind and GSAP ScrollTrigger." },
      { property: "og:title", content: "Welcome Itz Fizz — Scroll-Driven Hero" },
      { property: "og:description", content: "Scroll to drive the car and reveal the headline." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <ScrollHero />
      <section className="flex h-screen items-center justify-center px-6 text-center">
        <p className="font-display max-w-xl text-2xl tracking-[0.2em] text-muted-foreground">
          ENGINEERED FOR MOTION
        </p>
      </section>
    </main>
  );
}
