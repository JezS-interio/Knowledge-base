import Link from "next/link"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AccessDenied({ message }: { message?: string }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center py-24 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Lock className="h-5 w-5 text-muted-foreground" />
      </div>
      <h1 className="mt-4 text-lg font-semibold">Access restricted</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {message ?? "You do not have permission to view this page."}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Switch roles from the account menu in the top bar to continue.
      </p>
      <Button asChild variant="outline" className="mt-5 bg-transparent">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  )
}
