"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, CornerDownLeft, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/components/store-provider"
import { getAreaIcon } from "@/lib/icons"
import { relativeTime } from "@/lib/format"
import { cn } from "@/lib/utils"

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const { search, getArea, problems } = useStore()
  const [query, setQuery] = React.useState("")
  const [active, setActive] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const results = React.useMemo(
    () => (query.trim() ? search(query).slice(0, 8) : []),
    [query, search],
  )

  React.useEffect(() => {
    if (open) {
      setQuery("")
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 40)
    }
  }, [open])

  React.useEffect(() => setActive(0), [query])

  const go = React.useCallback(
    (id: string) => {
      onOpenChange(false)
      router.push(`/problems/${id}`)
    },
    [onOpenChange, router],
  )

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault()
      go(results[active].id)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-[15%] max-w-xl translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl"
      >
        <DialogTitle className="sr-only">Search problems</DialogTitle>
        <div className="flex items-center gap-3 border-b px-4">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search problems, solutions, tags..."
            className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            ESC
          </kbd>
        </div>

        <div className="max-h-[22rem] overflow-y-auto p-2">
          {!query.trim() && (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              Start typing to search across all {problems.length} documented
              problems.
            </p>
          )}
          {query.trim() && results.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              No problems found for{" "}
              <span className="font-medium text-foreground">
                &ldquo;{query}&rdquo;
              </span>
            </p>
          )}
          {results.map((p, i) => {
            const area = getArea(p.areaSlug)
            const Icon = area ? getAreaIcon(area.icon) : FileText
            return (
              <button
                key={p.id}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(p.id)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                  active === i ? "bg-accent" : "hover:bg-muted",
                )}
              >
                <span
                  className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md"
                  style={{
                    backgroundColor: area
                      ? `color-mix(in oklch, ${area.color} 12%, transparent)`
                      : undefined,
                    color: area?.color,
                  }}
                >
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">
                      {p.title}
                    </span>
                    {area && (
                      <Badge variant="outline" className="shrink-0">
                        {area.name}
                      </Badge>
                    )}
                  </span>
                  <span className="mt-0.5 line-clamp-1 block text-xs text-muted-foreground">
                    {p.description}
                  </span>
                </span>
                <span className="mt-0.5 hidden shrink-0 text-[11px] text-muted-foreground sm:block">
                  {relativeTime(p.updatedAt)}
                </span>
                {active === i && (
                  <CornerDownLeft className="mt-1 size-3.5 shrink-0 text-muted-foreground" />
                )}
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
