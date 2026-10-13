import { createFileRoute } from '@tanstack/react-router';
import { AssessmentSections } from '@/components/AssessmentSections';
import { pageHead, publicSearch } from '@/lib/route-meta';
export const Route = createFileRoute('/projects')({ validateSearch: publicSearch, head: () => pageHead('Projects', 'Explore the internship assessment project and its creative brief.'), component: () => <AssessmentSections section="projects" /> });