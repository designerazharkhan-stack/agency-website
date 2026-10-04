import type { UploadScope } from '@/lib/storage'
import { ImageField } from '@/components/ui/FormKit'

/**
 * Storage-backed image field for admin forms.
 *
 * A thin, intentional wrapper around `ImageField` so every upload in the
 * dashboard shares one scope vocabulary and one visual treatment. Uploads go
 * straight to Cloud Storage — images are compressed client-side first, and the
 * resulting public download URL is what gets stored on the document.
 */
export function ImageUploader({
  label,
  value,
  onChange,
  scope,
  hint,
  aspect = '16/9',
  className,
}: {
  label: string
  value: string
  onChange: (next: string) => void
  scope: UploadScope
  hint?: string
  aspect?: string
  className?: string
}) {
  return (
    <ImageField
      label={label}
      value={value}
      onChange={onChange}
      scope={scope}
      hint={hint}
      aspect={aspect}
      className={className}
    />
  )
}

/** Multiple images managed as an ordered list (project galleries). */
export function GalleryUploader({
  label,
  value,
  onChange,
  scope,
  hint,
}: {
  label: string
  value: Array<{ id: string; url: string; caption?: string }>
  onChange: (next: Array<{ id: string; url: string; caption?: string }>) => void
  scope: UploadScope
  hint?: string
}) {
  const update = (index: number, patch: { url?: string; caption?: string }) => {
    onChange(value.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  return (
    <fieldset className="space-y-4">
      <legend className="field-label mb-0">{label}</legend>
      {hint ? <p className="-mt-2 text-xs text-bone-dim">{hint}</p> : null}

      <ul className="space-y-3">
        {value.map((item, index) => (
          <li key={item.id} className="rounded-xl border border-white/[0.07] bg-white/[0.012] p-3.5">
            <ImageUploader
              label={`Image ${index + 1}`}
              value={item.url}
              onChange={(url) => update(index, { url })}
              scope={scope}
            />
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
              <input
                className="field flex-1"
                value={item.caption ?? ''}
                onChange={(event) => update(index, { caption: event.target.value })}
                placeholder="Caption (optional)"
                aria-label={`Caption for image ${index + 1}`}
              />
              <button
                type="button"
                className="btn-quiet text-xs text-bone-dim hover:text-red-300"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="btn-ghost !py-2.5 text-[0.7rem]"
        onClick={() =>
          onChange([
            ...value,
            { id: `g-${Date.now().toString(36)}`, url: '', caption: '' },
          ])
        }
      >
        Add gallery image
      </button>
    </fieldset>
  )
}
