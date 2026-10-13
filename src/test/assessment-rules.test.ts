import { describe, expect, it } from 'vitest';
import { applicationSchema, assessmentSchema } from '@/lib/assessment-schema';

const application = { assessmentId: 'f3a37266-dc1f-4c9e-8c50-a9dd1bd0a37c', name: 'Applicant Test', email: 'applicant@example.com', portfolio: 'https://example.com', skills: 'React', motivation: 'I enjoy building interactive websites.', consent: true };
describe('Connected assessment and applicant rules', () => {
  it('requires applicant consent before submission', () => {
    expect(applicationSchema.safeParse(application).success).toBe(true);
    expect(applicationSchema.safeParse({ ...application, consent: false }).success).toBe(false);
  });
  it('rejects portfolio links that can execute code', () => {
    expect(applicationSchema.safeParse({ ...application, portfolio: 'javascript:alert(1)' }).success).toBe(false);
  });
  it('requires the same brief and skills to generate the connected site', () => {
    const details = { project: 'Automotive assessment', details: 'Build a scroll-driven car experience.', skills: 'React, GSAP', tone: 'Confident' };
    expect(assessmentSchema.safeParse(details).success).toBe(true);
    expect(assessmentSchema.safeParse({ ...details, skills: '' }).success).toBe(false);
  });
});