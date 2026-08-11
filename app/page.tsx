"use client"

import Link from "next/link"
import { Clock, Sparkles, Tag as TagIcon } from "lucide-react"
import { useStore } from "@/components/store-provider"
import { AreaCard } from "@/components/area-card"
import { ProblemRow } from "@/components/problem-row"

export default function HomePage() {
  const { areas, problems, currentUser, tagCounts } = useStore()

  const recentlyUpdated = [...problems]
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    .slice(0, 6)

  const recentlyAdded = [...problems]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 6)

  const popularTags = tagCounts().slice(0, 14)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 lg:px-8">
      <header className="flex flex-col gap-1.5">
        <p className="text-sm text-muted-foreground">
          Welcome back, {currentUser.name.split(" ")[0]}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          Knowledge Base
        </h1>
        <p className="max-w-2xl text-pretty text-muted-foreground">
          Find documented problems and their solutions, organized by company
          area. Browse an area or search across everything.
        </p>
      </header>

      <section className="mt-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <AreaCard key={area.slug} area={area} />
          ))}
        </div>
      </section>

      <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <Clock className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Recently updated</h2>
          </div>
          <div className="p-2">
            {recentlyUpdated.map((p) => (
              <ProblemRow key={p.id} problem={p} timestamp="updated" />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Sparkles className="size-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Recently added</h2>
            </div>
            <div className="p-2">
              {recentlyAdded.slice(0, 4).map((p) => (
                <ProblemRow key={p.id} problem={p} timestamp="created" />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <TagIcon className="size-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Popular tags</h2>
            </div>
            <div className="flex flex-wrap gap-1.5 p-4">
              {popularTags.map(({ tag, count }) => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-xs transition-colors hover:border-ring/40 hover:bg-muted"
                >
                  <span className="text-muted-foreground/70">#</span>
                  {tag}
                  <span className="ml-0.5 tabular-nums text-muted-foreground/60">
                    {count}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-10 flex items-center justify-between rounded-xl border border-dashed border-border px-5 py-4 text-sm text-muted-foreground">
        <span>
          {problems.length} problems documented across {areas.length} areas
        </span>
        <Link
          href="/recent"
          className="font-medium text-primary hover:underline"
        >
          View all activity
        </Link>
      </footer>
    </div>
  )
}
