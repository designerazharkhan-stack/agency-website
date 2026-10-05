import { lazy, Suspense, useEffect, type ReactNode } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { NotFoundPage, RouteFallback } from '@/components/common/NotFoundPage'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { ContentProvider } from '@/context/ContentContext'
import { SharedZoneProvider, useSharedZone } from '@/context/SharedZoneContext'

const HomePage = lazy(() => import('@/pages/public/HomePage'))
const AboutPage = lazy(() => import('@/pages/public/AboutPage'))
const ServicesPage = lazy(() => import('@/pages/public/ServicesPage'))
const PortfolioPage = lazy(() => import('@/pages/public/PortfolioPage'))
const ProjectDetailPage = lazy(() => import('@/pages/public/ProjectDetailPage'))
const BlogPage = lazy(() => import('@/pages/public/BlogPage'))
const BlogArticlePage = lazy(() => import('@/pages/public/BlogArticlePage'))
const PricingPage = lazy(() => import('@/pages/public/PricingPage'))
const TestimonialsPage = lazy(() => import('@/pages/public/TestimonialsPage'))
const ContactPage = lazy(() => import('@/pages/public/ContactPage'))
const PrivacyPolicyPage = lazy(() =>
  import('@/pages/public/LegalPages').then((module) => ({ default: module.PrivacyPolicyPage })),
)
const TermsPage = lazy(() =>
  import('@/pages/public/LegalPages').then((module) => ({ default: module.TermsPage })),
)
const AdminRoutes = lazy(() => import('@/components/admin/AdminRoutes'))
const AdminDashboardRoute = lazy(() => import('@/components/admin/AdminDashboardRoute'))
const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'))
const DashboardOverviewPage = lazy(() => import('@/pages/admin/DashboardOverviewPage'))
const SharedZoneAdminPage = lazy(() => import('@/pages/admin/SharedZoneAdminPage'))
const HomepageEditorPage = lazy(() => import('@/pages/admin/HomepageEditorPage'))
const ServicesAdminPage = lazy(() => import('@/pages/admin/ServicesAdminPage'))
const PortfolioAdminPage = lazy(() =>
  import('@/pages/admin/ContentAdminPages').then((module) => ({ default: module.PortfolioAdminPage })),
)
const BlogAdminPage = lazy(() =>
  import('@/pages/admin/ContentAdminPages').then((module) => ({ default: module.BlogAdminPage })),
)
const TestimonialsAdminPage = lazy(() =>
  import('@/pages/admin/ContentAdminPages').then((module) => ({ default: module.TestimonialsAdminPage })),
)
const PricingAdminPage = lazy(() =>
  import('@/pages/admin/ContentAdminPages').then((module) => ({ default: module.PricingAdminPage })),
)
const MessagesAdminPage = lazy(() =>
  import('@/pages/admin/ContentAdminPages').then((module) => ({ default: module.MessagesAdminPage })),
)

function SuspendedPage({ children, label }: { children: ReactNode; label: string }) {
  return <Suspense fallback={<RouteFallback label={label} />}>{children}</Suspense>
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <SuspendedPage label="Loading home"><HomePage /></SuspendedPage> },
      { path: 'about', element: <SuspendedPage label="Loading studio"><AboutPage /></SuspendedPage> },
      { path: 'services', element: <SuspendedPage label="Loading services"><ServicesPage /></SuspendedPage> },
      { path: 'portfolio', element: <SuspendedPage label="Loading portfolio"><PortfolioPage /></SuspendedPage> },
      { path: 'portfolio/:slug', element: <SuspendedPage label="Loading case study"><ProjectDetailPage /></SuspendedPage> },
      { path: 'blog', element: <SuspendedPage label="Loading journal"><BlogPage /></SuspendedPage> },
      { path: 'blog/:slug', element: <SuspendedPage label="Loading article"><BlogArticlePage /></SuspendedPage> },
      { path: 'pricing', element: <SuspendedPage label="Loading pricing"><PricingPage /></SuspendedPage> },
      { path: 'testimonials', element: <SuspendedPage label="Loading testimonials"><TestimonialsPage /></SuspendedPage> },
      { path: 'contact', element: <SuspendedPage label="Loading contact"><ContactPage /></SuspendedPage> },
      { path: 'privacy-policy', element: <SuspendedPage label="Loading policy"><PrivacyPolicyPage /></SuspendedPage> },
      { path: 'terms', element: <SuspendedPage label="Loading terms"><TermsPage /></SuspendedPage> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <SuspendedPage label="Loading dashboard">
        <AdminRoutes />
      </SuspendedPage>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      {
        path: 'login',
        element: (
          <SuspendedPage label="Loading sign in">
            <AdminLoginPage />
          </SuspendedPage>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <SuspendedPage label="Loading dashboard">
            <AdminDashboardRoute />
          </SuspendedPage>
        ),
        children: [
          { index: true, element: <SuspendedPage label="Loading overview"><DashboardOverviewPage /></SuspendedPage> },
          { path: 'shared-zone', element: <SuspendedPage label="Loading Shared Zone"><SharedZoneAdminPage /></SuspendedPage> },
          { path: 'settings', element: <Navigate to="/admin/dashboard/shared-zone" replace /> },
          { path: 'homepage', element: <SuspendedPage label="Loading homepage editor"><HomepageEditorPage /></SuspendedPage> },
          { path: 'services', element: <SuspendedPage label="Loading services editor"><ServicesAdminPage /></SuspendedPage> },
          { path: 'portfolio', element: <SuspendedPage label="Loading portfolio editor"><PortfolioAdminPage /></SuspendedPage> },
          { path: 'blog', element: <SuspendedPage label="Loading blog editor"><BlogAdminPage /></SuspendedPage> },
          { path: 'testimonials', element: <SuspendedPage label="Loading testimonials editor"><TestimonialsAdminPage /></SuspendedPage> },
          { path: 'pricing', element: <SuspendedPage label="Loading pricing editor"><PricingAdminPage /></SuspendedPage> },
          { path: 'messages', element: <SuspendedPage label="Loading inbox"><MessagesAdminPage /></SuspendedPage> },
          { path: 'seo', element: <Navigate to="/admin/dashboard/shared-zone#seo" replace /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])

function SiteFavicon() {
  const sharedZone = useSharedZone()

  useEffect(() => {
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (favicon) favicon.href = sharedZone.brand.faviconUrl || sharedZone.brand.logoMarkUrl || '/favicon.svg'
  }, [sharedZone.brand.faviconUrl, sharedZone.brand.logoMarkUrl])

  return null
}

export function App() {
  return (
    <ContentProvider>
      <SharedZoneProvider>
        <SiteFavicon />
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </SharedZoneProvider>
    </ContentProvider>
  )
}
