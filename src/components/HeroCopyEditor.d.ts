import type { ReactElement, FormEvent } from 'react';
declare const HeroCopyEditor: (props: {
  onPublish: (event: FormEvent<HTMLFormElement>) => void;
  busy: boolean;
  assessment?: { project: string; details: string; skills: string; tone: string } | null;
  displayName: string;
}) => ReactElement;
export default HeroCopyEditor;