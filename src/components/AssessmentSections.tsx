import { Link } from '@tanstack/react-router';
import { ArrowUpRight, Code2, MoveRight } from 'lucide-react';
import { Button } from './ui/button';
import { useAssessment } from './AssessmentProvider';
import car from '@/assets/car.png';

export function AssessmentSections({ section }: { section?: 'projects' | 'skills' }) {
  const { assessment, copy, selectedId, error } = useAssessment();
  const skills = (assessment?.skills ?? 'React, JavaScript, Tailwind, GSAP, ScrollTrigger').split(',').map(s => s.trim()).filter(Boolean);
  const search = selectedId ? { assessment: selectedId } : {};
  return <main className={section ? 'content-page' : 'assessment-sections'}>
    {error && <p role="alert" className="content-error">Saved details are unavailable. Please refresh to try again.</p>}
    {(!section || section === 'projects') && <section className="section-band">
      <div className="section-heading"><p className="eyebrow">01 / THE PROJECT</p><h2 className="page-title font-display">{copy.projectsTitle}</h2><p className="page-intro">{copy.projectsCopy}</p></div>
      <article className="project-row"><div className="project-art"><img src={car} alt="Top-down yellow sports car from the scroll-driven project" /></div><div className="project-detail"><span className="eyebrow">INTERNSHIP ASSESSMENT</span><h3 className="font-display">{assessment?.project ?? 'Scroll-driven automotive hero'}</h3><p>{assessment?.details ?? 'An interactive automotive experience with a scroll-driven car, clear typography, and precision motion.'}</p><Button asChild variant="outline"><Link to="/" search={search}>View experience <ArrowUpRight /></Link></Button></div></article>
    </section>}
    {(!section || section === 'skills') && <section className="section-band skills-band">
      <div className="section-heading"><p className="eyebrow">02 / THE SKILLS</p><h2 className="page-title font-display">{copy.skillsTitle}</h2><p className="page-intro">{copy.skillsCopy}</p></div>
      <div className="skills-grid">{skills.map((skill, i) => <div className="skill-item" key={`${skill}-${i}`}><span className="skill-number">{String(i + 1).padStart(2, '0')}</span><Code2 size={24} /><h3 className="font-display">{skill}</h3></div>)}</div>
    </section>}
    {!section && <section className="section-band application-band"><p className="eyebrow">03 / THE OPPORTUNITY</p><h2 className="page-title font-display">{copy.applicationTitle}</h2><p className="page-intro">{copy.applicationCopy}</p><Button asChild><Link to="/application" search={search}>Apply for the internship <MoveRight /></Link></Button></section>}
  </main>;
}