import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import car from "@/assets/car.png";

gsap.registerPlugin(ScrollTrigger);

const HEADLINE = "WELCOME ITZ FIZZ";

// Easy to edit placeholder stats
const STATS = [
  { value: "95%", label: "Precision Driven", tone: "stat-a" },
  { value: "87%", label: "Performance Focused", tone: "stat-b" },
  { value: "92%", label: "Innovation Powered", tone: "stat-c" },
];

export default function ScrollHero() {
  const root = useRef(null);

  useGSAP(
    () => {
      const letters = gsap.utils.toArray(".hero-letter");
      const stats = gsap.utils.toArray(".hero-stat");
      const carEl = root.current.querySelector(".hero-car");
      const trail = root.current.querySelector(".hero-trail");
      const road = root.current.querySelector(".hero-road");

      // Initial load animation
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from(road, { scaleX: 0, transformOrigin: "left", duration: 1 })
        .from(carEl, { xPercent: -40, opacity: 0, duration: 1.2 }, "-=0.6")
        .from(".hero-hint", { opacity: 0, y: 10, duration: 0.6 }, "-=0.4");

      // Scroll-driven animation (pinned)
      const getDistance = () => road.offsetWidth - carEl.offsetWidth;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=250%",
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      tl.to(carEl, { x: getDistance, ease: "none", duration: 1 }, 0);
      tl.to(trail, { width: () => getDistance() + carEl.offsetWidth / 2, ease: "none", duration: 1 }, 0);

      // Reveal letters as the car passes them
      letters.forEach((el, i) => {
        tl.fromTo(
          el,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" },
          (i / letters.length) * 0.9,
        );
      });

      stats.forEach((el, i) => {
        tl.fromTo(
          el,
          { opacity: 0, y: 40, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.15, ease: "power2.out" },
          0.25 + i * 0.25,
        );
      });

      tl.to(".hero-hint", { opacity: 0, duration: 0.1 }, 0);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="hero-section relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 hero-glow" aria-hidden />

      {/* Stats */}
      <div className="absolute inset-x-0 top-[8%] z-20 mx-auto grid max-w-5xl grid-cols-1 gap-3 px-6 sm:grid-cols-3 sm:gap-5">
        {STATS.map((s) => (
          <div key={s.label} className={`hero-stat ${s.tone} rounded-2xl p-5 opacity-0 sm:p-6`}>
            <p className="font-display text-4xl font-semibold sm:text-5xl">{s.value}</p>
            <p className="mt-1 text-sm uppercase tracking-[0.2em] opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Road + headline + car */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 sm:top-[62%]">
        <div className="hero-road relative h-[clamp(110px,18vw,220px)] w-full">
          <div className="hero-trail absolute left-0 top-0 h-full w-0" />
          <h1
            className="font-display absolute inset-0 z-10 flex items-center justify-center gap-[0.3em] px-4 text-[clamp(1.6rem,7vw,6.5rem)] font-bold text-primary-foreground"
            aria-label={HEADLINE}
          >
            {HEADLINE.split("").map((ch, i) => (
              <span key={i} className="hero-letter inline-block opacity-0" aria-hidden>
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </h1>
          <img
            src={car}
            alt="Yellow sports car viewed from above"
            width={1536}
            height={768}
            className="hero-car absolute left-0 top-1/2 z-20 h-[130%] w-auto -translate-y-1/2 drop-shadow-2xl"
          />
        </div>
      </div>

      <p className="hero-hint absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.4em] text-muted-foreground">
        Scroll to drive
      </p>
    </section>
  );
}
