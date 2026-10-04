/**
 * Cloud Storage helpers for admin image uploads.
 *
 * Uploads are only possible from an authenticated admin session — Storage
 * Security Rules reject anonymous writes. Nothing secret lives here; the
 * download URLs stored on documents are public read paths.
 */

import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  type UploadResult,
} from 'firebase/storage'

import { assertFirebaseConfigured, getStorage } from './firebase'
import { storagePaths } from './firestore'
import { ContentError } from './content'

export type UploadScope = Exclude<keyof typeof storagePaths, 'media' | 'submission'>

const SCOPE_DIR: Record<UploadScope, string> = {
  logo: 'brand',
  posts: 'media/posts',
  projects: 'media/projects',
  team: 'media/team',
  testimonials: 'media/testimonials',
  seo: 'media/seo',
}

export interface UploadOptions {
  scope: UploadScope
  file: File
  /** Optional stable name; a timestamp prefix is always added. */
  name?: string
  /** Skip compression (e.g. for already-optimised files). */
  raw?: boolean
}

const MAX_DIMENSION = 2200
const JPEG_QUALITY = 0.82

export class ImageTooLargeError extends Error {
  readonly sizeMb: number

  constructor(sizeMb: number) {
    super(`That image is ${sizeMb.toFixed(1)}MB. The limit is 12MB.`)
    this.name = 'ImageTooLargeError'
    this.sizeMb = sizeMb
  }
}

/** Downscale + re-encode in the browser so we never upload a 6000px original. */
export async function compressImage(file: File): Promise<Blob> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
    if (scale === 1 && file.size < 900_000) {
      bitmap.close()
      return file
    }

    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) {
      bitmap.close()
      return file
    }
    context.imageSmoothingQuality = 'high'
    context.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()

    const hasAlpha = file.type === 'image/png' || file.type === 'image/webp'
    const mime = hasAlpha ? 'image/webp' : 'image/jpeg'

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, mime, hasAlpha ? 0.9 : JPEG_QUALITY),
    )
    return blob && blob.size < file.size ? blob : file
  } catch {
    return file
  }
}

function safeFileName(name: string): string {
  const extensionMatch = name.match(/\.[a-z0-9]{2,5}$/i)
  const extension = extensionMatch ? extensionMatch[0].toLowerCase() : '.jpg'
  const base = name
    .slice(0, extension ? -extension.length : undefined)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
  return `${base || 'image'}${extension}`
}

export interface UploadedImage {
  url: string
  path: string
  fileName: string
  size: number
}

/** Compress, upload and return a permanent public download URL. */
export async function uploadImage(options: UploadOptions): Promise<UploadedImage> {
  assertFirebaseConfigured()
  if (options.file.size > 12 * 1024 * 1024) {
    throw new ImageTooLargeError(options.file.size / 1024 / 1024)
  }

  try {
    const storage = await getStorage()
    const payload = options.raw ? options.file : await compressImage(options.file)
    const stamp = Date.now().toString(36)
    const path = `${SCOPE_DIR[options.scope]}/${stamp}-${safeFileName(options.file.name)}`
    const objectRef = ref(storage, path)

    const result: UploadResult = await uploadBytes(objectRef, payload, {
      contentType: payload.type || options.file.type,
      cacheControl: 'public,max-age=31536000,immutable',
    })
    const url = await getDownloadURL(result.ref)

    return { url, path, fileName: safeFileName(options.file.name), size: payload.size }
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes('permission')
        ? 'Storage denied this upload. Confirm the Storage rules are deployed and you are signed in as an admin.'
        : error instanceof Error
          ? error.message
          : 'Upload failed.'
    throw new ContentError(message, error)
  }
}

/** Remove a previously uploaded asset by its Storage path. */
export async function deleteImage(path: string): Promise<void> {
  assertFirebaseConfigured()
  try {
    const storage = await getStorage()
    await deleteObject(ref(storage, path))
  } catch (error) {
    throw new ContentError(error instanceof Error ? error.message : 'Delete failed.', error)
  }
}

/**
 * Accepts a pasted or picked image and returns an object URL, or `null` when
 * the value is already a URL / empty. Used by the reusable ImageField.
 */
export function readLocalFile(file: File): Promise<{ previewUrl: string; file: File }> {
  return Promise.resolve({
    previewUrl: URL.createObjectURL(file),
    file,
  })
}

export { storagePaths }
