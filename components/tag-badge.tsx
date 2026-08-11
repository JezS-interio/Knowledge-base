import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function TagBadge({
  tag,
  href,
  className,
}: {
  tag: string
  href?: string
  className?: string
}) {
  const content = (
    <>
      <span className="text-muted-foreground/70">#</span>
      {tag}
    </>
  )
  if (href) {
    return (
      <Badge
        variant="outline"
        className={cn("gap-0.5 font-normal", className)}
        render={<Link href={href} />}
      >
        {content}
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className={cn("gap-0.5 font-normal", className)}>
      {content}
    </Badge>
  )
}
