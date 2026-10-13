import { createFileRoute } from '@tanstack/react-router';
import { ApplicationForm } from '@/components/ApplicationForm';
import { pageHead, publicSearch } from '@/lib/route-meta';
export const Route = createFileRoute('/application')({ validateSearch: publicSearch, head: () => pageHead('Internship application', 'Submit your experience, skills and portfolio for internship review.'), component: ApplicationForm });