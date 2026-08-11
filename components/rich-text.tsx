import { cn } from "@/lib/utils"

/**
 * Lightweight renderer for the plain-text "rich" fields.
 * Supports numbered lists (lines starting "1."), bullet lists ("-" / "*"),
 * and paragraphs separated by blank lines.
 */
export function RichText({
  content,
  className,
}: {
  content: string
  className?: string
}) {
  const lines = content.split("\n")
  const blocks: React.ReactNode[] = []
  let list: { type: "ol" | "ul"; items: string[] } | null = null

  const flush = (key: number) => {
    if (!list) return
    if (list.type === "ol") {
      blocks.push(
        <ol
          key={`ol-${key}`}
          className="ml-1 flex list-none flex-col gap-2"
        >
          {list.items.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                {i + 1}
              </span>
              <span className="pt-px leading-relaxed">{item}</span>
            </li>
          ))}
        </ol>,
      )
    } else {
      blocks.push(
        <ul key={`ul-${key}`} className="ml-1 flex flex-col gap-1.5">
          {list.items.map((item, i) => (
            <li key={i} className="flex gap-3 leading-relaxed">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
              <span>{item}</span>
            </li>
          ))}
        </ul>,
      )
    }
    list = null
  }

  lines.forEach((raw, idx) => {
    const line = raw.trim()
    if (!line) {
      flush(idx)
      return
    }
    const ol = line.match(/^\d+[.)]\s+(.*)$/)
    const ul = line.match(/^[-*]\s+(.*)$/)
    if (ol) {
      if (list?.type !== "ol") flush(idx)
      list = list?.type === "ol" ? list : { type: "ol", items: [] }
      list.items.push(ol[1])
    } else if (ul) {
      if (list?.type !== "ul") flush(idx)
      list = list?.type === "ul" ? list : { type: "ul", items: [] }
      list.items.push(ul[1])
    } else {
      flush(idx)
      blocks.push(
        <p key={`p-${idx}`} className="leading-relaxed">
          {line}
        </p>,
      )
    }
  })
  flush(lines.length)

  return (
    <div className={cn("flex flex-col gap-4 text-[0.9375rem]", className)}>
      {blocks}
    </div>
  )
}
