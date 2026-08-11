"use client"

import * as React from "react"
import { toast } from "sonner"
import { Users } from "lucide-react"
import { useStore } from "@/components/store-provider"
import { Breadcrumbs } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"

const ROLE_LABEL = {
  administrator: "Admin",
  editor: "Editor",
  viewer: "Viewer",
}

function Avatar({
  name,
  color,
  size = "md",
}: {
  name: string
  color: string
  size?: "sm" | "md" | "lg"
}) {
  const letter = name.trim()[0]?.toUpperCase() ?? "?"
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        size === "sm" && "size-8 text-sm",
        size === "md" && "size-10 text-base",
        size === "lg" && "size-14 text-xl",
      )}
      style={{ backgroundColor: color }}
    >
      {letter}
    </span>
  )
}

export default function TeamPage() {
  const { users, currentUser, updateUser, canAdmin } = useStore()

  const [name, setName] = React.useState(currentUser.name)
  const [position, setPosition] = React.useState(currentUser.position ?? "")

  React.useEffect(() => {
    setName(currentUser.name)
    setPosition(currentUser.position ?? "")
  }, [currentUser])

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    updateUser(currentUser.id, { name: name.trim(), position: position.trim() || undefined })
    toast.success("Profile saved.")
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 lg:px-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Team" }]} />

      {/* Profile section */}
      <section className="mt-5">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Tu perfil
        </p>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <Avatar name={currentUser.name} color={currentUser.color} size="lg" />
            <div>
              <p className="font-semibold">{currentUser.email}</p>
              <p className="text-xs text-muted-foreground">
                {ROLE_LABEL[currentUser.role]} · cambiar rol desde el menú de perfil
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="profile-name">Nombre</Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="profile-position">Cargo</Label>
              <Input
                id="profile-position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Tech Lead, Backend, Infra…"
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" size="sm">Guardar perfil</Button>
            </div>
          </form>
        </div>
      </section>

      {/* Members list */}
      <section className="mt-8">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Miembros ({users.length})
        </p>
        <div className="rounded-xl border border-border bg-card divide-y divide-border">
          {users.map((u) => {
            const isCurrent = u.id === currentUser.id
            return (
              <div key={u.id} className="flex items-center gap-3 px-4 py-3">
                <Avatar name={u.name} color={u.color} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-sm font-medium">
                    {u.name}
                    {isCurrent && (
                      <span className="text-xs font-normal text-muted-foreground">(vos)</span>
                    )}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {u.email}
                    {u.joinedAt && (
                      <> · se unió {formatDate(u.joinedAt)}</>
                    )}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "shrink-0 text-xs",
                    u.role === "administrator" && "border-primary/40 text-primary",
                  )}
                >
                  {ROLE_LABEL[u.role]}
                </Badge>
              </div>
            )
          })}
        </div>
        {canAdmin && (
          <p className="mt-3 text-xs text-muted-foreground">
            Los <span className="font-medium text-foreground">administradores</span> pueden gestionar usuarios y roles desde{" "}
            <a href="/admin" className="underline underline-offset-2 hover:text-foreground">Admin → Users</a>.
          </p>
        )}
      </section>
    </div>
  )
}
