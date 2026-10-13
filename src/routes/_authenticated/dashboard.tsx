import { createFileRoute } from '@tanstack/react-router';
import { EditorDashboard } from '@/components/EditorDashboard';
import { pageHead } from '@/lib/route-meta';
export const Route = createFileRoute('/_authenticated/dashboard')({ head: () => pageHead('Applicant dashboard', 'Manage assessment details and privately review internship applications.'), component: EditorDashboard });