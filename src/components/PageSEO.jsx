/**
 * @module components/PageSEO
 * @description Route-aware SEO component that resolves the current page key and
 * breadcrumb trail from the active URL and delegates head-tag injection to
 * SEOProvider.
 */
import { useLocation } from 'react-router-dom';
import { SEOProvider } from './SEOProvider';

/**
 * Page SEO component that automatically handles SEO based on current route.
 * @returns {JSX.Element}
 */
export function PageSEO() {
  const location = useLocation();

  // Determine page key based on current path
  const getPageKey = () => {
    if (location.pathname === '/') return 'home';
    if (location.pathname === '/demo') return 'demo';
    if (location.pathname.startsWith('/demo/')) return 'demo';
    return 'notFound';
  };

  // Generate breadcrumbs for demo pages
  const getBreadcrumbs = () => {
    const breadcrumbs = [{ name: 'Home', url: '/' }];

    if (location.pathname === '/demo') {
      breadcrumbs.push({ name: 'Component Demo', url: '/demo' });
    } else if (location.pathname.startsWith('/demo/')) {
      breadcrumbs.push({ name: 'Component Demo', url: '/demo' });
      const section = location.pathname.replace('/demo/', '');
      breadcrumbs.push({
        name: section.charAt(0).toUpperCase() + section.slice(1),
        url: location.pathname,
      });
    }

    return breadcrumbs;
  };

  const pageKey = getPageKey();
  const breadcrumbs = getBreadcrumbs();

  return (
    <SEOProvider
      page={pageKey}
      breadcrumbs={breadcrumbs}
      meta={{
        url: `${import.meta.env.VITE_SITE_URL ?? ''}${location.pathname}`,
      }}
    />
  );
}

export default PageSEO;
