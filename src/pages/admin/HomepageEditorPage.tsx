import { useState } from 'react'
import { Eye, RotateCcw, Save } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Input, Switch, Textarea } from '@/components/ui/Field'
import { FormCard } from '@/components/ui/FormKit'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { EditableBlockList } from '@/components/admin/EditableBlockList'
import { ErrorState, LoadingState } from '@/components/admin/States'
import { IconPicker } from '@/components/ui/FormKit'
import { defaultProcess, defaultSite, defaultStats, defaultValues } from '@/data/defaults'
import {
  getAllProcessForAdmin,
  getAllStatsForAdmin,
  getAllValuesForAdmin,
  removeItem,
  saveItem,
} from '@/lib/content'
import { useAdminSetting } from '@/hooks/useAdminSetting'
import { useAdminCollection } from '@/hooks/useAdminCollection'
import { toast } from '@/hooks/useToast'
import type { DocMeta, ProcessStepDoc, StatDoc, ValuePropDoc } from '@/types/content'

/** Persist an ordered block: existing ids merge, new ids are created, gone ids are deleted. */
async function persistBlock<T extends DocMeta>(
  collection: 'values' | 'stats' | 'process',
  next: T[],
  previous: T[],
): Promise<void> {
  const keep = new Set(next.map((item) => item.id))
  for (const item of next) {
    const { id, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = item
    void _createdAt
    void _updatedAt
    await saveItem(collection, { ...rest, order: next.indexOf(item) + 1 }, { id })
  }
  for (const item of previous) {
    if (!keep.has(item.id)) await removeItem(collection, item.id)
  }
}

/**
 * Homepage editor — hero, trust statistics, why-us cards, process steps and
 * the closing call to action. Everything the first screen and the last screen
 * of the homepage say is editable without touching code.
 */
export default function HomepageEditorPage() {
  const hero = useAdminSetting('hero', defaultSite.hero)
  const cta = useAdminSetting('cta', defaultSite.cta)

  const values = useAdminCollection<ValuePropDoc>('values', getAllValuesForAdmin, defaultValues)
  const stats = useAdminCollection<StatDoc>('stats', getAllStatsForAdmin, defaultStats)
  const process = useAdminCollection<ProcessStepDoc>('process', getAllProcessForAdmin, defaultProcess)

  const [saving, setSaving] = useState<string | null>(null)

  const saveHero = async () => {
    setSaving('hero')
    try {
      await hero.save()
      toast.success('Hero saved', 'The homepage headline is updated.')
    } catch (error) {
      toast.error('Could not save the hero', error instanceof Error ? error.message : 'Unknown error.')
    } finally {
      setSaving(null)
    }
  }

  const saveCta = async () => {
    setSaving('cta')
    try {
      await cta.save()
      toast.success('Call to action saved')
    } catch (error) {
      toast.error('Could not save', error instanceof Error ? error.message : 'Unknown error.')
    } finally {
      setSaving(null)
    }
  }

  const blockSaver = <T extends DocMeta,>(
    collection: 'values' | 'stats' | 'process',
    previous: T[],
  ) => async (next: T[]) => {
      setSaving(collection)
      try {
        await persistBlock(collection, next, previous)
        toast.success('Section saved', 'Your homepage changes are live.')
      } finally {
        setSaving(null)
      }
    }

  if (hero.loading || cta.loading) return <LoadingState label="Loading homepage content" />

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <p className="lede max-w-2xl text-sm">
          The headline a visitor sees first and the invitation they see last. Both live in Firestore, so changes publish
          instantly with no rebuild.
        </p>
        <Link
          to="/"
          target="_blank"
          rel="noreferrer"
          className="btn-outline-light shrink-0 !py-2.5 text-[0.7rem]"
        >
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          Preview homepage
        </Link>
      </div>

      {[hero.error, cta.error].filter(Boolean).map((message) => (
        <ErrorState key={message as string} message={message as string} />
      ))}

      <FormCard
        title="Hero"
        description="Eyebrow, headline, supporting copy and both calls to action."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="quiet" onClick={hero.reset} icon={<RotateCcw className="h-4 w-4" />}>
              Discard
            </Button>
            <Button
              onClick={() => void saveHero()}
              loading={saving === 'hero'}
              disabled={!hero.dirty}
              icon={<Save className="h-4 w-4" />}
            >
              {hero.dirty ? 'Save hero' : 'Saved'}
            </Button>
          </div>
        }
      >
        <div className="grid gap-5">
          <Input
            label="Eyebrow"
            value={hero.value.eyebrow ?? ''}
            onChange={(event) => hero.update({ eyebrow: event.target.value })}
            hint="Small line above the headline — availability, location or positioning."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Textarea
              label="Headline (first line)"
              rows={2}
              value={hero.value.headlineLine1}
              onChange={(event) => hero.update({ headlineLine1: event.target.value })}
            />
            <Textarea
              label="Headline (gold accent)"
              rows={2}
              value={hero.value.headlineAccent}
              onChange={(event) => hero.update({ headlineAccent: event.target.value })}
              hint="Rendered in the gold gradient."
            />
          </div>
          <Textarea
            label="Supporting description"
            rows={3}
            value={hero.value.subheadline}
            onChange={(event) => hero.update({ subheadline: event.target.value })}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-3 rounded-xl border border-white/[0.07] bg-white/[0.012] p-4">
              <span className="field-label mb-0">Primary CTA</span>
              <Input
                label="Button label"
                value={hero.value.primaryCtaLabel}
                onChange={(event) => hero.update({ primaryCtaLabel: event.target.value })}
              />
              <Input
                label="Link"
                value={hero.value.primaryCtaHref}
                onChange={(event) => hero.update({ primaryCtaHref: event.target.value })}
                placeholder="/contact"
              />
            </div>
            <div className="grid gap-3 rounded-xl border border-white/[0.07] bg-white/[0.012] p-4">
              <span className="field-label mb-0">Secondary CTA</span>
              <Input
                label="Button label"
                value={hero.value.secondaryCtaLabel}
                onChange={(event) => hero.update({ secondaryCtaLabel: event.target.value })}
              />
              <Input
                label="Link"
                value={hero.value.secondaryCtaHref}
                onChange={(event) => hero.update({ secondaryCtaHref: event.target.value })}
                placeholder="/portfolio"
              />
            </div>
          </div>

          <ImageUploader
            label="Hero image"
            value={hero.value.imageUrl ?? ''}
            onChange={(url) => hero.update({ imageUrl: url })}
            scope="projects"
            hint="Optional. A dark architectural image behind the hero works best."
          />

          <EditableBlockList
            label="Trust indicators"
            items={hero.value.stats}
            create={() => ({ id: `hs-${Date.now().toString(36)}`, value: '100%', label: 'New stat' })}
            onSave={async (next) => {
              await hero.update({ stats: next })
              await hero.save()
            }}
            addLabel="Add indicator"
            renderItem={({ item, update }) => (
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Value"
                  value={item.value}
                  onChange={(event) => update({ value: event.target.value })}
                  placeholder="120+"
                />
                <Input
                  label="Label"
                  value={item.label}
                  onChange={(event) => update({ label: event.target.value })}
                  placeholder="Projects delivered"
                />
              </div>
            )}
          />

          <EditableBlockList
            label="Capability marquee"
            items={hero.value.marquee.map((name, index) => ({ id: `mq-${index}`, name }))}
            create={() => ({ id: `mq-${hero.value.marquee.length}`, name: 'New capability' })}
            onSave={async (next) => {
              await hero.update({ marquee: next.map((entry) => entry.name) })
              await hero.save()
            }}
            addLabel="Add capability"
            emptyHint="These phrases scroll slowly beneath the hero."
            renderItem={({ item, update }) => (
              <Input
                label="Capability"
                value={item.name}
                onChange={(event) => update({ name: event.target.value })}
                placeholder="Web Development"
              />
            )}
          />
        </div>
      </FormCard>

      <FormCard
        title="Trust statistics"
        description="The large numbers band beneath the hero. Reorder with the arrow buttons."
      >
        <EditableBlockList
          items={stats.items}
          create={() => ({
            id: `st-${Date.now().toString(36)}`,
            value: '100+',
            label: 'New statistic',
            published: true,
          })}
          saving={saving === 'stats'}
          onSave={blockSaver('stats', stats.items)}
          addLabel="Add statistic"
          emptyHint="No statistics yet — add the first one."
          renderItem={({ item, update }) => (
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label="Value"
                value={item.value}
                onChange={(event) => update({ value: event.target.value })}
                placeholder="120+"
              />
              <Input
                label="Label"
                value={item.label}
                onChange={(event) => update({ label: event.target.value })}
                placeholder="Projects delivered"
              />
              <div className="sm:col-span-2">
                <Switch
                  checked={item.published === true}
                  onChange={(published) => update({ published })}
                  label="Visible on the site"
                  description="Unpublished statistics are skipped everywhere"
                />
              </div>
            </div>
          )}
        />
      </FormCard>

      <FormCard
        title="Why choose us"
        description="Benefit cards with their own statistic and icon."
      >
        <EditableBlockList
          items={values.items}
          create={() => ({
            id: `val-${Date.now().toString(36)}`,
            title: 'New benefit',
            description: 'Explain the benefit in one or two sentences.',
            icon: 'sparkles',
            published: true,
          })}
          saving={saving === 'values'}
          onSave={blockSaver('values', values.items)}
          addLabel="Add benefit"
          emptyHint="No benefit cards yet."
          renderItem={({ item, update }) => (
            <div className="grid gap-4">
              <Input
                label="Title"
                value={item.title}
                onChange={(event) => update({ title: event.target.value })}
              />
              <Textarea
                label="Description"
                rows={3}
                value={item.description}
                onChange={(event) => update({ description: event.target.value })}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Statistic"
                  value={item.stat ?? ''}
                  onChange={(event) => update({ stat: event.target.value })}
                  placeholder="94%"
                />
                <Input
                  label="Statistic label"
                  value={item.statLabel ?? ''}
                  onChange={(event) => update({ statLabel: event.target.value })}
                  placeholder="Clients who return"
                />
              </div>
              <IconPicker
                label="Icon"
                value={item.icon}
                onChange={(icon) => update({ icon })}
                hint="Shown inside the card on / and /about."
              />
              <Switch
                checked={item.published === true}
                onChange={(published) => update({ published })}
                label="Visible on the site"
                description="Unpublished cards are skipped"
              />
            </div>
          )}
        />
      </FormCard>

      <FormCard
        title="Work process"
        description="Discovery, planning, design, development, testing and launch — rename or reorder as needed."
      >
        <EditableBlockList
          items={process.items}
          create={() => ({
            id: `step-${Date.now().toString(36)}`,
            number: String(process.items.length + 1).padStart(2, '0'),
            title: 'New step',
            description: 'What happens in this phase, and who is involved.',
            deliverables: [],
            published: true,
          })}
          saving={saving === 'process'}
          onSave={blockSaver('process', process.items)}
          addLabel="Add step"
          emptyHint="No process steps yet."
          renderItem={({ item, update }) => (
            <div className="grid gap-4">
              <div className="grid gap-3 sm:grid-cols-12">
                <div className="sm:col-span-3">
                  <Input
                    label="Number"
                    value={item.number}
                    onChange={(event) => update({ number: event.target.value })}
                    placeholder="01"
                  />
                </div>
                <div className="sm:col-span-9">
                  <Input
                    label="Title"
                    value={item.title}
                    onChange={(event) => update({ title: event.target.value })}
                  />
                </div>
              </div>
              <Textarea
                label="Description"
                rows={3}
                value={item.description}
                onChange={(event) => update({ description: event.target.value })}
              />
              <Input
                label="Deliverables (one per line is not required — comma separated)"
                value={item.deliverables.join(', ')}
                onChange={(event) =>
                  update({
                    deliverables: event.target.value
                      .split(',')
                      .map((entry) => entry.trim())
                      .filter(Boolean),
                  })
                }
                hint={item.deliverables.join(' · ')}
              />
              <Switch
                checked={item.published === true}
                onChange={(published) => update({ published })}
                label="Visible on the site"
                description="Unpublished steps are skipped"
              />
            </div>
          )}
        />
      </FormCard>

      <FormCard
        title="Closing call to action"
        description="The final conversion band at the bottom of the homepage."
        actions={
          <Button
            onClick={() => void saveCta()}
            loading={saving === 'cta'}
            disabled={!cta.dirty}
            icon={<Save className="h-4 w-4" />}
          >
            {cta.dirty ? 'Save CTA' : 'Saved'}
          </Button>
        }
      >
        <div className="grid gap-5">
          <Input
            label="Eyebrow"
            value={cta.value.eyebrow ?? ''}
            onChange={(event) => cta.update({ eyebrow: event.target.value })}
          />
          <Textarea
            label="Headline"
            rows={2}
            value={cta.value.headline}
            onChange={(event) => cta.update({ headline: event.target.value })}
          />
          <RichTextEditor
            label="Body"
            value={cta.value.body ?? ''}
            onChange={(body) => cta.update({ body })}
            rows={8}
            hint="Optional. Markdown supported."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Button label"
              value={cta.value.buttonLabel}
              onChange={(event) => cta.update({ buttonLabel: event.target.value })}
            />
            <Input
              label="Button link"
              value={cta.value.buttonHref}
              onChange={(event) => cta.update({ buttonHref: event.target.value })}
              placeholder="/contact"
            />
          </div>
        </div>
      </FormCard>
    </div>
  )
}
