"use client"

import Link from "next/link"
import type { Problem } from "@/lib/types"
import { useStore } from "@/components/store-provider"
import { getAreaIcon } from "@/lib/icons"
import { relativeTime } from "@/lib/format"

export function ProblemRow({
  problem,
  timestamp = "updated",
}: {
  problem: Problem
  timestamp?: "updated" | "created"
}) {
  const { getArea } = useStore()
  const area = getArea(problem.areaSlug)
  const Icon = area ? getAreaIcon(area.icon) : null
  const iso = timestamp === "updated" ? problem.updatedAt : problem.createdAt

  return (
    <Link
      href={`/problems/${problem.id}`}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/60"
    >
      {area && Icon && (
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-lg"
          style={{
            backgroundColor: `color-mix(in oklch, ${area.color} 12%, transparent)`,
            color: area.color,
          }}
        >
          <Icon className="size-4" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">
          {problem.title}
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          {area?.name}
          {" · "}
          {timestamp === "updated" ? "Updated" : "Added"}{" "}
          {relativeTime(iso)}
        </span>
      </span>
    </Link>
  )
}
