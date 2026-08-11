"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Home,
  Clock,
  Star,
  Shield,
  ChevronRight,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useStore } from "@/components/store-provider"
import { getAreaIcon } from "@/lib/icons"

function NavLink({
  href,
  active,
  icon: Icon,
  children,
  onNavigate,
}: {
  href: string
  active: boolean
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  onNavigate?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span className="truncate">{children}</span>
    </Link>
  )
}

export function Sidebar({
  className,
  onNavigate,
}: {
  className?: string
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const { areas, areaStats, canAdmin } = useStore()

  return (
    <aside
      className={cn(
        "flex w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar",
        className,
      )}
    >
      <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-5">
        <div className="relative flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-md">
          <Image
            src="/s-interio-logo.webp"
            alt="S-interio"
            fill
            className="object-contain"
          />
        </div>
        <span className="text-[0.95rem] font-semibold tracking-tight text-sidebar-foreground">
          S-interio
        </span>
        <span className="ml-auto rounded-md bg-sidebar-accent px-1.5 py-0.5 text-[10px] font-medium text-sidebar-accent-foreground">
          KB
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="flex flex-col gap-0.5">
          <NavLink
            href="/"
            active={pathname === "/"}
            icon={Home}
            onNavigate={onNavigate}
          >
            Home
          </NavLink>
        </div>

        <div className="mt-6">
          <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
            Areas
          </p>
          <div className="flex flex-col gap-0.5">
            {areas.map((area) => {
              const Icon = getAreaIcon(area.icon)
              const href = `/areas/${area.slug}`
              const active = pathname === href
              const { count } = areaStats(area.slug)
              return (
                <Link
                  key={area.slug}
                  href={href}
                  onClick={onNavigate}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                  )}
                >
                  <Icon
                    className="size-4 shrink-0"
                    style={{ color: area.color }}
                  />
                  <span className="truncate">{area.name}</span>
                  <span className="ml-auto text-xs tabular-nums text-sidebar-foreground/40">
                    {count}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-0.5">
          <NavLink
            href="/recent"
            active={pathname === "/recent"}
            icon={Clock}
            onNavigate={onNavigate}
          >
            Recent
          </NavLink>
          <NavLink
            href="/favorites"
            active={pathname === "/favorites"}
            icon={Star}
            onNavigate={onNavigate}
          >
            Favorites
          </NavLink>
          <NavLink
            href="/team"
            active={pathname === "/team"}
            icon={Users}
            onNavigate={onNavigate}
          >
            Team
          </NavLink>
          {canAdmin && (
            <NavLink
              href="/admin"
              active={pathname.startsWith("/admin")}
              icon={Shield}
              onNavigate={onNavigate}
            >
              Admin
            </NavLink>
          )}
        </div>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Link
          href="/admin"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            !canAdmin && "pointer-events-none opacity-0",
          )}
          aria-hidden={!canAdmin}
        >
          <span>Manage workspace</span>
          <ChevronRight className="ml-auto size-3.5" />
        </Link>
      </div>
    </aside>
  )
}
