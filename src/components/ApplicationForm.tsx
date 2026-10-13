import { useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { useAssessment } from './AssessmentProvider';
import { applicationSchema } from '@/lib/assessment-schema';
import { submitApplication } from '@/lib/assessment.functions';

export function ApplicationForm() {
  const { assessment, copy, loading, error: loadError } = useAssessment();
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [consent, setConsent] = useState(false);
  const submit = useServerFn(submitApplication);
  async function apply(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = applicationSchema.safeParse({ ...Object.fromEntries(form), assessmentId: assessment?.id, consent });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Check your details.'); return; }
    setBusy(true); setError('');
    try { const result = await submit({ data: parsed.data }); if (result.ok) setSent(true); else setError(result.error); }
    catch { setError('Your application could not be submitted. Your details are still here.'); }
    finally { setBusy(false); }
  }
  return <main className="content-page application-page"><p className="eyebrow">INTERNSHIP / APPLICATION</p><h1 className="page-title font-display">{copy.applicationTitle}</h1><p className="page-intro">{copy.applicationCopy}</p>
    {sent ? <div className="submission-success" role="status"><CheckCircle2 size={40} /><h2 className="font-display">Application received.</h2><p>Thank you. Your details are ready for the project editor to review.</p></div> : loading ? <p>Loading project…</p> : !assessment || loadError ? <p className="empty-state">{loadError ? 'The project could not be loaded. Please refresh and try again.' : 'Applications will open once an editor publishes an assessment.'}</p> : <form className="copy-form applicant-form" onSubmit={apply}>
      <p className="application-project">Applying to <strong>{assessment.project}</strong></p>
      <div className="form-grid"><label>Full name<input name="name" required minLength={2} maxLength={100} autoComplete="name" /></label><label>Email address<input name="email" type="email" required maxLength={255} autoComplete="email" /></label></div>
      <label>Portfolio or résumé link <span className="text-muted-foreground">(optional)</span><input name="portfolio" type="url" maxLength={500} placeholder="https://" /></label>
      <label>Your skills<input name="skills" required minLength={2} maxLength={1000} placeholder="React, JavaScript, animation…" /></label>
      <label>Why this internship?<textarea name="motivation" required minLength={10} maxLength={3000} rows={5} /></label>
      <label className="consent-row"><Checkbox checked={consent} onCheckedChange={v => setConsent(v === true)} aria-label="Allow the project editor to review my application" /><span>I agree to share these details with this project’s editor for application review.</span></label>
      {error && <p role="alert" className="text-destructive">{error}</p>}
      <Button type="submit" disabled={busy || !consent}>{busy ? 'Submitting…' : 'Submit application'}<ArrowRight /></Button>
    </form>}
  </main>;
}