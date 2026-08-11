"use client"

import { use, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  ArrowLeft,
  Calendar,
  Pencil,
  Star,
  Trash2,
} from "lucide-react"
import { useStore } from "@/components/store-provider"
import { Breadcrumb } from "@/components/breadcrumb"
import { RichText } from "@/components/rich-text"
import { TagBadge } from "@/components/tag-badge"
import { ProblemRow } from "@/components/problem-row"
import { AreaIcon } from "@/lib/icons"
import { formatDate, formatRelative } from "@/lib/format"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function ProblemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const {
    getProblem,
    getArea,
    users,
    relatedProblems,
    deleteProblem,
    isFavorite,
    toggleFavorite,
    canEdit,
  } = useStore()

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [activeImage, setActiveImage] = useState<string | null>(null)

  const problem = getProblem(id)

  if (!problem) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-lg font-semibold">Problem not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          It may have been deleted.
        </p>
        <Button asChild variant="outline" className="mt-4 bg-transparent">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    )
  }

  const area = getArea(problem.areaSlug)
  const author = users.find((u) => u.name === problem.author)
  const related = relatedProblems(problem)
  const fav = isFavorite(problem.id)

  function handleDelete() {
    deleteProblem(problem!.id)
    toast.success("Problem deleted.")
    router.push(area ? `/areas/${area.slug}` : "/")
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          ...(area
            ? [{ label: area.name, href: `/areas/${area.slug}` }]
            : []),
          { label: problem.title },
        ]}
      />

      <div className="mt-2 flex items-start justify-between gap-4">
        <div className="min-w-0">
          {area && (
            <Link
              href={`/areas/${area.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <span
                className="flex h-5 w-5 items-center justify-center rounded"
                style={{ backgroundColor: `${area.color} / 0.12` }}
              >
                <AreaIcon name={area.icon} className="h-3 w-3" />
              </span>
              {area.name}
            </Link>
          )}
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-balance">
            {problem.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              {author && (
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                  style={{ backgroundColor: author.color }}
                >
                  {author.name.slice(0, 1)}
                </span>
              )}
              {problem.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Updated {formatRelative(problem.updatedAt)}
            </span>
            <span>Created {formatDate(problem.createdAt)}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className="bg-transparent"
            onClick={() => {
              toggleFavorite(problem.id)
              toast.success(fav ? "Removed from saved" : "Saved")
            }}
            aria-label={fav ? "Remove from saved" : "Save problem"}
          >
            <Star
              className="h-4 w-4"
              fill={fav ? "currentColor" : "none"}
            />
          </Button>
          {canEdit && (
            <>
              <Button
                asChild
                variant="outline"
                size="icon"
                className="bg-transparent"
              >
                <Link
                  href={`/problems/${problem.id}/edit`}
                  aria-label="Edit problem"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-transparent text-destructive hover:text-destructive"
                onClick={() => setConfirmOpen(true)}
                aria-label="Delete problem"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {problem.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {problem.tags.map((t) => (
            <TagBadge key={t} tag={t} href={`/search?q=${encodeURIComponent(t)}`} />
          ))}
        </div>
      )}

      <div className="mt-8 space-y-8">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Problem
          </h2>
          <div className="mt-3 rounded-xl border border-border bg-card p-5">
            <RichText content={problem.description} />
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Solution
          </h2>
          <div className="mt-3 rounded-xl border border-border bg-card p-5">
            <RichText content={problem.solution} />
          </div>
        </section>

        {problem.images.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Reference images
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {problem.images.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveImage(img.url)}
                  className="group overflow-hidden rounded-lg border border-border bg-muted text-left"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={img.url || "/placeholder.svg"}
                      alt={img.caption || "Reference image"}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                  {img.caption && (
                    <p className="truncate px-2 py-1.5 text-xs text-muted-foreground">
                      {img.caption}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Related problems
            </h2>
            <div className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
              {related.map((p) => (
                <ProblemRow key={p.id} problem={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="mt-10">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
        >
          <Link href={area ? `/areas/${area.slug}` : "/"}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to {area ? area.name : "home"}
          </Link>
        </Button>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this problem?</DialogTitle>
            <DialogDescription>
              {`"${problem.title}" will be permanently removed. This cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="bg-transparent">
                Cancel
              </Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {activeImage && (
        <Dialog
          open={Boolean(activeImage)}
          onOpenChange={(o) => !o && setActiveImage(null)}
        >
          <DialogContent className="max-w-3xl p-2">
            <div className="relative aspect-video w-full">
              <Image
                src={activeImage || "/placeholder.svg"}
                alt="Reference image"
                fill
                className="rounded-md object-contain"
                unoptimized
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
