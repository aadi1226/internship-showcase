import { createServerFn } from '@tanstack/react-start';
import { getRequest, setResponseHeader } from '@tanstack/react-start/server';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { applicationSchema, assessmentSchema } from './assessment-schema';

export const getAssessment = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ id: z.string().uuid().optional() }))
  .handler(async ({ data }) => {
    const { publicClient } = await import('./assessment-public.server');
    let query = publicClient().from('assessments').select('id, project, details, skills, tone, copy, updated_at').order('updated_at', { ascending: false }).limit(1);
    if (data.id) query = query.eq('id', data.id);
    const { data: rows, error } = await query;
    if (error) throw new Error('Project details could not be loaded.');
    return rows?.[0] ?? null;
  });

export const getEditorData = createServerFn({ method: 'GET' }).middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    setResponseHeader('Cache-Control', 'no-store');
    const [assessment, profile] = await Promise.all([
      context.supabase.from('assessments').select('*').eq('owner_id', context.userId).maybeSingle(),
      context.supabase.from('profiles').select('display_name').eq('id', context.userId).maybeSingle(),
    ]);
    if (assessment.error || profile.error) throw new Error('Editor details could not be loaded.');
    const applications = assessment.data
      ? await context.supabase.from('applications').select('*').eq('assessment_id', assessment.data.id).order('created_at', { ascending: false })
      : { data: [], error: null };
    if (applications.error) throw new Error('Applications could not be loaded.');
    return { assessment: assessment.data, profile: profile.data, applications: applications.data ?? [] };
  });

export const saveAssessment = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator(assessmentSchema.extend({ displayName: z.string().trim().min(2).max(100) }))
  .handler(async ({ data, context }) => {
    setResponseHeader('Cache-Control', 'no-store');
    const { generateSiteCopy } = await import('./ai/site-copy.server');
    const generated = await generateSiteCopy(getRequest(), data);
    if (generated.error || !generated.copy) return { assessment: null, error: generated.error };
    const { displayName, ...details } = data;
    const profile = await context.supabase.from('profiles').upsert({ id: context.userId, display_name: displayName });
    if (profile.error) return { assessment: null, error: 'Your profile could not be saved.' };
    const saved = await context.supabase.from('assessments').upsert({ ...details, owner_id: context.userId, copy: generated.copy, updated_at: new Date().toISOString() }, { onConflict: 'owner_id' }).select('id').single();
    if (saved.error) return { assessment: null, error: 'Project details could not be saved. Please try again.' };
    return { assessment: saved.data, error: '' };
  });

export const submitApplication = createServerFn({ method: 'POST' }).inputValidator(applicationSchema)
  .handler(async ({ data }) => {
    // Guest submissions intentionally belong to the selected assessment, not an applicant account.
    const { publicClient } = await import('./assessment-public.server');
    const client = publicClient();
    const request = getRequest();
    const bearer = request.headers.get('Authorization');
    if (bearer) {
      if (!bearer.startsWith('Bearer ')) throw new Error('Please sign in again or submit signed out.');
      const verified = await client.auth.getUser(bearer.slice(7));
      if (verified.error || !verified.data.user) throw new Error('Please sign in again or submit signed out.');
    }
    const { assessmentId, consent: _consent, ...fields } = data;
    const { error } = await client.from('applications').insert({ ...fields, assessment_id: assessmentId });
    return error ? { ok: false, error: 'Your application could not be submitted. Please try again.' } : { ok: true, error: '' };
  });

export const reviewApplication = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid(), status: z.enum(['New', 'Shortlisted', 'Reviewed']) }))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase.from('applications').update({ status: data.status }).eq('id', data.id).select('id');
    if (error || !rows?.length) throw new Error('This application could not be updated.');
    return { ok: true };
  });