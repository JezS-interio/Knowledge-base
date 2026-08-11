"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Pencil,
  Trash2,
  Plus,
  X,
  Check,
  Users,
  LayoutGrid,
  FileText,
  Tag,
} from "lucide-react"
import { useStore } from "@/components/store-provider"
import { AccessDenied } from "@/components/access-denied"
import { Breadcrumbs } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getAreaIcon } from "@/lib/icons"
import { cn } from "@/lib/utils"
import type { Area, User } from "@/lib/types"

type Tab = "areas" | "problems" | "users" | "tags"

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "areas", label: "Areas", icon: LayoutGrid },
  { id: "problems", label: "Problems", icon: FileText },
  { id: "users", label: "Users", icon: Users },
  { id: "tags", label: "Tags", icon: Tag },
]

const ROLE_LABELS = {
  administrator: "Administrator",
  editor: "Editor",
  viewer: "Viewer",
}

const ICON_OPTIONS = [
  "shield-check",
  "wallet",
  "workflow",
  "trending-up",
  "cpu",
  "folder",
]

const AREA_COLORS = [
  "oklch(0.5 0.19 262)",
  "oklch(0.58 0.13 155)",
  "oklch(0.62 0.16 50)",
  "oklch(0.55 0.16 300)",
  "oklch(0.58 0.17 20)",
]

// ─── Areas Tab ────────────────────────────────────────────────────────────────

function AreasTab() {
  const { areas, areaStats, addArea, updateArea, deleteArea } = useStore()
  const [editSlug, setEditSlug] = React.useState<string | null>(null)
  const [deleteSlug, setDeleteSlug] = React.useState<string | null>(null)
  const [form, setForm] = React.useState({ name: "", description: "", icon: "folder", color: AREA_COLORS[0] })
  const [editForm, setEditForm] = React.useState<Partial<Area>>({})
  const [adding, setAdding] = React.useState(false)

  function startEdit(area: Area) {
    setEditSlug(area.slug)
    setEditForm({ name: area.name, description: area.description, icon: area.icon, color: area.color })
  }

  function saveEdit() {
    if (!editSlug || !editForm.name?.trim()) return
    updateArea(editSlug, editForm)
    toast.success("Area updated.")
    setEditSlug(null)
  }

  function handleAdd() {
    if (!form.name.trim()) { toast.error("Name is required."); return }
    addArea(form)
    toast.success("Area created.")
    setForm({ name: "", description: "", icon: "folder", color: AREA_COLORS[0] })
    setAdding(false)
  }

  const areaToDelete = areas.find((a) => a.slug === deleteSlug)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{areas.length} areas</p>
        <Button size="sm" onClick={() => setAdding(true)}>
          <Plus /> New Area
        </Button>
      </div>

      {adding && (
        <div className="rounded-xl border border-primary/30 bg-card p-4 space-y-3">
          <h3 className="text-sm font-semibold">New area</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="new-area-name">Name</Label>
              <Input id="new-area-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Area name" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new-area-icon">Icon</Label>
              <Select value={form.icon} onValueChange={(v) => setForm((f) => ({ ...f, icon: v }))}>
                <SelectTrigger id="new-area-icon"><SelectValue /></SelectTrigger>
                <SelectContent>{ICON_OPTIONS.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="new-area-desc">Description</Label>
              <Input id="new-area-desc" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Short description" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" className="bg-transparent" onClick={() => setAdding(false)}>Cancel</Button>
            <Button size="sm" onClick={handleAdd}>Create</Button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Area</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">Problems</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {areas.map((area) => {
              const Icon = getAreaIcon(area.icon)
              const { count } = areaStats(area.slug)
              const isEditing = editSlug === area.slug
              return (
                <tr key={area.slug} className="bg-card">
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <div className="flex flex-col gap-2">
                        <Input
                          value={editForm.name ?? ""}
                          onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                          className="h-8 text-sm"
                        />
                        <Input
                          value={editForm.description ?? ""}
                          onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                          className="h-8 text-sm"
                          placeholder="Description"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 items-center justify-center rounded-lg" style={{ backgroundColor: `color-mix(in oklch, ${area.color} 14%, transparent)`, color: area.color }}>
                          <Icon className="size-4" />
                        </span>
                        <div>
                          <p className="font-medium">{area.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-xs">{area.description}</p>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{count}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      {isEditing ? (
                        <>
                          <Button variant="outline" size="icon" className="size-8 bg-transparent" onClick={() => setEditSlug(null)}>
                            <X className="size-3.5" />
                          </Button>
                          <Button size="icon" className="size-8" onClick={saveEdit}>
                            <Check className="size-3.5" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="outline" size="icon" className="size-8 bg-transparent" onClick={() => startEdit(area)}>
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-8 bg-transparent text-destructive hover:text-destructive"
                            onClick={() => setDeleteSlug(area.slug)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={Boolean(deleteSlug)} onOpenChange={(o) => !o && setDeleteSlug(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete area</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{areaToDelete?.name}</strong>? All problems in this area will also be deleted. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" className="bg-transparent" />}>Cancel</DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                deleteArea(deleteSlug!)
                toast.success("Area deleted.")
                setDeleteSlug(null)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Problems Tab ─────────────────────────────────────────────────────────────

function ProblemsTab() {
  const router = useRouter()
  const { problems, getArea, deleteProblem } = useStore()
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  const sorted = [...problems].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{problems.length} problems</p>
        <Button size="sm" onClick={() => router.push("/problems/new")}>
          <Plus /> New Problem
        </Button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">Area</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">Author</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sorted.map((p) => {
              const area = getArea(p.areaSlug)
              return (
                <tr key={p.id} className="bg-card">
                  <td className="px-4 py-3">
                    <p className="font-medium truncate max-w-xs">{p.title}</p>
                    <p className="text-xs text-muted-foreground md:hidden">{area?.name}</p>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{area?.name}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">{p.author}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="outline" size="icon" className="size-8 bg-transparent" onClick={() => router.push(`/problems/${p.id}/edit`)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-8 bg-transparent text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(p.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={Boolean(deleteId)} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete problem</DialogTitle>
            <DialogDescription>This will permanently delete this problem. This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" className="bg-transparent" />}>Cancel</DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                deleteProblem(deleteId!)
                toast.success("Problem deleted.")
                setDeleteId(null)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Users Tab ────────────────────────────────────────────────────────────────

function UsersTab() {
  const { users, currentUser, addUser, updateUser, deleteUser, setCurrentUser } = useStore()
  const [editId, setEditId] = React.useState<string | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [editForm, setEditForm] = React.useState<Partial<User>>({})
  const [adding, setAdding] = React.useState(false)
  const [newForm, setNewForm] = React.useState({ name: "", email: "", role: "viewer" as User["role"] })

  function startEdit(u: User) {
    setEditId(u.id)
    setEditForm({ name: u.name, email: u.email, role: u.role })
  }

  function saveEdit() {
    if (!editId || !editForm.name?.trim()) return
    updateUser(editId, editForm)
    toast.success("User updated.")
    setEditId(null)
  }

  function handleAdd() {
    if (!newForm.name.trim() || !newForm.email.trim()) { toast.error("Name and email are required."); return }
    addUser(newForm)
    toast.success("User created.")
    setNewForm({ name: "", email: "", role: "viewer" })
    setAdding(false)
  }

  const userToDelete = users.find((u) => u.id === deleteId)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{users.length} users</p>
        <Button size="sm" onClick={() => setAdding(true)}>
          <Plus /> New User
        </Button>
      </div>

      {adding && (
        <div className="rounded-xl border border-primary/30 bg-card p-4 space-y-3">
          <h3 className="text-sm font-semibold">New user</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input value={newForm.name} onChange={(e) => setNewForm((f) => ({ ...f, name: e.target.value }))} placeholder="Full name" />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input type="email" value={newForm.email} onChange={(e) => setNewForm((f) => ({ ...f, email: e.target.value }))} placeholder="email@company.com" />
            </div>
            <div className="space-y-1">
              <Label>Role</Label>
              <Select value={newForm.role} onValueChange={(v) => setNewForm((f) => ({ ...f, role: v as User["role"] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(ROLE_LABELS) as User["role"][]).map((r) => (
                    <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" className="bg-transparent" onClick={() => setAdding(false)}>Cancel</Button>
            <Button size="sm" onClick={handleAdd}>Create</Button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">User</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">Role</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => {
              const isEditing = editId === u.id
              const initials = u.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
              const isCurrent = u.id === currentUser.id
              return (
                <tr key={u.id} className="bg-card">
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <div className="flex flex-col gap-2">
                        <Input value={editForm.name ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} className="h-8 text-sm" placeholder="Name" />
                        <Input value={editForm.email ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} className="h-8 text-sm" placeholder="Email" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white" style={{ backgroundColor: u.color }}>
                          {initials}
                        </span>
                        <div>
                          <p className="font-medium flex items-center gap-2">
                            {u.name}
                            {isCurrent && <Badge variant="outline" className="text-[10px] py-0 h-4">You</Badge>}
                          </p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    {isEditing ? (
                      <Select value={editForm.role} onValueChange={(v) => setEditForm((f) => ({ ...f, role: v as User["role"] }))}>
                        <SelectTrigger className="h-8 text-sm w-36"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {(Object.keys(ROLE_LABELS) as User["role"][]).map((r) => (
                            <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-muted-foreground">{ROLE_LABELS[u.role]}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      {isEditing ? (
                        <>
                          <Button variant="outline" size="icon" className="size-8 bg-transparent" onClick={() => setEditId(null)}><X className="size-3.5" /></Button>
                          <Button size="icon" className="size-8" onClick={saveEdit}><Check className="size-3.5" /></Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 bg-transparent text-xs"
                            onClick={() => { setCurrentUser(u.id); toast.success(`Switched to ${u.name}`) }}
                          >
                            Switch to
                          </Button>
                          <Button variant="outline" size="icon" className="size-8 bg-transparent" onClick={() => startEdit(u)}><Pencil className="size-3.5" /></Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-8 bg-transparent text-destructive hover:text-destructive"
                            disabled={users.length <= 1}
                            onClick={() => setDeleteId(u.id)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={Boolean(deleteId)} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete user</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{userToDelete?.name}</strong>? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" className="bg-transparent" />}>Cancel</DialogClose>
            <Button variant="destructive" onClick={() => { deleteUser(deleteId!); toast.success("User deleted."); setDeleteId(null) }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Tags Tab ─────────────────────────────────────────────────────────────────

function TagsTab() {
  const { tagCounts, addTag, deleteTag } = useStore()
  const [newTag, setNewTag] = React.useState("")
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null)

  const counts = tagCounts()

  function handleAdd() {
    const t = newTag.trim().toLowerCase()
    if (!t) return
    addTag(t)
    toast.success(`Tag "${t}" created.`)
    setNewTag("")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="New tag name..."
          className="max-w-xs"
        />
        <Button size="sm" onClick={handleAdd}>
          <Plus /> Add Tag
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        {counts.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No tags yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {counts.map(({ tag, count }) => (
              <span
                key={tag}
                className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm"
              >
                <span className="text-muted-foreground">#</span>
                {tag}
                <span className="tabular-nums text-xs text-muted-foreground">({count})</span>
                <button
                  onClick={() => setDeleteTarget(tag)}
                  className="ml-0.5 rounded-full p-0.5 text-muted-foreground/40 transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label={`Delete tag ${tag}`}
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete tag</DialogTitle>
            <DialogDescription>
              Delete tag <strong>#{deleteTarget}</strong>? It will be removed from all problems that use it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" className="bg-transparent" />}>Cancel</DialogClose>
            <Button variant="destructive" onClick={() => { deleteTag(deleteTarget!); toast.success("Tag deleted."); setDeleteTarget(null) }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { canAdmin } = useStore()
  const [tab, setTab] = React.useState<Tab>("areas")

  if (!canAdmin) {
    return <AccessDenied message="Only administrators can access this section." />
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 lg:px-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Admin" }]} />

      <header className="mt-5 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Administration</h1>
        <p className="text-sm text-muted-foreground">
          Manage areas, problems, users, roles, and tags.
        </p>
      </header>

      <div className="mt-6 flex gap-1 border-b border-border">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              tab === id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "areas" && <AreasTab />}
        {tab === "problems" && <ProblemsTab />}
        {tab === "users" && <UsersTab />}
        {tab === "tags" && <TagsTab />}
      </div>
    </div>
  )
}
