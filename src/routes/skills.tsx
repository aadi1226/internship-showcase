import { createFileRoute } from '@tanstack/react-router';
import { AssessmentSections } from '@/components/AssessmentSections';
import { pageHead, publicSearch } from '@/lib/route-meta';
export const Route = createFileRoute('/skills')({ validateSearch: publicSearch, head: () => pageHead('Skills', 'Discover the skills and technologies behind the internship assessment.'), component: () => <AssessmentSections section="skills" /> });