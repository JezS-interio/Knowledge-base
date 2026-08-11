"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { Plus, X, FileQuestion } from "lucide-react"
import { useStore } from "@/components/store-provider"
import { getAreaIcon } from "@/lib/icons"
import { Breadcrumbs } from "@/components/breadcrumb"
import { ProblemCard } from "@/components/problem-card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SortKey = "updated" | "created" | "alpha"

export default function AreaPage() {
  const { slug } = useParams<{ slug: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { getArea, problemsByArea, canEdit } = useStore()

  const [sort, setSort] = React.useState<SortKey>("updated")
  const tagFilter = searchParams.get("tag")

  const area = getArea(slug)

  const problems = React.useMemo(() => {
    if (!area) return []
    let list = problemsByArea(slug)
    if (tagFilter) list = list.filter((p) => p.tags.includes(tagFilter))
    return [...list].sort((a, b) => {
      if (sort === "alpha") return a.title.localeCompare(b.title)
      const key = sort === "updated" ? "updatedAt" : "createdAt"
      return +new Date(b[key]) - +new Date(a[key])
    })
  }, [area, problemsByArea, slug, tagFilter, sort])

  if (!area) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-20 text-center lg:px-8">
        <h1 className="text-xl font-semibold">Area not found</h1>
        <p className="mt-2 text-muted-foreground">
          This area may have been removed.
        </p>
        <Button className="mt-6" render={<Link href="/" />}>
          Back to Home
        </Button>
      </div>
    )
  }

  const Icon = getAreaIcon(area.icon)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 lg:px-8">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: area.name }]}
      />

      <header className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span
            className="flex size-12 shrink-0 items-center justify-center rounded-xl"
            style={{
              backgroundColor: `color-mix(in oklch, ${area.color} 14%, transparent)`,
              color: area.color,
            }}
          >
            <Icon className="size-6" />
          </span>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              {area.name}
            </h1>
            <p className="max-w-xl text-pretty text-muted-foreground">
              {area.description}
            </p>
          </div>
        </div>
        {canEdit && (
          <Button
            size="lg"
            render={<Link href={`/problems/new?area=${area.slug}`} />}
            className="shrink-0"
          >
            <Plus />
            Add Problem
          </Button>
        )}
      </header>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {problems.length} {problems.length === 1 ? "problem" : "problems"}
          </span>
          {tagFilter && (
            <button
              onClick={() => router.push(`/areas/${slug}`)}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
            >
              #{tagFilter}
              <X className="size-3" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by</span>
          <Select
            value={sort}
            onValueChange={(v) => setSort(v as SortKey)}
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Recently updated</SelectItem>
              <SelectItem value="created">Recently created</SelectItem>
              <SelectItem value="alpha">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {problems.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <FileQuestion className="size-8 text-muted-foreground/50" />
          <p className="text-muted-foreground">
            {tagFilter
              ? `No problems tagged "${tagFilter}" in ${area.name}.`
              : `No problems documented in ${area.name} yet.`}
          </p>
          {canEdit && (
            <Button
              variant="outline"
              render={<Link href={`/problems/new?area=${area.slug}`} />}
            >
              <Plus />
              Add the first problem
            </Button>
          )}
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {problems.map((p) => (
            <ProblemCard key={p.id} problem={p} />
          ))}
        </div>
      )}
    </div>
  )
}
