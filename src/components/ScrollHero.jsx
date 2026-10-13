import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroCopyEditor from "./HeroCopyEditor";
import car from "@/assets/car.png";

gsap.registerPlugin(ScrollTrigger);
const DEFAULT_COPY = { headline: "WELCOME ITZ FIZZ", supporting: "" };
const STATS = [
  { value: "95%", label: "Precision Driven", tone: "stat-a" },
  { value: "87%", label: "Performance Focused", tone: "stat-b" },
  { value: "92%", label: "Innovation Powered", tone: "stat-c" },
];

export default function ScrollHero() {
  const root = useRef(null);
  const trigger = useRef(null);
  const [copy, setCopy] = useState(DEFAULT_COPY);
  useGSAP(() => {
    const section = root.current;
    if (!section) return;
    const carEl = section.querySelector(".hero-car");
    const road = section.querySelector(".hero-road");
    const media = gsap.matchMedia();
    media.add({ normal: "(prefers-reduced-motion: no-preference)", reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
      const reduced = context.conditions.reduced;
      if (!reduced) {
        // Entrance owns opacity only; scroll exclusively owns the car transform.
        gsap.from(carEl, { opacity: 0.25, duration: 0.65, ease: "power2.out" });
        gsap.from(".hero-heading, .hero-supporting", { opacity: 0, y: 12, duration: 0.65 });
        gsap.from(".hero-stat", { opacity: 0, y: 12, stagger: 0.12, duration: 0.6 });
      }
      const distance = () => Math.max(0, road.clientWidth - carEl.clientWidth);
      const timeline = gsap.timeline({ scrollTrigger: {
        trigger: section, start: "top top", end: () => `+=${window.innerHeight * 1.8}`,
        pin: !reduced, scrub: true, invalidateOnRefresh: true,
      } });
      trigger.current = timeline.scrollTrigger;
      timeline.fromTo(".hero-progress", { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "none" }, 0);
      if (!reduced) {
        timeline.fromTo(carEl, { x: 0 }, { x: distance, duration: 1, ease: "none" }, 0);
        timeline.fromTo(".hero-trail", { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "none" }, 0);
      }
    });
    const refresh = () => ScrollTrigger.refresh();
    carEl.addEventListener("load", refresh);
    if (carEl.complete) refresh();
    document.fonts?.ready.then(() => { if (section.isConnected) refresh(); });
    return () => { carEl.removeEventListener("load", refresh); media.revert(); trigger.current = null; };
  }, { scope: root });

  const replay = () => window.scrollTo({ top: trigger.current?.start ?? 0, behavior: "instant" });
  return <section ref={root} className="hero-section">
    <div className="hero-progress" aria-hidden="true" />
    <header className="hero-tools"><span className="hero-brand">ITZ FIZZ</span><HeroCopyEditor onApply={setCopy} onReset={() => setCopy(DEFAULT_COPY)} /></header>
    <div className="hero-stats">
      {STATS.map(s => <div key={s.label} className={`hero-stat ${s.tone}`}><p className="stat-value font-display">{s.value}</p><p className="stat-label">{s.label}</p></div>)}
    </div>
    <div className="hero-title-block">
      <h1 className="hero-heading font-display">{copy.headline.split(" ").map((word, i) => <span key={i}>{word}</span>)}</h1>
      {copy.supporting && <p className="hero-supporting">{copy.supporting}</p>}
    </div>
    <div className="hero-road"><div className="hero-trail" aria-hidden="true" /><img src={car} alt="Yellow sports car viewed from above" width={1536} height={768} className="hero-car" /></div>
    <footer className="hero-footer"><span className="hero-hint"><ArrowDown size={16} /> Scroll to drive</span><Button variant="ghost" size="sm" onClick={replay}><RotateCcw /> Replay Animation</Button></footer>
  </section>;
}
