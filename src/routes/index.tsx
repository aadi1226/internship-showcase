import { createFileRoute } from "@tanstack/react-router";
import ScrollHero from "@/components/ScrollHero.jsx";
import { AssessmentSections } from '@/components/AssessmentSections';
import { publicSearch } from '@/lib/route-meta';

export const Route = createFileRoute("/")({
  validateSearch: publicSearch,
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
      <AssessmentSections />
    </main>
  );
}
