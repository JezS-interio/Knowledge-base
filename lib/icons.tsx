import type { LucideIcon } from "lucide-react"
import {
  ShieldCheck,
  Wallet,
  Workflow,
  TrendingUp,
  Cpu,
  Folder,
} from "lucide-react"

export const AREA_ICONS: Record<string, LucideIcon> = {
  "shield-check": ShieldCheck,
  wallet: Wallet,
  workflow: Workflow,
  "trending-up": TrendingUp,
  cpu: Cpu,
  folder: Folder,
}

export function getAreaIcon(key: string): LucideIcon {
  return AREA_ICONS[key] ?? Folder
}

export function AreaIcon({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const Icon = getAreaIcon(name)
  return <Icon className={className} />
}
