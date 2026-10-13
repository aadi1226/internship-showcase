import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { Link } from '@tanstack/react-router';
import { Sparkles, ArrowUpRight, RefreshCw, Inbox, Copy } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { getEditorData, reviewApplication, saveAssessment } from '@/lib/assessment.functions';
import { assessmentSchema } from '@/lib/assessment-schema';

export function EditorDashboard() {
  const cache = useQueryClient();
  const load = useServerFn(getEditorData);
  const save = useServerFn(saveAssessment);
  const review = useServerFn(reviewApplication);
  const query = useQuery({ queryKey: ['editor'], queryFn: () => load() });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<string | null>(null);
  const [reviewBusy, setReviewBusy] = useState(false);
  const data = query.data;
  const applicant = data?.applications.find(a => a.id === selected);
  async function publish(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setMessage('');
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = assessmentSchema.safeParse(fields);
    const displayName = String(fields.displayName ?? '').trim();
    if (!parsed.success || displayName.length < 2 || displayName.length > 100) { setError('Check your name and project details.'); return; }
    setBusy(true);
    try {
      const result = await save({ data: { ...parsed.data, displayName } });
      if (result.error) setError(result.error);
      else { await cache.invalidateQueries(); setMessage('Published. Your hero, project, skills and application copy are up to date.'); }
    } catch { setError('Your project could not be published. Your details are still here.'); }
    finally { setBusy(false); }
  }
  async function updateStatus(status: 'New' | 'Shortlisted' | 'Reviewed') {
    if (!applicant) return;
    setReviewBusy(true); setError('');
    try { await review({ data: { id: applicant.id, status } }); await cache.invalidateQueries({ queryKey: ['editor'] }); }
    catch { setError('The review status could not be saved.'); }
    finally { setReviewBusy(false); }
  }
  return <main className="content-page dashboard-page"><div className="dashboard-heading"><div><p className="eyebrow">EDITOR / WORKSPACE</p><h1 className="page-title font-display">Your assessment.</h1></div><Button variant="ghost" aria-label="Refresh applications" title="Refresh applications" onClick={() => query.refetch()}><RefreshCw size={18} /></Button></div>
    {query.isPending ? <p>Loading workspace…</p> : query.isError ? <p role="alert">Your workspace could not be loaded. Please refresh.</p> : <>
      <section className="editor-section"><div className="section-heading"><h2 className="font-display">Project details</h2>{data?.assessment && <div className="flex flex-wrap gap-2"><Button asChild variant="outline" size="sm"><Link to="/" search={{ assessment: data.assessment.id }}>View your site <ArrowUpRight /></Link></Button><Button variant="ghost" size="sm" onClick={async () => { try { await navigator.clipboard.writeText(`${window.location.origin}/?assessment=${data.assessment?.id}`); setMessage('Project link copied.'); } catch { setError('The link could not be copied. Open your site and copy its address.'); } }}><Copy /> Copy link</Button></div>}</div>
      <form onSubmit={publish} className="copy-form editor-form" key={data?.assessment?.updated_at ?? 'new'}>
        <div className="form-grid"><label>Editor display name<input name="displayName" required minLength={2} maxLength={100} defaultValue={data?.profile?.display_name ?? ''} autoComplete="name" /></label><label>Project name<input name="project" required minLength={3} maxLength={120} defaultValue={data?.assessment?.project ?? ''} placeholder="Your internship assessment" /></label></div>
        <label>Project details<textarea name="details" required minLength={10} maxLength={3000} rows={4} defaultValue={data?.assessment?.details ?? ''} placeholder="The project, its purpose, audience and what applicants will build" /></label>
        <div className="form-grid"><label>Skills <span className="text-muted-foreground">(comma separated)</span><input name="skills" required minLength={2} maxLength={1000} defaultValue={data?.assessment?.skills ?? 'React, JavaScript, Tailwind, GSAP, ScrollTrigger'} /></label><label>Tone<select name="tone" defaultValue={data?.assessment?.tone ?? 'Confident'}><option>Confident</option><option>Professional</option><option>Playful</option></select></label></div>
        <Button type="submit" disabled={busy}><Sparkles />{busy ? 'Generating and publishing…' : 'Generate copy & publish'}</Button>
      </form></section>
      {message && <p role="status" className="save-message">{message}</p>}{error && <p role="alert" className="text-destructive">{error}</p>}
      <section className="review-section"><div className="section-heading"><div><p className="eyebrow">PRIVATE / APPLICANT REVIEW</p><h2 className="font-display">Applications <span className="text-muted-foreground">({data?.applications.length ?? 0})</span></h2></div><label className="review-filter">Status<select value={filter} onChange={e => setFilter(e.target.value)}><option>All</option><option>New</option><option>Shortlisted</option><option>Reviewed</option></select></label></div>
      {data?.applications.length ? <div className="applicant-list">{data.applications.filter(a => filter === 'All' || a.status === filter).map(a => <article key={a.id} className="applicant-row"><div><h3 className="font-display">{a.name}</h3><p>{a.skills}</p><span className="text-muted-foreground text-xs">{new Date(a.created_at).toLocaleDateString()}</span></div><div className="applicant-actions"><span className="applicant-status">{a.status}</span><Button variant="outline" size="sm" onClick={() => setSelected(a.id)}>Review <ArrowUpRight /></Button></div></article>)}{!data.applications.some(a => filter === 'All' || a.status === filter) && <p className="empty-state">No applications with this status.</p>}</div> : <div className="empty-state"><Inbox /><p>No applications yet.</p><p>{data?.assessment ? 'Share your project link to receive applications.' : 'Publish your assessment to open applications.'}</p></div>}
      </section>
    </>}
    <Dialog open={Boolean(applicant)} onOpenChange={open => { if (!open) setSelected(null); }}><DialogContent className="copy-dialog"><DialogHeader><DialogTitle>{applicant?.name}</DialogTitle><DialogDescription>Internship application</DialogDescription></DialogHeader>{applicant && <><dl className="applicant-details"><dt>Email</dt><dd>{applicant.email}</dd><dt>Skills</dt><dd>{applicant.skills}</dd><dt>Motivation</dt><dd className="whitespace-pre-wrap">{applicant.motivation}</dd>{applicant.portfolio && <><dt>Portfolio / résumé</dt><dd><a href={applicant.portfolio} target="_blank" rel="noopener noreferrer" className="text-primary">Open portfolio ↗</a></dd></>}</dl><label className="review-filter">Review status<select disabled={reviewBusy} value={applicant.status} onChange={e => updateStatus(e.target.value as 'New' | 'Shortlisted' | 'Reviewed')}><option>New</option><option>Shortlisted</option><option>Reviewed</option></select></label>{error && <p role="alert" className="text-destructive">{error}</p>}</>}</DialogContent></Dialog>
  </main>;
}