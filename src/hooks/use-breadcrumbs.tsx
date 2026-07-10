'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/overview': [{ title: 'Dashboard', link: '/overview' }],
  '/overview/employee': [
    { title: 'Dashboard', link: '/overview' },
    { title: 'Employee', link: '/overview/employee' }
  ],
  '/overview/product': [
    { title: 'Dashboard', link: '/overview' },
    { title: 'Product', link: '/overview/product' }
  ],
  '/account/settings': [{ title: 'General', link: '/account/settings' }]
  // Add more custom mappings as needed
};

// Prisma ids are cuids: long lowercase alphanumeric strings. Route slugs
// (workspace, section names, ...) never look like this, so it's a safe way
// to spot a dynamic id segment anywhere in the path.
function isIdSegment(segment: string) {
  return /^[a-z0-9]{20,}$/i.test(segment);
}

// "projects" -> "project", "agent-profiles" -> "agent-profile"
function singularize(segment: string) {
  return segment.endsWith('s') ? segment.slice(0, -1) : segment;
}

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;

      // Whatever section of the app an id lands in (projects, checklists,
      // contexts, ...), label it after the resource it belongs to instead
      // of showing the raw id.
      const previousSegment = segments[index - 1];
      const label = isIdSegment(segment)
        ? singularize(previousSegment ?? segment)
        : segment;

      return {
        title: label.charAt(0).toUpperCase() + label.slice(1),
        link: path
      };
    });
  }, [pathname]);

  return breadcrumbs;
}
