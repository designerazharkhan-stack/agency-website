import { useEffect } from 'react'
import { absoluteUrl } from './env'
import type { SeoFields, SeoSettings } from '@/types/content'

interface ManagedMeta {
  name: string
  content: string
}

interface OpenGraphMeta {
  property: string
  content: string
}

/** Fallback used when the CMS has not supplied a site name yet. */
const DEFAULT_SITE_NAME = 'Agency Website'

/** "Agency Website — Digital Agency" → "Agency Website". */
function deriveSiteName(seoTitle: string | undefined): string | undefined {
  if (!seoTitle) return undefined
  const head = seoTitle.split(/\s+[—–|-]\s+/)[0]?.trim()
  return head || undefined
}

function upsertAttribute(
  selector: string,
  attribute: 'name' | 'property',
  key: string,
  content: string,
): void {
  if (!content) return
  let element = document.head.querySelector<HTMLMetaElement>(`${selector}[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function removeAttribute(selector: string, attribute: 'name' | 'property', key: string): void {
  const element = document.head.querySelector(`${selector}[${attribute}="${key}"]`)
  element?.remove()
}

/**
 * Applies a title/description/OpenGraph/canonical set to `document.head`.
 * Values are fully overwritten on every call so there is no stale-tag drift
 * when navigating between routes.
 */
export function applySeo(options: {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  canonicalPath?: string
  type?: 'website' | 'article'
  robots?: 'index' | 'noindex'
  siteName?: string
  twitterHandle?: string
  locale?: string
  publishedTime?: string
}): void {
  if (typeof document === 'undefined') return

  const { canonicalPath = '/' } = options
  const canonical = absoluteUrl(canonicalPath)
  const siteName = options.siteName?.trim() || DEFAULT_SITE_NAME
  const fullTitle = options.title.toLowerCase().includes(siteName.toLowerCase())
    ? options.title
    : `${options.title} — ${siteName}`

  document.title = fullTitle

  const managed: ManagedMeta[] = [
    { name: 'description', content: options.description },
    { name: 'keywords', content: (options.keywords ?? []).join(', ') },
    { name: 'robots', content: options.robots ?? 'index' },
  ]
  const og: OpenGraphMeta[] = [
    { property: 'og:site_name', content: siteName },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: options.description },
    { property: 'og:type', content: options.type ?? 'website' },
    { property: 'og:url', content: canonical },
    { property: 'og:locale', content: options.locale ?? 'en_US' },
    { property: 'og:image', content: options.ogImage ?? '' },
  ]
  if (options.publishedTime) {
    og.push({ property: 'article:published_time', content: options.publishedTime })
  }

  const twitter: ManagedMeta[] = [
    { name: 'twitter:card', content: options.ogImage ? 'summary_large_image' : 'summary' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: options.description },
    { name: 'twitter:site', content: options.twitterHandle ?? '' },
    { name: 'twitter:image', content: options.ogImage ?? '' },
  ]

  for (const meta of managed) upsertAttribute('meta', 'name', meta.name, meta.content)
  for (const meta of og) upsertAttribute('meta', 'property', meta.property, meta.content)
  for (const meta of twitter) upsertAttribute('meta', 'name', meta.name, meta.content)

  if (!options.ogImage) removeAttribute('meta', 'property', 'og:image')
  if (!options.twitterHandle) removeAttribute('meta', 'name', 'twitter:site')

  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = canonical
}

/**
 * Page-level SEO hook. Reads defaults from the CMS-backed `SiteSeo` object and
 * merges any per-document overrides.
 */
export function useSeo(options: {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  path?: string
  type?: 'website' | 'article'
  robots?: 'index' | 'noindex'
  publishedTime?: string
  overrides?: SeoFields
  site?: SeoSettings
  siteName?: string
}): void {
  const {
    title,
    description,
    keywords,
    ogImage,
    path,
    type,
    robots,
    publishedTime,
    overrides,
    site,
    siteName,
  } = options

  useEffect(() => {
    applySeo({
      title: overrides?.title ?? title,
      description: overrides?.description ?? description,
      keywords: overrides?.keywords ?? keywords ?? site?.keywords ?? [],
      ogImage: overrides?.ogImage ?? ogImage ?? site?.ogImage ?? '',
      canonicalPath: path ?? '/',
      type,
      robots: overrides?.robots ?? robots ?? 'index',
      siteName: siteName ?? deriveSiteName(site?.title),
      twitterHandle: site?.twitterHandle,
      locale: site?.locale,
      publishedTime,
    })
  }, [
    title,
    description,
    keywords,
    ogImage,
    path,
    type,
    robots,
    publishedTime,
    overrides?.title,
    overrides?.description,
    overrides?.keywords,
    overrides?.ogImage,
    overrides?.robots,
    siteName,
    site?.title,
    site?.keywords,
    site?.ogImage,
    site?.twitterHandle,
    site?.locale,
  ])
}
