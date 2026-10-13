import { useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { Sparkles, Check, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { generateHeroCopy } from '@/lib/hero-copy.functions';

export default function HeroCopyEditor({ onApply, onReset }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const generate = useServerFn(generateHeroCopy);
  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true); setError(''); setResult('');
    try {
      const response = await generate({ data: { project: form.get('project'), details: form.get('details'), tone: form.get('tone') } });
      setResult(response.text); setError(response.error);
    } catch { setError('Copy generation could not finish. Your details have been kept.'); }
    finally { setBusy(false); }
  }
  return <Dialog open={open} onOpenChange={(value) => { if (!busy) setOpen(value); }}>
    <DialogTrigger asChild><Button variant="ghost" size="sm"><Sparkles /> AI copy editor</Button></DialogTrigger>
    <DialogContent className="copy-dialog">
      <DialogHeader><DialogTitle>Internship project copy</DialogTitle><DialogDescription>Draft preview · Changes last for this visit only.</DialogDescription></DialogHeader>
      <form onSubmit={submit} className="copy-form">
        <label>Project name<input name="project" required minLength={3} maxLength={120} placeholder="Scroll-driven automotive hero" /></label>
        <label>Project details<textarea name="details" required minLength={10} maxLength={3000} rows={4} placeholder="Your goal, audience, technologies, and what makes the project distinctive" /></label>
        <label>Tone<select name="tone"><option>Confident</option><option>Professional</option><option>Playful</option></select></label>
        <Button type="submit" disabled={busy}><Sparkles />{busy ? 'Generating…' : 'Generate copy'}</Button>
      </form>
      <div aria-live="polite">{error && <p role="alert" className="text-destructive text-sm">{error}</p>}{result && <div className="copy-result"><p className="whitespace-pre-line">{result}</p><Button className="mt-4" onClick={() => { const lines = result.split('\n').map(line => line.trim()).filter(Boolean); onApply({ headline: lines[0].slice(0, 64), supporting: lines.slice(1).join(' ') }); setOpen(false); }}><Check /> Preview on hero</Button></div>}</div>
      <Button variant="ghost" onClick={() => { onReset(); setOpen(false); }} disabled={busy}><RotateCcw /> Restore original copy</Button>
    </DialogContent>
  </Dialog>;
}