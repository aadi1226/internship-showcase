import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroCopyEditor({ onPublish, busy, assessment, displayName }) {
  return <form onSubmit={onPublish} className="copy-form editor-form">
    <fieldset disabled={busy} className="copy-form">
      <div className="form-grid"><label>Editor display name<input name="displayName" required minLength={2} maxLength={100} defaultValue={displayName} autoComplete="name" /></label><label>Project name<input name="project" required minLength={3} maxLength={120} defaultValue={assessment?.project ?? ''} placeholder="Your internship assessment" /></label></div>
      <label>Project details<textarea name="details" required minLength={10} maxLength={3000} rows={4} defaultValue={assessment?.details ?? ''} placeholder="The project, its purpose, audience and what applicants will build" /></label>
      <div className="form-grid"><label>Skills <span className="text-muted-foreground">(comma separated)</span><input name="skills" required minLength={2} maxLength={1000} defaultValue={assessment?.skills ?? 'React, JavaScript, Tailwind, GSAP, ScrollTrigger'} /></label><label>Tone<select name="tone" defaultValue={assessment?.tone ?? 'Confident'}><option>Confident</option><option>Professional</option><option>Playful</option></select></label></div>
      <Button type="submit" disabled={busy}><Sparkles />{busy ? 'Generating and publishing…' : 'Generate copy & publish'}</Button>
    </fieldset>
  </form>;
}