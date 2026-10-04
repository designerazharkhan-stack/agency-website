import type { BlogPostDoc } from '@/types/content'

const img = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

const elena = {
  name: 'Elena Marchetti',
  role: 'Founder & Strategy Director',
  avatarUrl: img('photo-1494790108377-be9c29b29330', 400),
  bio: 'Elena founded the studio after fourteen years in digital strategy, most of it explaining to boards why the logo did not need to change.',
}

const marcus = {
  name: 'Marcus Adeyemi',
  role: 'Design Director',
  avatarUrl: img('photo-1507003211169-0a1dd7228f2d', 400),
  bio: 'Marcus runs the design studio and owns the argument that restraint is a feature, not a budget compromise.',
}

const ines = {
  name: 'Inés Carvalho',
  role: 'Head of Engineering',
  avatarUrl: img('photo-1544005313-94ddf0286df2', 400),
  bio: 'Inés leads engineering and has strong opinions about bundle size, which she treats as a design material.',
}

export const defaultPosts: BlogPostDoc[] = [
  {
    id: 'post-pricing-silence',
    slug: 'the-most-expensive-silence-in-your-pipeline',
    title: 'The most expensive silence in your pipeline',
    excerpt:
      'Most lost deals are not lost to a competitor. They are lost to a silence — a week of unanswered follow-up that feels like nothing and costs like a year of revenue.',
    content: `Every lost deal investigation I have run in the last six years returns the same finding. The competitor did not win. The silence did.

## The uncomfortable arithmetic

We anonymised 1,400 B2B opportunities across fourteen of our clients. Median response time to a qualified inbound enquiry was 6 hours 40 minutes. The deals where response took longer than 24 hours were **31% less likely to close**, and the deals where it took longer than 72 hours were less than half as likely.

None of those numbers should surprise you. They surprise everybody.

## Where the silence actually comes from

The assumption is that silence happens because nobody cares about the enquiry. In practice it happens for four reasons, and only one of them is genuine disinterest.

**The routing gap.** The form went to a shared inbox. Two people are responsible for it. Both assumed the other had replied. This accounts for roughly a third of silent threads.

**The unprepared reply.** Someone saw the enquiry, felt the price was above what they were authorised to discuss, and decided to come back later. Later did not arrive.

**The credential delay.** The prospect needed to find something on your site that justified their internal forward before they could reply. If your proof points are buried behind a careers page, the thread dies silently in both directions.

**Real disinterest.** Roughly 12%. Your genuine market is small. Do not build a strategy for the other 88%.

## Fixing the routing gap without hiring anyone

Autonomous reply is not the answer — sending an automated message to a human being who has just spent four minutes writing a considered enquiry is one of the fastest ways to lose them. What works is commitment rather than correspondence.

Set an internal SLA of two hours. Make the acknowledgement a named person, not a template. If the enquiry requires someone senior to join, send that person — not an apology for their absence.

> If an enquiry needs a reply from a person who is not available, reply anyway and set an expectation. Silence has no advocates; a stated delay always does.

## Make the proof findable

Before you chase the pipeline, check whether a prospect who spent 90 seconds on your site can find three things without typing a query:

1. Work you have done for someone in their sector, with a result.
2. A person, with a face and a point of view.
3. A number, ideally with a date attached.

If any of those require navigating, you do not have a content problem. You have an information architecture problem, and no amount of CRM discipline will fix it.

## Measure the silence directly

Add one metric to your dashboard: *median hours to first human response*, segmented by enquiry value. Not by source, not by channel — by value. The teams with a fast median usually have a slow median on their most valuable enquiries, because those are the ones that need senior people, and senior people are busy.

Fix that specific number and the pipeline moves.`,
    coverImage: img('photo-1552664730-d307ca884978'),
    tags: ['Growth', 'Sales', 'Strategy'],
    category: 'Growth',
    author: elena,
    readMinutes: 8,
    featured: true,
    published: true,
    order: 1,
    createdAt: '2026-01-14T09:00:00.000Z',
    seo: {
      title: 'The Most Expensive Silence in Your Pipeline',
      description:
        'Analysis of 1,400 B2B opportunities showing why deals are lost to unanswered follow-up rather than competitors.',
    },
  },
  {
    id: 'post-luxury-restraint',
    slug: 'why-restraint-reads-as-expensive',
    title: 'Why restraint reads as expensive',
    excerpt:
      'A defence of doing less, grounded in the perceptual research behind price perception. Luxury is not an abundance of features — it is the absence of proof that you needed them.',
    content: `A recurring argument in our studio concerns the same thing: someone asks why a design does not contain an additional element. Usually a section, an animation, a testimonial carousel, a badge.

They are usually right that it would not hurt. They are almost always wrong that it would help.

## The evidence

Ask consumers to price a product, then show the identical product with an added feature. In blind tests, added features increase *stated* value and reduce *willingness to pay*. This is not a paradox once you understand what people are doing: they are inferring quality from evidence, and excess evidence is evidence of insecurity.

Luxury categories have understood this for centuries. A Hermès Birkin has no visible padding around the hardware, no instructional diagram on the clasp, and no sticker explaining what the leather grade means. Every one of those additions would increase comprehension and decrease value.

## What restraint actually requires

Restraint is not the absence of work. It is the absence of *visible* work — the work has been done so thoroughly that it is not needed as proof.

Concretely, this means:

- Navigation that is self-evident, so there is no instructional tour.
- Typography with a scale tight enough to be predictable and loose enough to breathe, so no rule needs explaining.
- Photography edited rather than filtered, so nothing needs a caption saying it is authentic.
- A checkout that asks for exactly the information needed, so nothing needs reassuring.

## The audit that finds your excess

Print every screen of your site. Circle anything that exists to reassure. You will usually find more than you expect.

Three questions for each circled element:

1. Which specific failure is this preventing? If you cannot name the failure, it is decoration.
2. Would its absence cause confusion, or merely absence? Confusion is worth solving. Absence is not.
3. Does it raise perceived quality, or lower it by drawing attention to the problem?

## Where you *do* add

Restraint is not universal. Two categories of element earn their place regardless:

**Proof of consequence.** A named client, a real number, a specific outcome. This is the exception to "no testimonials" and it is the strongest element you can add.

**Consequence of failure.** Security, compliance, what happens to the customer's data. Here, reassurance is the product. A payments page that hides its security posture reads as a page that has something to hide.

Everything else should be argued for on the same evidence you would use for any other budget decision.

## Where this gets contested

Someone on your team will argue that competitors have it and you do not. They are describing a competitor's chosen positioning, not a standard. Different positioning is the entire basis of competition. If your strategy is "more visible than them", you have already decided your brand is a discount, and no amount of typographic refinement will change that.

Restraint is expensive because it requires certainty. You can only leave something out if you are confident it is not the thing.`,
    coverImage: img('photo-1507003211169-0a1dd7228f2d'),
    tags: ['Design', 'Brand', 'Opinion'],
    category: 'Design',
    author: marcus,
    readMinutes: 9,
    featured: true,
    published: true,
    order: 2,
    createdAt: '2026-02-03T09:00:00.000Z',
    seo: {
      title: 'Why Restraint Reads as Expensive',
      description:
        'A design director case for doing less: the perceptual research behind why excess features reduce willingness to pay.',
    },
  },
  {
    id: 'post-core-web-vitals',
    slug: 'core-web-vitals-are-a-design-problem',
    title: 'Core Web Vitals are a design problem',
    excerpt:
      'Nobody has ever lost a customer because a hero image was 400KB. They have lost them because the page shifted while they were reading it.',
    content: `There is a persistent belief that performance is an engineering concern that gets fixed at the end. This produces websites that pass every synthetic audit and still feel like they are made of wet paper.

## The actual mechanism

Users do not perceive milliseconds. They perceive instability. Layout shift, and the delay between tapping something and seeing a response, are felt far more strongly than raw load time — because they break the expectation that the interface is solid and in control.

This means the most impactful performance work is done in design review, not in the final optimisation pass.

## Three decisions made at design stage

**Set the type scale in \`rem\` from the beginning.** Pixels make it impossible to honour a user's OS-level text sizing preference. When we test a site at 200% browser zoom, pixel-locked layouts break; \`rem\`-based ones adapt. Zoom is an accessibility requirement, not a nice-to-have.

**Reserve space for every image before it loads.** Aspect-ratio boxes in the layout remove layout shift entirely. If the design has not specified intrinsic dimensions for its media, the design is incomplete.

**Design the loading state, or accept that you have not designed the page.** Every interface has a moment where the data is not there yet. Skeletons that match final layout beat spinners; a spinner that replaces a 900px-tall hero creates a shift no skeleton can prevent.

## The engineering decisions that matter

Once the design contract is honoured, three implementation choices carry most of the remaining budget:

**Ship less JavaScript.** Every dependency you add costs parse time on a mid-range Android device before it costs anything on your laptop. Our reference budget for a content site is 60KB of JavaScript. Most sites in our sector run 600KB.

**Cache the third parties aggressively.** Analytics and chat widgets are the usual offenders. Load them on interaction, not on load, and delegate their third-party cookie behaviour.

**Preload the one thing above the fold.** Everything else can be lazy. The hero image and the primary font cannot.

## The measurement trap

Lighthouse is a lab tool and a useful one, but optimising for it produces sites that score well and feel cheap. Field data — what real users experience on real devices and networks — is the only honest measure, and it is available through the Chrome UX Report and the \`web-vitals\` library with about eight lines of code.

Track at the 75th percentile, segmented by device. A site that is fast on desktop and unusable on a four-year-old mid-range phone is not a fast site.

## What to do on Monday

Run the 75th percentile field data on your five highest-traffic templates. If you cannot, run Lighthouse on throttled mid-range mobile and stop looking at the desktop score. Fix layout shift first — it is usually one missing image dimension and one late-loading font, and it is worth more than every other performance optimisation combined.`,
    coverImage: img('photo-1551288049-bebda4e38f71'),
    tags: ['Engineering', 'Performance', 'Accessibility'],
    category: 'Engineering',
    author: ines,
    readMinutes: 7,
    featured: true,
    published: true,
    order: 3,
    createdAt: '2026-02-21T09:00:00.000Z',
    seo: {
      title: 'Core Web Vitals Are a Design Problem',
      description:
        'Why perceived performance is decided in design review, and the three layout decisions that remove most instability.',
    },
  },
  {
    id: 'post-rebrand-failure',
    slug: 'the-five-things-that-kill-a-rebrand',
    title: 'The five things that kill a rebrand',
    excerpt:
      'In twelve years we have watched roughly forty rebrands ship. This is the list of what actually goes wrong, in order of how often it happens.',
    content: `A rebrand fails in one of five ways, and it is almost never the one the client fears.

## 1. Nobody was asked what the brand was actually for

Strategy documents written without a single customer conversation produce positioning that is technically defensible and commercially irrelevant. The symptom appears three months post-launch, when sales teams cannot answer a simple question about why the company exists.

The fix is unglamorous: interview customers who churned, not customers who stayed. Stayers will tell you what you hoped they would say.

## 2. The identity was designed before the strategy

This is the most common sequencing failure. When the visual work begins first, the strategy is retrofitted to whatever the design turned out to mean. The result is a beautiful brand with an unfalsifiable story attached.

The uncomfortable test: describe the new identity to someone who has not seen it. If your verbal description is vague, the design is carrying meaning it has not earned.

## 3. There was no migration plan

The single most cited reason clients regret a rebrand is the year of disruption that follows it. Every touchpoint has to change at once or it reads as two companies. Websites, email signatures, contracts, invoice templates, social avatars, presentation decks, signage, recruitment materials, the packaging of the product in the box.

Most organisations allocate zero budget to this phase and then spend it anyway, badly, over eighteen months.

## 4. The internal team was not equipped

Guidelines that exist as a PDF are read once and ignored. What works is a token system in the codebase, templates in the tools people already use, and a named internal owner with the authority to refuse.

A rebrand without internal authority becomes a slow drift back to the old brand, and it happens faster than most people expect.

## 5. Success was never defined

If you cannot say what improved, nothing is being tracked, and by month seven the loudest internal voice is whichever director preferred the old logo. Define the metric before the design starts and report against it publicly.

## What the successful ones did differently

In the twelve that worked, three things are consistent. Strategy was written before design. Customer research happened in the first month, not the last. And a named senior person owned the rollout with the authority to make other people's work non-compliant.

That last point is not a design problem. It is an organisational one, and it is the most common reason otherwise good work disappears.`,
    coverImage: img('photo-1523726491678-bf852e717f6a'),
    tags: ['Brand', 'Strategy', 'Case study'],
    category: 'Brand',
    author: elena,
    readMinutes: 6,
    featured: false,
    published: true,
    order: 4,
    createdAt: '2026-03-08T09:00:00.000Z',
    seo: {
      title: 'The Five Things That Kill a Rebrand',
      description:
        'Patterns from twelve years and forty rebrands: sequencing, migration, internal authority and the metrics that decide success.',
    },
  },
  {
    id: 'post-motion-budget',
    slug: 'your-motion-budget-is-a-design-budget',
    title: 'Your motion budget is a design budget',
    excerpt:
      'Animation is not decoration applied after the design. It is the way a design explains causality, and it should be budgeted like type.',
    content: `Most teams treat motion as a finishing pass: layout first, then someone makes it move. That order guarantees the result — motion that arrives with no explanatory purpose, so it gets removed at the first performance review.

## What motion is for

Motion has exactly three legitimate jobs in an interface. It should explain **causality** (this element came from there), it should maintain **continuity** (this panel is the same object you were reading), or it should direct **attention** to something that changed.

Anything that does none of these is decoration. Some decoration is fine — a considered stillness is itself a design choice — but it should be a choice, made deliberately.

## Budget it like type

We assign motion an explicit share of the design budget: roughly 8% of the total time allocated to an interface. If motion consumes 30%, the design is doing too much talking and the motion is being used to disguise that.

Within that budget, define a small vocabulary rather than an unlimited library:

- **One entrance.** Used for first appearance of primary content. Never on scroll for every section.
- **One transition.** The object that persists across a state change and moves to its new position.
- **One exit.** Rare, and only when something is being genuinely dismissed.

Three behaviours, applied consistently, read as a system. Twenty behaviours read as noise.

## Respect the physics

Interfaces should feel like they have mass. That means acceleration out of rest and deceleration into it, which is the opposite of linear motion. The standard cubic-bezier of \`0.22, 1, 0.36, 1\` — fast to start, slow to settle — covers roughly 80% of transitions and feels materially more expensive than \`ease-in-out\`.

Anything that takes longer than 400ms for a state change on a standard screen will feel broken. Anything under 120ms will feel like the interface ignored the input.

## The accessibility constraint is not optional

\`prefers-reduced-motion\` is not a checkbox for launch. Vestibular disorders affect a meaningful population and reduce-motion support in the operating system is one line of CSS:

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
\`\`\`

For users who request it, replace movement with an instant state change. Not a slower animation — no animation. The information must arrive regardless.

## Performance is a budget too

Animation runs on the compositor thread. Properties that trigger layout or paint — \`width\`, \`top\`, \`box-shadow\` — will stall on a mid-range phone no matter how carefully timed. Animate \`transform\` and \`opacity\`. Everything else is a request for trouble.

Then measure it on the device your customers actually have, because a 60fps animation on a throttled mid-range Android is a slideshow.`,
    coverImage: img('photo-1531973576160-7125cd663d86'),
    tags: ['Motion', 'Design', 'Accessibility'],
    category: 'Design',
    author: marcus,
    readMinutes: 7,
    featured: false,
    published: true,
    order: 5,
    createdAt: '2026-03-27T09:00:00.000Z',
    seo: {
      title: 'Your Motion Budget Is a Design Budget',
      description:
        'How to budget interface animation like typography: three legitimate jobs, a three-behaviour vocabulary and honest physics.',
    },
  },
  {
    id: 'post-staff-augmentation',
    slug: 'when-to-hire-and-when-to-augment',
    title: 'When to hire, and when to augment',
    excerpt:
      'An honest framework for deciding whether your next six months of delivery needs permanent headcount or a specialist squad.',
    content: `The most expensive mistake in this industry is hiring a permanent team against a temporary problem. The second most expensive is doing the opposite.

## The framework

We look at four signals, and the decision follows from their combination rather than any single one.

**Is the work ongoing or bounded?** Bounded work — a rebrand, a site rebuild, a product launch — is augmentation by definition. You need a specific skill for a specific window and you need to be gone afterwards. Ongoing capability is different: it compounds, it needs ownership, and it should be internal.

**Will this work still exist in eighteen months?** A role exists because there is a body of work. If the answer is genuinely no, a contractor is cheaper, faster, and more honest.

**Who provides the judgement at 11pm?** Permanent staff carry context and accountability. Augmented teams carry capability. If your problem is that nobody can make a decision, adding external decision-makers makes it worse.

**What does the internal team do during the engagement?** The failure mode of augmentation is that internal people are pulled into producing instead of learning. Design it explicitly: two days a week on the agency project, three on knowledge transfer, written down.

## What a good augmented arrangement looks like

- Named senior people, no rotation through juniors.
- Your repositories, your tooling, your standups.
- A written handover as a deliverable, not a goodwill gesture.
- A two-week trial before any commitment longer than a month.
- Explicit overlap windows so your people are redundant by design.

## The uncomfortable arithmetic

An embedded senior engineer costs roughly four times a permanent hire per month. Against that: recruitment takes three to six months, the salary is annual whether or not the work exists, and the ramp to full productivity is a further quarter.

Augmentation loses on pure cost and wins decisively on flexibility. The correct question is not "which is cheaper" but "what does the shape of our next eighteen months require".

## When you should hire anyway

Hire when you have a capability you intend to keep for at least two years and that sits on your critical path. Hire when the work is genuinely continuous and the external partner is holding up your roadmap. Hire when the cost of not having the skill is a missed quarter rather than a delayed one.

And hire when you have found someone exceptional. That is a rarer opportunity than the process suggests, and it does not wait for a good quarter to begin.`,
    coverImage: img('photo-1521737711867-e3b97375f902'),
    tags: ['Operations', 'Strategy', 'Teams'],
    category: 'Operations',
    author: elena,
    readMinutes: 8,
    featured: false,
    published: true,
    order: 6,
    createdAt: '2026-04-11T09:00:00.000Z',
    seo: {
      title: 'When to Hire, and When to Augment',
      description:
        'A four-signal framework for choosing between permanent headcount and an augmented specialist squad.',
    },
  },
]
