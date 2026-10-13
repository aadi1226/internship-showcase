import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { useRouter } from '@tanstack/react-router';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { getAssessment } from '@/lib/assessment.functions';
import { DEFAULT_SITE_COPY, siteCopySchema } from '@/lib/assessment-schema';

const assessmentContext = createContext<{
  assessment: Awaited<ReturnType<typeof getAssessment>> | undefined;
  copy: typeof DEFAULT_SITE_COPY; user: User | null; loading: boolean; error: boolean;
  selectedId: string | undefined;
}>({ assessment: null, copy: DEFAULT_SITE_COPY, user: null, loading: false, error: false, selectedId: undefined });

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [selectedId, setSelectedId] = useState<string>();
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const search = router.state.location.search as { assessment?: string };
  const queryClient = useQueryClient();
  const load = useServerFn(getAssessment);
  useEffect(() => { setSelectedId(search.assessment); }, [pathname, search.assessment]);
  const content = useQuery({ queryKey: ['assessment', selectedId], queryFn: () => load({ data: { id: selectedId } }) });
  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => { if (active) setUser(data.user); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!['SIGNED_IN', 'SIGNED_OUT', 'USER_UPDATED'].includes(event)) return;
      setUser(session?.user ?? null);
      void router.invalidate();
      if (event !== 'SIGNED_OUT') void queryClient.invalidateQueries();
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, [router, queryClient]);
  const parsed = siteCopySchema.safeParse(content.data?.copy);
  return <assessmentContext.Provider value={{ assessment: content.data, copy: parsed.success ? parsed.data : DEFAULT_SITE_COPY, user, selectedId, loading: content.isPending, error: content.isError }}>{children}</assessmentContext.Provider>;
}
export const useAssessment = () => useContext(assessmentContext);