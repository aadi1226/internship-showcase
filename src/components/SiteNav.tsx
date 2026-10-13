import { Link, useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowUpRight, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAssessment } from './AssessmentProvider';

export function SiteNav() {
  const { user, selectedId } = useAssessment();
  const cache = useQueryClient();
  const navigate = useNavigate();
  const search = selectedId ? { assessment: selectedId } : {};
  async function signOut() {
    await cache.cancelQueries(); cache.clear();
    const { error } = await supabase.auth.signOut();
    if (!error) await navigate({ to: '/auth', replace: true });
  }
  return <nav className="site-nav" aria-label="Main navigation">
    <Link to="/" search={search} className="font-display site-logo">ITZ FIZZ<span className="text-primary">.</span></Link>
    <div className="site-nav-links">
      <Button asChild variant="ghost" size="sm"><Link to="/projects" search={search}>Projects</Link></Button>
      <Button asChild variant="ghost" size="sm"><Link to="/skills" search={search}>Skills</Link></Button>
      <Button asChild variant="ghost" size="sm"><Link to="/application" search={search}>Apply <ArrowUpRight size={14} /></Link></Button>
      <Button asChild variant="outline" size="sm"><Link to={user ? '/dashboard' : '/auth'}>{user ? 'Dashboard' : 'Editor sign in'}</Link></Button>
      {user && <Button size="icon" variant="ghost" aria-label="Sign out" title="Sign out" onClick={signOut}><LogOut size={16} /></Button>}
    </div>
  </nav>;
}