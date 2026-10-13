import { describe, it, expect } from 'vitest';
import { HERO_STATS, DEFAULT_HERO_COPY } from '../components/hero-config';

describe('Assessment content', () => {
  it('preserves the original default welcome headline', () => {
    expect(DEFAULT_HERO_COPY.headline).toBe('WELCOME ITZ FIZZ');
  });
  it('preserves precision at 95%', () => {
    expect(HERO_STATS.find(s => s.label === 'Precision Driven')?.value).toBe('95%');
  });
  it('preserves performance at 87%', () => {
    expect(HERO_STATS.find(s => s.label === 'Performance Focused')?.value).toBe('87%');
  });
  it('preserves innovation at 92%', () => {
    expect(HERO_STATS.find(s => s.label === 'Innovation Powered')?.value).toBe('92%');
  });
});