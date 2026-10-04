import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Clock, Linkedin, Link as LinkIcon, Twitter } from 'lucide-react'

import { PostCard } from '@/components/cards'
import { Container } from '@/components/ui/Section'
import { useSiteContent } from '@/context/ContentContext'
import { useAsync } from '@/hooks/useAsync'
import { useReveal } from '@/hooks/useReveal'
import { getPosts } from '@/lib/content'
import { Markdown } from '@/lib/markdown'
import { useSeo } from '@/lib/seo'
import { formatDate, safeHref } from '@/lib/utils'

export default function BlogArticlePage() {
  const { slug = '' } = useParams()
  const site = useSiteContent()
  useReveal()

  const { data, loading } = useAsync(() => getPosts(), [])

  const posts = data ?? []
  const post = posts.find((item) => item.slug === slug)

  const related = post
    ? posts
        .filter((item) => item.slug !== post.slug)
        .sort((a, b) => {
          const aScore = a.tags?.filter((tag) => post.tags?.includes(tag)).length ?? 0
          const bScore = b.tags?.filter((tag) => post.tags?.includes(tag)).length ?? 0
          return bScore - aScore
        })
        .slice(0, 3)
    : []

  useSeo({
    title: post?.seo?.title ?? post?.title ?? 'Article',
    description: post?.seo?.description ?? post?.excerpt ?? '',
    keywords: post?.seo?.keywords,
    ogImage: post?.coverImage,
    path: `/blog/${slug}`,
    type: 'article',
    publishedTime: post?.createdAt ?? undefined,
    overrides: post?.seo,
    site: site.seo,
  })

  if (loading && !post) {
    return (
      <Container className="py-32">
        <div className="mx-auto max-w-3xl space-y-5">
          <div className="h-4 w-24 animate-pulse rounded bg-white/[0.06]" />
          <div className="h-20 w-full animate-pulse rounded bg-white/[0.06]" />
          <div className="h-80 w-full animate-pulse rounded-2xl bg-white/[0.06]" />
        </div>
      </Container>
    )
  }

  if (!post) return <Navigate to="/blog" replace />

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <article>
      {/* Header */}
      <header className="relative overflow-hidden border-b border-white/[0.06] pb-14 pt-14 sm:pb-20 sm:pt-20">
        <div className="absolute inset-0 -z-20 bg-ink-radial" aria-hidden="true" />
        <img
          src={post.coverImage}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-[0.1]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/85 to-ink-950" aria-hidden="true" />

        <Container>
          <Link
            to="/blog"
            className="group inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-wide2 text-bone-dim transition-colors hover:text-gold-200"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:-translate-x-1" />
            Journal
          </Link>

          <div className="mt-10 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="chip-gold">{post.category}</span>
              <span className="flex items-center gap-1.5 text-[0.68rem] uppercase tracking-wide2 text-bone-dim">
                <Clock className="h-3 w-3" aria-hidden="true" />
                {post.readMinutes} min read
              </span>
              <span className="text-[0.68rem] uppercase tracking-wide2 text-bone-dim">
                {formatDate(post.createdAt)}
              </span>
            </div>

            <h1 className="display mt-7 text-display-sm">{post.title}</h1>
            <p className="lede mt-7">{post.excerpt}</p>

            {/* Author */}
            <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-white/[0.07] pt-7">
              <div className="flex items-center gap-4">
                {post.author?.avatarUrl ? (
                  <img
                    src={post.author.avatarUrl}
                    alt=""
                    className="h-12 w-12 rounded-full border border-gold-500/25 object-cover"
                  />
                ) : null}
                <div className="leading-tight">
                  <p className="text-sm text-bone">{post.author?.name}</p>
                  <p className="text-[0.66rem] uppercase tracking-wide2 text-bone-dim">{post.author?.role}</p>
                </div>
              </div>

              {/* Share */}
              <div className="flex items-center gap-2">
                <span className="text-[0.62rem] uppercase tracking-wide2 text-bone-dim">Share</span>
                <a
                  href={safeHref(
                    `https://x.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on X"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-bone-dim transition-colors hover:border-gold-500/40 hover:text-gold-200"
                >
                  <Twitter className="h-3.5 w-3.5" />
                </a>
                <a
                  href={safeHref(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on LinkedIn"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-bone-dim transition-colors hover:border-gold-500/40 hover:text-gold-200"
                >
                  <Linkedin className="h-3.5 w-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard?.writeText(shareUrl)
                  }}
                  aria-label="Copy link"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-bone-dim transition-colors hover:border-gold-500/40 hover:text-gold-200"
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* Cover */}
      <Container className="-mt-2 pt-14 sm:pt-16">
        <figure className="reveal">
          <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-850">
            <img
              src={post.coverImage}
              alt={post.title}
              className="aspect-[16/9] w-full object-cover"
              fetchPriority="high"
            />
          </div>
        </figure>
      </Container>

      {/* Body */}
      <Container className="py-14 sm:py-20">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              {post.author?.bio ? (
                <div className="panel p-6">
                  <p className="text-[0.62rem] uppercase tracking-luxe text-gold-400">About the author</p>
                  <p className="mt-3 font-display text-xl font-light text-bone">{post.author?.name}</p>
                  <p className="mt-3 text-sm leading-relaxed text-bone-muted">{post.author.bio}</p>
                </div>
              ) : null}

              {post.tags?.length ? (
                <div className="mt-6">
                  <p className="text-[0.62rem] uppercase tracking-luxe text-gold-400">Tags</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((item) => (
                      <li key={item}>
                        <Link to={`/blog?tag=${encodeURIComponent(item)}`} className="chip transition-colors hover:border-gold-500/40 hover:text-gold-200">
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </aside>

          <div className="lg:col-span-8 lg:col-start-5">
            <Markdown content={post.content} className="prose-luxe" />

            {/* Author CTA */}
            <div className="panel-gold mt-16 flex flex-col gap-6 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
              <div>
                <p className="text-[0.62rem] uppercase tracking-luxe text-gold-400">Written by</p>
                <p className="mt-2 font-display text-2xl font-light text-bone">{post.author?.name}</p>
                <p className="mt-1 text-[0.68rem] uppercase tracking-wide2 text-bone-dim">
                  {post.author?.role}
                </p>
              </div>
              <Link
                to="/contact"
                className="group inline-flex shrink-0 items-center gap-2 text-[0.72rem] uppercase tracking-wide2 text-gold-200 transition-colors hover:text-gold-100"
              >
                Discuss this
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </Container>

      {/* Related */}
      {related.length ? (
        <section className="border-t border-white/[0.06] bg-ink-900/40 py-16 sm:py-20">
          <Container>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="font-display text-4xl font-light text-bone">Keep reading</h2>
              <Link
                to="/blog"
                className="group inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-wide2 text-gold-300 transition-colors hover:text-gold-100"
              >
                All articles
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <PostCard key={item.id} post={item} index={index} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </article>
  )
}
