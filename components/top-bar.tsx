"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, Search, Plus, Check, ChevronDown, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { SearchDialog } from "@/components/search-dialog"
import { useStore } from "@/components/store-provider"
import { cn } from "@/lib/utils"

const ROLE_LABEL: Record<string, string> = {
  administrator: "Administrator",
  editor: "Editor",
  viewer: "Viewer",
}

function initials(name: string): string {
  return name.trim()[0]?.toUpperCase() ?? "?"
}

export function TopBar({ onMenu }: { onMenu: () => void }) {
  const { users, currentUser, setCurrentUser, canEdit } = useStore()
  const [searchOpen, setSearchOpen] = React.useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-6">
      <Button
        variant="ghost"
        size="icon-sm"
        className="lg:hidden"
        onClick={onMenu}
        aria-label="Open navigation"
      >
        <Menu />
      </Button>

      <button
        onClick={() => setSearchOpen(true)}
        className="flex h-9 max-w-md flex-1 items-center gap-2.5 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:border-ring/40 hover:bg-muted/50"
      >
        <Search className="size-4 shrink-0" />
        <span className="flex-1 text-left">Search problems...</span>
        <kbd className="hidden rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:inline">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {resolvedTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
        {canEdit && (
          <Button
            size="sm"
            render={<Link href="/problems/new" />}
            className="hidden sm:inline-flex"
          >
            <Plus />
            Add Problem
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="h-9 gap-2 pr-2 pl-1.5" />
            }
          >
            <span
              className="flex size-6 items-center justify-center rounded-full text-[11px] font-semibold text-white"
              style={{ backgroundColor: currentUser.color }}
            >
              {initials(currentUser.name)}
            </span>
            <span className="hidden text-sm font-medium sm:inline">
              {currentUser.name.split(" ")[0]}
            </span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {currentUser.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {currentUser.email}
                  </span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-[11px] uppercase tracking-wider">
                Switch account (demo roles)
              </DropdownMenuLabel>
              {users.map((u) => (
                <DropdownMenuItem
                  key={u.id}
                  onClick={() => setCurrentUser(u.id)}
                  className="gap-2.5"
                >
                  <span
                    className="flex size-6 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                    style={{ backgroundColor: u.color }}
                  >
                    {initials(u.name)}
                  </span>
                  <span className="flex flex-1 flex-col">
                    <span className="text-sm">{u.name}</span>
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "shrink-0",
                      u.role === "administrator" && "text-primary",
                    )}
                  >
                    {ROLE_LABEL[u.role]}
                  </Badge>
                  {u.id === currentUser.id && (
                    <Check className="size-4 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  )
}
