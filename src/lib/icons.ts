import {
  Award,
  BarChart3,
  Blocks,
  Code2,
  Compass,
  FileCheck2,
  Gem,
  Github,
  Instagram,
  KeyRound,
  Layers,
  LayoutTemplate,
  Linkedin,
  Facebook,
  Youtube,
  Frame,
  Dribbble,
  Music2,
  Twitter,
  CircleSlash2,
  Sparkles,
  Search,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  Palette,
  Megaphone,
  Boxes,
  PenTool,
  Rocket,
  Globe2,
  HeartHandshake,
  Zap,
  type LucideIcon,
} from 'lucide-react'

import type { SocialIconKey } from '@/types/content'

/** Service / value icons selectable from the admin UI. */
export const ICON_REGISTRY: Record<string, LucideIcon> = {
  compass: Compass,
  layout: LayoutTemplate,
  layers: Layers,
  sparkles: Sparkles,
  search: Search,
  'trending-up': TrendingUp,
  code: Code2,
  'shield-check': ShieldCheck,
  users: Users,
  'file-check': FileCheck2,
  target: Target,
  gem: Gem,
  'key-round': KeyRound,
  'circle-slash': CircleSlash2,
  palette: Palette,
  megaphone: Megaphone,
  boxes: Boxes,
  'pen-tool': PenTool,
  rocket: Rocket,
  globe: Globe2,
  'heart-handshake': HeartHandshake,
  zap: Zap,
  music: Music2,
  award: Award,
  chart: BarChart3,
  blocks: Blocks,
}

export const ICON_CHOICES = Object.keys(ICON_REGISTRY)

export function resolveIcon(key: string | undefined, fallback: LucideIcon = Sparkles): LucideIcon {
  if (!key) return fallback
  return ICON_REGISTRY[key] ?? fallback
}

/** Social network icons. */
export const SOCIAL_ICONS: Record<SocialIconKey, LucideIcon> = {
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
  youtube: Youtube,
  behance: Frame,
  dribbble: Dribbble,
  github: Github,
  tiktok: Music2,
  pinterest: Instagram,
}

export const SOCIAL_ICON_CHOICES = Object.keys(SOCIAL_ICONS) as SocialIconKey[]

export function resolveSocialIcon(key: string): LucideIcon {
  return SOCIAL_ICONS[key as SocialIconKey] ?? Globe2
}
