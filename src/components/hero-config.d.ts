export interface HeroStatistic {
  value: string;
  label: string;
  tone: string;
}

export const HERO_STATS: HeroStatistic[];
export const DEFAULT_HERO_COPY: {
  headline: string;
  supporting: string;
};