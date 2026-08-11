"use client"

import { useState } from "react"
import { Clock, Sparkles } from "lucide-react"
import { useStore } from "@/components/store-provider"
import { ProblemRow } from "@/components/problem-row"
import { Breadcrumbs } from "@/components/breadcrumb"
import { cn } from "@/lib/utils"

type Tab = "updated" | "created"

export default function RecentPage() {
  const { problems } = useStore()
  const [tab, setTab] = useState<Tab>("updated")

  const sorted = [...problems]
    .sort((a, b) =>
      tab === "updated"
        ? +new Date(b.updatedAt) - +new Date(a.updatedAt)
        : +new Date(b.createdAt) - +new Date(a.createdAt),
    )
    .slice(0, 30)

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 lg:px-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Recent" }]} />

      <header className="mt-5 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Recent Problems</h1>
        <p className="text-muted-foreground text-sm">
          Browse the most recently updated and added problems across all areas.
        </p>
      </header>

      <div className="mt-6 flex gap-1 border-b border-border">
        {(
          [
            { id: "updated" as Tab, label: "Recently updated", icon: Clock },
            { id: "created" as Tab, label: "Recently added", icon: Sparkles },
          ] as const
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              tab === id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-border bg-card p-2">
        {sorted.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No problems yet.
          </p>
        ) : (
          sorted.map((p) => (
            <ProblemRow key={p.id} problem={p} timestamp={tab === "updated" ? "updated" : "created"} />
          ))
        )}
      </div>
    </div>
  )
}
