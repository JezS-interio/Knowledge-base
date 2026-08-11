"use client"

import { Star } from "lucide-react"
import Link from "next/link"
import { useStore } from "@/components/store-provider"
import { ProblemRow } from "@/components/problem-row"
import { Breadcrumbs } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"

export default function FavoritesPage() {
  const { problems, favorites } = useStore()

  const saved = problems.filter((p) => favorites.includes(p.id))

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 lg:px-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Favorites" }]} />

      <header className="mt-5 flex flex-col gap-1">
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <Star className="size-6 fill-amber-400 text-amber-400" />
          Saved Problems
        </h1>
        <p className="text-muted-foreground text-sm">
          Problems you have starred for quick access.
        </p>
      </header>

      <div className="mt-6 rounded-xl border border-border bg-card p-2">
        {saved.length === 0 ? (
          <div className="py-16 text-center">
            <Star className="mx-auto size-10 text-muted-foreground/30" />
            <p className="mt-3 text-sm font-medium">No saved problems yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Open a problem and click the star icon to save it here.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4 bg-transparent">
              <Link href="/">Browse problems</Link>
            </Button>
          </div>
        ) : (
          saved.map((p) => (
            <ProblemRow key={p.id} problem={p} timestamp="updated" />
          ))
        )}
      </div>
    </div>
  )
}
