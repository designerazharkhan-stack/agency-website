/**
 * Content repository.
 *
 * Public reads: Firestore when configured, bundled defaults otherwise. Reads
 * never throw — a backend failure degrades to default content rather than a
 * blank page, and the failure is reported so `/admin` can show it.
 *
 * Admin writes: Firestore only, guarded by Security Rules.
 */

import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore'

import {
  defaultAwards,
  defaultClients,
  defaultFaqs,
  defaultPlans,
  defaultPosts,
  defaultProcess,
  defaultProjects,
  defaultServices,
  defaultSharedZone,
  defaultSite,
  defaultStats,
  defaultTeam,
  defaultTestimonials,
  defaultValues,
} from '@/data/defaults'
import { assertFirebaseConfigured, firebaseReady, getDb } from './firebase'
import { COLLECTIONS, SETTINGS_DOCS, collectionRef, settingsRef } from './firestore'
import { byOrder, mergeDefaults, slugify, stripUndefined } from './utils'
import type {
  AwardDoc,
  BlogPostDoc,
  ClientLogoDoc,
  ContactSubmissionDoc,
  FaqDoc,
  InquiryFormValues,
  PricingPlanDoc,
  ProcessStepDoc,
  ProjectDoc,
  ServiceDoc,
  SharedZone,
  SiteContent,
  StatDoc,
  TeamMemberDoc,
  TestimonialDoc,
  ValuePropDoc,
} from '@/types/content'

/* -------------------------------------------------------------------------- */
/*  Serialisation                                                             */
/* -------------------------------------------------------------------------- */

/** Firestore `Timestamp` → ISO string. Anything else passes through. */
function serialise<T>(value: T): T {
  if (value === null || value === undefined) return value
  if (typeof value === 'object' && 'toDate' in value && typeof (value as { toDate?: unknown }).toDate === 'function') {
    return (value as unknown as { toDate: () => Date }).toDate().toISOString() as T
  }
  if (Array.isArray(value)) return value.map((item) => serialise(item)) as T
  if (typeof value === 'object' && !(value instanceof Date)) {
    const out: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      out[key] = serialise(val)
    }
    return out as T
  }
  return value
}

/** Remove Firestore-internal fields so the app never sees them. */
function cleanDoc<T>(id: string, data: DocumentData): T {
  const { id: _ignored, ...rest } = data
  void _ignored
  return { ...serialise(rest), id } as T
}

/* -------------------------------------------------------------------------- */
/*  Errors                                                                    */
/* -------------------------------------------------------------------------- */

export class ContentError extends Error {
  readonly cause?: unknown

  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'ContentError'
    this.cause = cause
  }
}

function toMessage(error: unknown): string {
  if (error instanceof Error) {
    const code = (error as Error & { code?: string }).code
    if (code === 'permission-denied') {
      return 'Firebase denied this request. Check the Security Rules and that you are signed in as an admin.'
    }
    if (code === 'unavailable' || code === 'deadline-exceeded') {
      return 'Could not reach Firestore. Check your network connection.'
    }
    return error.message
  }
  return 'Unknown error'
}

/* -------------------------------------------------------------------------- */
/*  Generic collection read                                                   */
/* -------------------------------------------------------------------------- */

const publicCollectionRequests = new Map<string, Promise<unknown[]>>()

function readCollection<T extends { id: string }>(
  key: WritableCollection,
  fallbacks: T[],
  publishedOnly = true,
): Promise<T[]> {
  if (!firebaseReady) return Promise.resolve(fallbacks)

  const requestKey = `${key}:${publishedOnly}`
  let request = publicCollectionRequests.get(requestKey)
  if (!request) {
    const constraints: QueryConstraint[] = []
    if (publishedOnly) constraints.push(where('published', '==', true))
    constraints.push(orderBy('order', 'asc'))
    request = (async () => {
      const db = await getDb()
      const snapshot = await getDocs(query(collectionRef(db, key), ...constraints))
      return snapshot.docs.map((docSnap) => cleanDoc<T>(docSnap.id, docSnap.data()))
    })().catch((error: unknown) => {
      console.warn(`[content] Falling back to defaults for "${key}":`, toMessage(error))
      return fallbacks
    })
    publicCollectionRequests.set(requestKey, request)
    void request.then(() => {
      if (publicCollectionRequests.get(requestKey) === request) {
        publicCollectionRequests.delete(requestKey)
      }
    })
  }

  return request.then((items) => (items.length ? items as T[] : fallbacks))
}

/* -------------------------------------------------------------------------- */
/*  Public reads                                                              */
/* -------------------------------------------------------------------------- */

export const getServices = () => readCollection<ServiceDoc>('services', defaultServices)
export const getProjects = () => readCollection<ProjectDoc>('projects', defaultProjects)
export const getPosts = () => readCollection<BlogPostDoc>('posts', defaultPosts)
export const getPlans = () => readCollection<PricingPlanDoc>('plans', defaultPlans)
export const getTestimonials = () => readCollection<TestimonialDoc>('testimonials', defaultTestimonials)
export const getValues = () => readCollection<ValuePropDoc>('values', defaultValues)
export const getStats = () => readCollection<StatDoc>('stats', defaultStats)
export const getProcessSteps = () => readCollection<ProcessStepDoc>('process', defaultProcess)
export const getTeam = () => readCollection<TeamMemberDoc>('team', defaultTeam)
export const getClients = () => readCollection<ClientLogoDoc>('clients', defaultClients)
export const getAwards = () => readCollection<AwardDoc>('awards', defaultAwards)
export const getFaqs = () => readCollection<FaqDoc>('faqs', defaultFaqs)

export interface PageResult<T> {
  items: T[]
  source: 'firebase' | 'defaults'
}

/** Admin read — includes unpublished documents. */
async function readAllForAdmin<T extends { id: string }>(
  key: WritableCollection,
  fallbacks: T[],
): Promise<PageResult<T>> {
  if (!firebaseReady) return { items: fallbacks, source: 'defaults' }
  try {
    const db = await getDb()
    const snapshot = await getDocs(query(collectionRef(db, key), orderBy('order', 'asc')))
    return {
      items: snapshot.docs.map((docSnap) => cleanDoc<T>(docSnap.id, docSnap.data())),
      source: 'firebase',
    }
  } catch (error) {
    throw new ContentError(toMessage(error), error)
  }
}

export const getAllServicesForAdmin = () => readAllForAdmin('services', defaultServices)
export const getAllProjectsForAdmin = () => readAllForAdmin('projects', defaultProjects)
export const getAllPostsForAdmin = () => readAllForAdmin('posts', defaultPosts)
export const getAllPlansForAdmin = () => readAllForAdmin('plans', defaultPlans)
export const getAllTestimonialsForAdmin = () => readAllForAdmin('testimonials', defaultTestimonials)
export const getAllValuesForAdmin = () => readAllForAdmin('values', defaultValues)
export const getAllStatsForAdmin = () => readAllForAdmin('stats', defaultStats)
export const getAllProcessForAdmin = () => readAllForAdmin('process', defaultProcess)
export const getAllTeamForAdmin = () => readAllForAdmin('team', defaultTeam)
export const getAllClientsForAdmin = () => readAllForAdmin('clients', defaultClients)
export const getAllAwardsForAdmin = () => readAllForAdmin('awards', defaultAwards)
export const getAllFaqsForAdmin = () => readAllForAdmin('faqs', defaultFaqs)

/* -------------------------------------------------------------------------- */
/*  Single-document lookups                                                   */
/* -------------------------------------------------------------------------- */

export async function getProjectBySlug(slug: string): Promise<ProjectDoc | null> {
  const items = await getProjects()
  return items.find((item) => item.slug === slug) ?? null
}

export async function getPostBySlug(slug: string): Promise<BlogPostDoc | null> {
  const items = await getPosts()
  return items.find((item) => item.slug === slug) ?? null
}

export async function getServiceBySlug(slug: string): Promise<ServiceDoc | null> {
  const items = await getServices()
  return items.find((item) => item.slug === slug) ?? null
}

export async function getProjectsByCategory(category: string): Promise<ProjectDoc[]> {
  const items = await getProjects()
  return items.filter((item) => item.category === category)
}

/* -------------------------------------------------------------------------- */
/*  Site settings                                                             */
/* -------------------------------------------------------------------------- */

const SETTINGS_DEFAULTS = {
  brand: defaultSite.brand,
  hero: defaultSite.hero,
  cta: defaultSite.cta,
  contact: defaultSite.contact,
  socials: defaultSite.socials,
  seo: defaultSite.seo,
  theme: defaultSite.theme,
  navigation: defaultSite.navigation,
  footer: defaultSite.footer,
} as const

export type SettingsKey = keyof typeof SETTINGS_DEFAULTS

async function readSetting<K extends SettingsKey>(key: K): Promise<SiteContent[K]> {
  if (!firebaseReady) return SETTINGS_DEFAULTS[key]
  try {
    const db = await getDb()
    const snapshot = await getDoc(settingsRef(db, key as never))
    if (!snapshot.exists()) return SETTINGS_DEFAULTS[key]
    return mergeDefaults(SETTINGS_DEFAULTS[key], cleanDoc<Record<string, unknown>>(snapshot.id, snapshot.data()))
  } catch (error) {
    console.warn(`[content] Falling back to default settings for "${key}":`, toMessage(error))
    return SETTINGS_DEFAULTS[key]
  }
}

export const readBrand = () => readSetting('brand')
export const readHero = () => readSetting('hero')
export const readCta = () => readSetting('cta')
export const readContact = () => readSetting('contact')
export const readSocials = () => readSetting('socials')
export const readSeo = () => readSetting('seo')
export const readTheme = () => readSetting('theme')
export const readNavigation = () => readSetting('navigation')
export const readFooter = () => readSetting('footer')

/** Loads the canonical settings document, retaining legacy settings migration support. */
export async function readSiteContent(): Promise<SiteContent> {
  const [savedSharedZone, hero, navigation] = await Promise.all([
    readSharedZoneDocument(),
    readHero(),
    readNavigation(),
  ])
  if (savedSharedZone) {
    const sharedZone = mergeDefaults(defaultSharedZone, savedSharedZone)

    return {
      ...defaultSite,
      brand: sharedZone.brand,
      hero: {
        ...hero,
        stats: [
          { id: 'shared-projects', value: sharedZone.trust.projectsCount, label: 'Projects delivered' },
          { id: 'shared-years', value: sharedZone.trust.experienceYears, label: 'Years of experience' },
          { id: 'shared-rating', value: sharedZone.trust.rating, label: 'Average rating' },
          ...(sharedZone.trust.clientCount
            ? [{ id: 'shared-clients', value: sharedZone.trust.clientCount, label: 'Clients' }]
            : []),
          ...sharedZone.trust.stats,
        ].filter((stat) => stat.value.trim()),
      },
      cta: sharedZone.cta,
      contact: sharedZone.contact,
      socials: sharedZone.socials,
      seo: sharedZone.seo,
      theme: sharedZone.theme,
      navigation,
      footer: sharedZone.footer,
      sharedZone,
    }
  }

  const [brand, cta, contact, socials, seo, theme, footer] = await Promise.all([
    readBrand(),
    readCta(),
    readContact(),
    readSocials(),
    readSeo(),
    readTheme(),
    readFooter(),
  ])
  const legacySite = { brand, hero, cta, contact, socials, seo, theme, navigation, footer }
  const statByLabel = (pattern: RegExp, fallback: string) =>
    hero.stats.find((stat) => pattern.test(stat.label))?.value ?? fallback
  const reservedStatLabels = /project|year|rating|clients?(?: served| count)?$/i
  const sharedZone = mergeDefaults(
    mergeDefaults(defaultSharedZone, {
      brand,
      theme,
      cta,
      contact,
      socials,
      seo,
      trust: {
        ...defaultSharedZone.trust,
        projectsCount: statByLabel(/project/i, defaultSharedZone.trust.projectsCount),
        experienceYears: statByLabel(/year/i, defaultSharedZone.trust.experienceYears),
        rating: statByLabel(/rating/i, defaultSharedZone.trust.rating),
        stats: hero.stats.filter((stat) => !reservedStatLabels.test(stat.label)),
      },
      footer: {
        ...footer,
        quickLinks: defaultSharedZone.footer.quickLinks,
        serviceLinks: defaultSharedZone.footer.serviceLinks,
        copyrightText: defaultSharedZone.footer.copyrightText,
        newsletter: defaultSharedZone.footer.newsletter,
      },
    }),
    savedSharedZone,
  )
  return {
    ...legacySite,
    brand: sharedZone.brand,
    hero: {
      ...hero,
      stats: [
        { id: 'shared-projects', value: sharedZone.trust.projectsCount, label: 'Projects delivered' },
        { id: 'shared-years', value: sharedZone.trust.experienceYears, label: 'Years of experience' },
        { id: 'shared-rating', value: sharedZone.trust.rating, label: 'Average rating' },
        ...(sharedZone.trust.clientCount
          ? [{ id: 'shared-clients', value: sharedZone.trust.clientCount, label: 'Clients' }]
          : []),
        ...sharedZone.trust.stats,
      ].filter((stat) => stat.value.trim()),
    },
    cta: sharedZone.cta,
    theme: sharedZone.theme,
    contact: sharedZone.contact,
    socials: sharedZone.socials,
    seo: sharedZone.seo,
    footer: sharedZone.footer,
    sharedZone,
  }
}

/* -------------------------------------------------------------------------- */
/*  Admin reads                                                               */
/* -------------------------------------------------------------------------- */

async function readSharedZoneDocument(): Promise<Partial<SharedZone> | null> {
  if (!firebaseReady) return null
  try {
    const db = await getDb()
    const snapshot = await getDoc(settingsRef(db, 'sharedZone'))
    return snapshot.exists()
      ? cleanDoc<Partial<SharedZone>>(snapshot.id, snapshot.data())
      : null
  } catch (error) {
    console.warn('[content] Could not load Shared Zone; using existing settings.', toMessage(error))
    return null
  }
}

export async function readSharedZoneForAdmin(): Promise<SharedZone> {
  const saved = await readSharedZoneDocument()
  if (saved) return mergeDefaults(defaultSharedZone, saved)
  const currentSite = await readSiteContent()
  return currentSite.sharedZone ?? defaultSharedZone
}

export async function saveSharedZone(value: SharedZone): Promise<void> {
  assertFirebaseConfigured()
  try {
    const db = await getDb()
    const compact = (input: unknown): unknown => {
      if (Array.isArray(input)) return input.map(compact)
      if (input && typeof input === 'object') {
        return Object.fromEntries(
          Object.entries(input).filter(([, child]) => child !== undefined).map(([key, child]) => [key, compact(child)]),
        )
      }
      return input
    }
    const compactValue = compact(value)
    if (!compactValue || typeof compactValue !== 'object' || Array.isArray(compactValue)) {
      throw new ContentError('Shared Zone data must be a settings object.')
    }
    const payload: Record<string, unknown> = Object.fromEntries(Object.entries(compactValue))
    payload.updatedAt = serverTimestamp()
    await setDoc(settingsRef(db, 'sharedZone'), payload, { merge: true })
  } catch (error) {
    throw new ContentError(toMessage(error), error)
  }
}

export function subscribeToSharedZone(
  onData: (value: SharedZone) => void,
  onError: (error: Error) => void,
): () => void {
  let cancelled = false
  let unsubscribe: (() => void) | null = null

  const run = async () => {
    try {
      assertFirebaseConfigured()
      const db = await getDb()
      if (cancelled) return
      unsubscribe = onSnapshot(
        settingsRef(db, 'sharedZone'),
        (snapshot) => {
          if (snapshot.exists()) {
            onData(mergeDefaults(defaultSharedZone, cleanDoc<Partial<SharedZone>>(snapshot.id, snapshot.data())))
            return
          }
          void readSharedZoneForAdmin().then((value) => {
            if (!cancelled) onData(value)
          }).catch((error: unknown) => {
            onError(error instanceof Error ? error : new ContentError(toMessage(error), error))
          })
        },
        (error) => onError(new ContentError(toMessage(error), error)),
      )
    } catch (error) {
      onError(error instanceof Error ? error : new ContentError(toMessage(error), error))
    }
  }

  void run()
  return () => {
    cancelled = true
    unsubscribe?.()
  }
}

export async function readSettingForAdmin<K extends SettingsKey>(key: K): Promise<SiteContent[K]> {
  if (!firebaseReady) return SETTINGS_DEFAULTS[key]
  const db = await getDb()
  const snapshot = await getDoc(settingsRef(db, key as never))
  if (!snapshot.exists()) return SETTINGS_DEFAULTS[key]
  return mergeDefaults(SETTINGS_DEFAULTS[key], cleanDoc<Record<string, unknown>>(snapshot.id, snapshot.data()))
}

/* -------------------------------------------------------------------------- */
/*  Admin writes                                                              */
/* -------------------------------------------------------------------------- */

export async function saveSetting<K extends SettingsKey>(key: K, value: SiteContent[K]): Promise<void> {
  assertFirebaseConfigured()
  try {
    const db = await getDb()
    const payload = stripUndefined({
      ...(value as Record<string, unknown>),
      id: undefined,
      updatedAt: serverTimestamp(),
    })
    await setDoc(settingsRef(db, key as never), payload, { merge: true })

    const savedSharedZone = await readSharedZoneDocument()
    if (!savedSharedZone) return
    const current = mergeDefaults(defaultSharedZone, savedSharedZone)
    let next: SharedZone | null = null
    if (key === 'brand') {
      next = { ...current, brand: { ...current.brand, ...(value as SiteContent['brand']) } }
    } else if (key === 'theme') {
      next = { ...current, theme: value as SiteContent['theme'] }
    } else if (key === 'hero') {
      const heroStats = (value as SiteContent['hero']).stats
      const findStat = (pattern: RegExp, fallback: string) =>
        heroStats.find((stat) => pattern.test(stat.label))?.value ?? fallback
      next = {
        ...current,
        trust: {
          ...current.trust,
          projectsCount: findStat(/project/i, current.trust.projectsCount),
          experienceYears: findStat(/year/i, current.trust.experienceYears),
          rating: findStat(/rating/i, current.trust.rating),
          stats: heroStats.filter((stat) => !/project|year|rating|clients?(?: served| count)?$/i.test(stat.label)),
        },
      }
    } else if (key === 'cta') {
      next = { ...current, cta: value as SiteContent['cta'] }
    } else if (key === 'contact') {
      next = { ...current, contact: { ...current.contact, ...(value as SiteContent['contact']) } }
    } else if (key === 'socials') {
      next = { ...current, socials: value as SiteContent['socials'] }
    } else if (key === 'seo') {
      next = { ...current, seo: value as SiteContent['seo'] }
    } else if (key === 'footer') {
      next = { ...current, footer: { ...current.footer, ...(value as SiteContent['footer']) } }
    }
    if (next) await saveSharedZone(next)
  } catch (error) {
    throw new ContentError(toMessage(error), error)
  }
}

export interface SaveOptions {
  /** Document id. Omit to create a new document. */
  id?: string
}

/** Collections whose documents carry a URL slug. */
const SLUG_COLLECTIONS = new Set<string>(['services', 'projects', 'posts'])

export type WritableCollection = Exclude<keyof typeof COLLECTIONS, 'settings' | 'submissions'>

export async function saveItem(
  collection: WritableCollection,
  values: Record<string, unknown>,
  options: SaveOptions = {},
): Promise<string> {
  assertFirebaseConfigured()
  try {
    const db = await getDb()
    const target = collectionRef(db, collection)

    const payload: Record<string, unknown> = stripUndefined({
      ...values,
      updatedAt: serverTimestamp(),
    })

    if (SLUG_COLLECTIONS.has(collection)) {
      const raw = typeof values.slug === 'string' && values.slug.trim() ? values.slug : String(values.title ?? '')
      payload.slug = slugify(raw)
    }

    if (options.id) {
      await setDoc(doc(target, options.id), payload, { merge: true })
      return options.id
    }
    const created = await addDoc(target, { ...payload, createdAt: serverTimestamp() })
    return created.id
  } catch (error) {
    throw new ContentError(toMessage(error), error)
  }
}

export async function removeItem(collection: WritableCollection, id: string): Promise<void> {
  assertFirebaseConfigured()
  try {
    const db = await getDb()
    await deleteDoc(doc(collectionRef(db, collection), id))
  } catch (error) {
    throw new ContentError(toMessage(error), error)
  }
}

export async function setPublished(
  collection: WritableCollection,
  id: string,
  published: boolean,
): Promise<void> {
  assertFirebaseConfigured()
  try {
    const db = await getDb()
    await updateDoc(doc(collectionRef(db, collection), id), {
      published,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    throw new ContentError(toMessage(error), error)
  }
}

/** Persist a new manual `order` for every item in a collection. */
export async function reorderItems(collection: WritableCollection, orderedIds: string[]): Promise<void> {
  assertFirebaseConfigured()
  try {
    const db = await getDb()
    const target = collectionRef(db, collection)
    const batch = writeBatch(db)
    orderedIds.forEach((id, index) => {
      batch.update(doc(target, id), { order: index + 1, updatedAt: serverTimestamp() })
    })
    await batch.commit()
  } catch (error) {
    throw new ContentError(toMessage(error), error)
  }
}

export async function toggleSettingFlag<K extends SettingsKey>(
  key: K,
  patch: Partial<SiteContent[K]>,
): Promise<void> {
  const current = await readSettingForAdmin(key)
  await saveSetting(key, { ...(current as object), ...(patch as object) } as SiteContent[K])
}

/* -------------------------------------------------------------------------- */
/*  Contact form submissions                                                  */
/* -------------------------------------------------------------------------- */

/** Any visitor may create a submission — public write, rules enforce the shape. */
export async function createSubmission(values: InquiryFormValues): Promise<string> {
  assertFirebaseConfigured()
  try {
    const db = await getDb()
    const created = await addDoc(collectionRef(db, 'submissions'), {
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone?.trim() ?? '',
      company: values.company?.trim() ?? '',
      budget: values.budget ?? '',
      services: values.services ?? [],
      message: values.message.trim(),
      status: 'new',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return created.id
  } catch (error) {
    throw new ContentError(toMessage(error), error)
  }
}

export async function getSubmissions(): Promise<ContactSubmissionDoc[]> {
  assertFirebaseConfigured()
  try {
    const db = await getDb()
    const snapshot = await getDocs(
      query(collectionRef(db, 'submissions'), orderBy('createdAt', 'desc')),
    )
    return snapshot.docs.map((docSnap) => cleanDoc<ContactSubmissionDoc>(docSnap.id, docSnap.data()))
  } catch (error) {
    throw new ContentError(toMessage(error), error)
  }
}

export async function setSubmissionStatus(id: string, status: ContactSubmissionDoc['status']): Promise<void> {
  assertFirebaseConfigured()
  try {
    const db = await getDb()
    await updateDoc(doc(collectionRef(db, 'submissions'), id), {
      status,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    throw new ContentError(toMessage(error), error)
  }
}

export async function removeSubmission(id: string): Promise<void> {
  assertFirebaseConfigured()
  try {
    const db = await getDb()
    await deleteDoc(doc(collectionRef(db, 'submissions'), id))
  } catch (error) {
    throw new ContentError(toMessage(error), error)
  }
}

/* -------------------------------------------------------------------------- */
/*  Live subscriptions (admin dashboard)                                      */
/* -------------------------------------------------------------------------- */

export function subscribeToCollection<T extends { id: string }>(
  collection: WritableCollection,
  onData: (items: T[]) => void,
  onError: (error: Error) => void,
): () => void {
  let cancelled = false
  let unsubscribe: (() => void) | null = null

  const run = async () => {
    try {
      assertFirebaseConfigured()
      const db = await getDb()
      if (cancelled) return
      unsubscribe = onSnapshot(
        query(collectionRef(db, collection), orderBy('order', 'asc')),
        (snapshot) => {
          onData(snapshot.docs.map((docSnap) => cleanDoc<T>(docSnap.id, docSnap.data())))
        },
        (error) => onError(new ContentError(toMessage(error), error)),
      )
    } catch (error) {
      onError(error instanceof Error ? error : new ContentError(toMessage(error), error))
    }
  }

  void run()

  return () => {
    cancelled = true
    unsubscribe?.()
  }
}

export function subscribeToSetting<K extends SettingsKey>(
  key: K,
  onData: (value: SiteContent[K]) => void,
  onError: (error: Error) => void,
): () => void {
  let cancelled = false
  let unsubscribe: (() => void) | null = null

  const run = async () => {
    try {
      assertFirebaseConfigured()
      const db = await getDb()
      if (cancelled) return
      unsubscribe = onSnapshot(
        settingsRef(db, key as never),
        (snapshot) => {
          if (!snapshot.exists()) {
            onData(SETTINGS_DEFAULTS[key])
            return
          }
          onData(
            mergeDefaults(
              SETTINGS_DEFAULTS[key],
              cleanDoc<Record<string, unknown>>(snapshot.id, snapshot.data()),
            ),
          )
        },
        (error) => onError(new ContentError(toMessage(error), error)),
      )
    } catch (error) {
      onError(error instanceof Error ? error : new ContentError(toMessage(error), error))
    }
  }

  void run()

  return () => {
    cancelled = true
    unsubscribe?.()
  }
}

export function subscribeToSubmissions(
  onData: (items: ContactSubmissionDoc[]) => void,
  onError: (error: Error) => void,
): () => void {
  let cancelled = false
  let unsubscribe: (() => void) | null = null

  const run = async () => {
    try {
      assertFirebaseConfigured()
      const db = await getDb()
      if (cancelled) return
      unsubscribe = onSnapshot(
        query(collectionRef(db, 'submissions'), orderBy('createdAt', 'desc')),
        (snapshot) => {
          onData(snapshot.docs.map((docSnap) => cleanDoc<ContactSubmissionDoc>(docSnap.id, docSnap.data())))
        },
        (error) => onError(new ContentError(toMessage(error), error)),
      )
    } catch (error) {
      onError(error instanceof Error ? error : new ContentError(toMessage(error), error))
    }
  }

  void run()

  return () => {
    cancelled = true
    unsubscribe?.()
  }
}

/* -------------------------------------------------------------------------- */
/*  Seeding                                                                   */
/* -------------------------------------------------------------------------- */

export interface SeedReport {
  written: number
  collections: string[]
}

/**
 * Writes the bundled default content into Firestore. Only ever runs from an
 * authenticated admin session — Security Rules reject it otherwise.
 */
export async function seedDefaultContent(includeOverwrite = false): Promise<SeedReport> {
  assertFirebaseConfigured()
  const payload: Array<[string, Array<Record<string, unknown>>]> = [
    ['services', defaultServices as unknown as Array<Record<string, unknown>>],
    ['projects', defaultProjects as unknown as Array<Record<string, unknown>>],
    ['posts', defaultPosts as unknown as Array<Record<string, unknown>>],
    ['plans', defaultPlans as unknown as Array<Record<string, unknown>>],
    ['testimonials', defaultTestimonials as unknown as Array<Record<string, unknown>>],
    ['values', defaultValues as unknown as Array<Record<string, unknown>>],
    ['stats', defaultStats as unknown as Array<Record<string, unknown>>],
    ['process', defaultProcess as unknown as Array<Record<string, unknown>>],
    ['team', defaultTeam as unknown as Array<Record<string, unknown>>],
    ['clients', defaultClients as unknown as Array<Record<string, unknown>>],
    ['awards', defaultAwards as unknown as Array<Record<string, unknown>>],
    ['faqs', defaultFaqs as unknown as Array<Record<string, unknown>>],
  ]

  try {
    const db = await getDb()
    const batch = writeBatch(db)
    let written = 0

    for (const [collectionName, items] of payload) {
      const target = collectionRef(db, collectionName as WritableCollection)
      for (const item of items) {
        const { id, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = item
        void _createdAt
        void _updatedAt
        if (typeof id !== 'string' || !id) {
          throw new ContentError(`Cannot seed "${collectionName}" content without a document id.`)
        }
        batch.set(doc(target, id), { ...stripUndefined(rest), updatedAt: serverTimestamp() }, { merge: !includeOverwrite })
        written += 1
      }
    }

    const settings: Array<[string, unknown]> = [
      ['brand', SETTINGS_DEFAULTS.brand],
      ['hero', SETTINGS_DEFAULTS.hero],
      ['cta', SETTINGS_DEFAULTS.cta],
      ['contact', SETTINGS_DEFAULTS.contact],
      ['socials', SETTINGS_DEFAULTS.socials],
      ['seo', SETTINGS_DEFAULTS.seo],
      ['theme', SETTINGS_DEFAULTS.theme],
      ['navigation', SETTINGS_DEFAULTS.navigation],
      ['footer', SETTINGS_DEFAULTS.footer],
    ]
    for (const [settingsKey, value] of settings) {
      batch.set(
        doc(db, COLLECTIONS.settings, SETTINGS_DOCS[settingsKey as keyof typeof SETTINGS_DOCS]),
        { ...(value as Record<string, unknown>), updatedAt: serverTimestamp() },
        { merge: true },
      )
    }

    await batch.commit()
    return {
      written,
      collections: [...payload.map(([name]) => name), 'settings'],
    }
  } catch (error) {
    throw new ContentError(toMessage(error), error)
  }
}

/** Sorted helper re-export so admin lists and defaults order identically. */
export { byOrder }
export { SETTINGS_DEFAULTS }
