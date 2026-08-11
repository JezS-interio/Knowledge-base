"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Area } from "@/lib/types"
import { useStore } from "@/components/store-provider"
import { getAreaIcon } from "@/lib/icons"
import { relativeTime } from "@/lib/format"

export function AreaCard({ area }: { area: Area }) {
  const { areaStats } = useStore()
  const Icon = getAreaIcon(area.icon)
  const { count, lastUpdated } = areaStats(area.slug)

  return (
    <Link
      href={`/areas/${area.slug}`}
      className="group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:border-ring/30 hover:shadow-md"
    >
      <div
        className="absolute inset-x-0 top-0 h-1 opacity-80"
        style={{ backgroundColor: area.color }}
      />
      <div className="flex items-start justify-between">
        <span
          className="flex size-11 items-center justify-center rounded-xl"
          style={{
            backgroundColor: `color-mix(in oklch, ${area.color} 14%, transparent)`,
            color: area.color,
          }}
        >
          <Icon className="size-5" />
        </span>
        <ArrowRight className="size-4 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold tracking-tight">{area.name}</h3>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          {area.description}
        </p>
      </div>

      <div className="mt-auto flex items-center gap-2 pt-1 text-sm">
        <span className="font-medium tabular-nums">
          {count} {count === 1 ? "problem" : "problems"}
        </span>
        {lastUpdated && (
          <>
            <span className="text-muted-foreground/40">·</span>
            <span className="truncate text-muted-foreground">
              Last updated {relativeTime(lastUpdated.updatedAt)}
            </span>
          </>
        )}
      </div>
    </Link>
  )
}
