import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { lovable } from '@/integrations/lovable';
import { useAssessment } from '@/components/AssessmentProvider';
import { pageHead } from '@/lib/route-meta';
export const Route = createFileRoute('/auth')({ head: () => pageHead('Editor sign in', 'Sign in to manage your assessment and review internship applications.'), component: AuthPage });
function AuthPage() {
  const { user } = useAssessment();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (user) void navigate({ to: '/dashboard', replace: true }); }, [user, navigate]);
  async function signIn() {
    setBusy(true); setError('');
    try {
      const result = await lovable.auth.signInWithOAuth('google', { redirect_uri: `${window.location.origin}/auth` });
      if (result.error) setError(result.error.message);
    } catch { setError('Sign-in could not finish. Please try again.'); }
    finally { setBusy(false); }
  }
  return <main className="content-page auth-page"><p className="eyebrow">EDITOR ACCESS</p><h1 className="page-title font-display">Behind the wheel.</h1><p className="page-intro">Your assessment. Your applicants.</p><Button onClick={signIn} disabled={busy}>Continue with Google <ArrowRight /></Button>{error && <p role="alert" className="text-destructive">{error}</p>}</main>;
}