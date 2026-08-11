"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { useStore } from "@/components/store-provider"
import { ProblemCard } from "@/components/problem-card"
import { TagBadge } from "@/components/tag-badge"
import { Breadcrumbs } from "@/components/breadcrumb"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { search, tagCounts } = useStore()

  const query = searchParams.get("q") ?? ""
  const [input, setInput] = React.useState(query)

  const results = React.useMemo(() => (query ? search(query) : []), [query, search])
  const popularTags = tagCounts().slice(0, 16)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = input.trim()
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 lg:px-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />

      <header className="mt-5">
        <h1 className="text-2xl font-semibold tracking-tight">Search</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search across problem titles, descriptions, solutions, and tags.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search problems..."
            className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
        </div>
      </form>

      {query ? (
        <div className="mt-8">
          <p className="mb-4 text-sm text-muted-foreground">
            {results.length === 0 ? (
              <>
                No results for{" "}
                <span className="font-medium text-foreground">
                  &ldquo;{query}&rdquo;
                </span>
              </>
            ) : (
              <>
                <span className="font-medium text-foreground">{results.length}</span>{" "}
                result{results.length !== 1 ? "s" : ""} for{" "}
                <span className="font-medium text-foreground">
                  &ldquo;{query}&rdquo;
                </span>
              </>
            )}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {results.map((p) => (
              <ProblemCard key={p.id} problem={p} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <p className="mb-3 text-sm font-medium">Popular tags</p>
          <div className="flex flex-wrap gap-2">
            {popularTags.map(({ tag, count }) => (
              <TagBadge
                key={tag}
                tag={`${tag} (${count})`}
                href={`/search?q=${encodeURIComponent(tag)}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
