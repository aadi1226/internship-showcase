import { z } from 'zod';

export const assessmentSchema = z.object({
  project: z.string().trim().min(3).max(120),
  details: z.string().trim().min(10).max(3000),
  skills: z.string().trim().min(2).max(1000),
  tone: z.enum(['Confident', 'Professional', 'Playful']),
});
export const siteCopySchema = z.object({
  headline: z.string(), supporting: z.string(), projectsTitle: z.string(), projectsCopy: z.string(),
  skillsTitle: z.string(), skillsCopy: z.string(), applicationTitle: z.string(), applicationCopy: z.string(),
});
export const applicationSchema = z.object({
  assessmentId: z.string().uuid(),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  portfolio: z.union([z.literal(''), z.string().trim().url().max(500).refine(v => /^https?:\/\//.test(v), 'Use an http or https link')]),
  skills: z.string().trim().min(2).max(1000),
  motivation: z.string().trim().min(10).max(3000),
  consent: z.literal(true),
});
export const DEFAULT_SITE_COPY = {
  headline: 'WELCOME ITZ FIZZ', supporting: '',
  projectsTitle: 'Built to move.', projectsCopy: 'A frontend assessment in motion. Explore the project and the thinking behind it.',
  skillsTitle: 'The tools behind the drive.', skillsCopy: 'React, JavaScript, Tailwind and GSAP come together in a scroll-driven automotive experience.',
  applicationTitle: 'Your next move.', applicationCopy: 'Bring your curiosity, your craft, and a project you are proud of.',
};
export type SiteCopy = z.infer<typeof siteCopySchema>;