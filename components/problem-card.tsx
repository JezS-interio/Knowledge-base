"use client"

import Link from "next/link"
import { Star, ImageIcon } from "lucide-react"
import type { Problem } from "@/lib/types"
import { useStore } from "@/components/store-provider"
import { getAreaIcon } from "@/lib/icons"
import { relativeTime } from "@/lib/format"
import { TagBadge } from "@/components/tag-badge"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function ProblemCard({
  problem,
  showArea = false,
}: {
  problem: Problem
  showArea?: boolean
}) {
  const { getArea, toggleFavorite, isFavorite } = useStore()
  const area = getArea(problem.areaSlug)
  const Icon = area ? getAreaIcon(area.icon) : null
  const fav = isFavorite(problem.id)

  const cover = problem.images[0]

  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card transition-all hover:border-ring/30 hover:shadow-sm overflow-hidden">
      {/* cover image when available */}
      {cover && (
        <Link href={`/problems/${problem.id}`} className="block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover.url}
            alt={cover.caption || problem.title}
            className="aspect-video w-full object-cover border-b border-border/60"
          />
        </Link>
      )}

      <button
        onClick={() => toggleFavorite(problem.id)}
        aria-label={fav ? "Remove from favorites" : "Add to favorites"}
        className={cn(
          "absolute z-10 text-muted-foreground/40 transition-colors hover:text-amber-500",
          cover ? "right-2 top-2 rounded-md bg-background/80 p-1 backdrop-blur-sm" : "right-3 top-3",
        )}
      >
        <Star className={cn("size-4", fav && "fill-amber-400 text-amber-400")} />
      </button>

      <div className="flex flex-col gap-3 p-4">
      <Link href={`/problems/${problem.id}`} className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2 pr-6">
          {showArea && area && Icon && (
            <span
              className="flex size-6 shrink-0 items-center justify-center rounded-md"
              style={{
                backgroundColor: `color-mix(in oklch, ${area.color} 12%, transparent)`,
                color: area.color,
              }}
            >
              <Icon className="size-3.5" />
            </span>
          )}
          <h3 className="text-pretty font-medium leading-snug tracking-tight transition-colors group-hover:text-primary">
            {problem.title}
          </h3>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {problem.description}
        </p>
      </Link>

      <div className="flex flex-wrap items-center gap-1.5">
        {showArea && area && (
          <Badge
            variant="secondary"
            className="font-normal"
            style={{ color: area.color }}
          >
            {area.name}
          </Badge>
        )}
        {problem.tags.slice(0, 3).map((tag) => (
          <TagBadge
            key={tag}
            tag={tag}
            href={`/areas/${problem.areaSlug}?tag=${encodeURIComponent(tag)}`}
          />
        ))}
        {problem.tags.length > 3 && (
          <span className="text-xs text-muted-foreground">
            +{problem.tags.length - 3}
          </span>
        )}
      </div>

      <div className="mt-auto flex items-center gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground">
        <span>{problem.author}</span>
        <span className="opacity-40">·</span>
        <span>Updated {relativeTime(problem.updatedAt)}</span>
        {problem.images.length > 1 && (
          <span className="ml-auto flex items-center gap-1">
            <ImageIcon className="size-3.5" />
            {problem.images.length}
          </span>
        )}
      </div>
      </div>
    </div>
  )
}
