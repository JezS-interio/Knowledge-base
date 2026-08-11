"use client"

import * as React from "react"
import {
  INITIAL_AREAS,
  INITIAL_PROBLEMS,
  INITIAL_USERS,
} from "@/lib/data"
import type { Area, Problem, Role, User } from "@/lib/types"

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

export interface ProblemInput {
  areaSlug: string
  title: string
  description: string
  solution: string
  tags: string[]
  images: Problem["images"]
  author?: string
}

interface StoreContextValue {
  areas: Area[]
  problems: Problem[]
  users: User[]
  tags: string[]
  currentUser: User
  role: Role
  canEdit: boolean
  canAdmin: boolean
  favorites: string[]
  // selectors
  getArea: (slug: string) => Area | undefined
  getProblem: (id: string) => Problem | undefined
  problemsByArea: (slug: string) => Problem[]
  areaStats: (slug: string) => { count: number; lastUpdated?: Problem }
  search: (query: string) => Problem[]
  relatedProblems: (problem: Problem) => Problem[]
  tagCounts: () => { tag: string; count: number }[]
  // problem actions
  addProblem: (input: ProblemInput) => Problem
  updateProblem: (id: string, input: ProblemInput) => void
  deleteProblem: (id: string) => void
  // area actions
  addArea: (data: Omit<Area, "slug"> & { slug?: string }) => void
  updateArea: (slug: string, data: Partial<Area>) => void
  deleteArea: (slug: string) => void
  // user actions
  addUser: (data: Omit<User, "id" | "color">) => void
  updateUser: (id: string, data: Partial<User>) => void
  deleteUser: (id: string) => void
  setCurrentUser: (id: string) => void
  // tag actions
  addTag: (tag: string) => void
  deleteTag: (tag: string) => void
  // favorites
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
}

const StoreContext = React.createContext<StoreContextValue | null>(null)

const AREA_COLORS = [
  "oklch(0.5 0.19 262)",
  "oklch(0.58 0.13 155)",
  "oklch(0.62 0.16 50)",
  "oklch(0.55 0.16 300)",
  "oklch(0.58 0.17 20)",
]

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [areas, setAreas] = React.useState<Area[]>(INITIAL_AREAS)
  const [problems, setProblems] = React.useState<Problem[]>(INITIAL_PROBLEMS)
  const [users, setUsers] = React.useState<User[]>(INITIAL_USERS)
  const [currentUserId, setCurrentUserId] = React.useState<string>(
    INITIAL_USERS[0].id,
  )
  const [favorites, setFavorites] = React.useState<string[]>([
    INITIAL_PROBLEMS[0].id,
    INITIAL_PROBLEMS[7].id,
  ])
  const [managedTags, setManagedTags] = React.useState<string[]>([])

  const currentUser =
    users.find((u) => u.id === currentUserId) ?? users[0]
  const role = currentUser.role
  const canEdit = role === "administrator" || role === "editor"
  const canAdmin = role === "administrator"

  const tags = React.useMemo(() => {
    const set = new Set<string>(managedTags)
    for (const p of problems) for (const t of p.tags) set.add(t)
    return Array.from(set).sort()
  }, [problems, managedTags])

  const getArea = React.useCallback(
    (slug: string) => areas.find((a) => a.slug === slug),
    [areas],
  )

  const getProblem = React.useCallback(
    (id: string) => problems.find((p) => p.id === id),
    [problems],
  )

  const problemsByArea = React.useCallback(
    (slug: string) => problems.filter((p) => p.areaSlug === slug),
    [problems],
  )

  const areaStats = React.useCallback(
    (slug: string) => {
      const list = problems.filter((p) => p.areaSlug === slug)
      const lastUpdated = [...list].sort(
        (a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt),
      )[0]
      return { count: list.length, lastUpdated }
    },
    [problems],
  )

  const search = React.useCallback(
    (query: string) => {
      const q = query.trim().toLowerCase()
      if (!q) return []
      return problems.filter((p) => {
        const area = areas.find((a) => a.slug === p.areaSlug)
        const haystack = [
          p.title,
          p.description,
          p.solution,
          p.tags.join(" "),
          area?.name ?? "",
        ]
          .join(" ")
          .toLowerCase()
        return haystack.includes(q)
      })
    },
    [problems, areas],
  )

  const relatedProblems = React.useCallback(
    (problem: Problem) => {
      return problems
        .filter((p) => p.id !== problem.id)
        .map((p) => {
          const sharedTags = p.tags.filter((t) =>
            problem.tags.includes(t),
          ).length
          const sameArea = p.areaSlug === problem.areaSlug ? 1 : 0
          return { p, score: sharedTags * 2 + sameArea }
        })
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map((x) => x.p)
    },
    [problems],
  )

  const tagCounts = React.useCallback(() => {
    const counts = new Map<string, number>()
    for (const t of managedTags) counts.set(t, counts.get(t) ?? 0)
    for (const p of problems)
      for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
    return Array.from(counts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
  }, [problems, managedTags])

  const addProblem = React.useCallback(
    (input: ProblemInput) => {
      const nowIso = new Date().toISOString()
      const problem: Problem = {
        id: uid("p"),
        areaSlug: input.areaSlug,
        title: input.title,
        description: input.description,
        solution: input.solution,
        tags: input.tags,
        images: input.images,
        author: input.author ?? currentUser.name,
        createdAt: nowIso,
        updatedAt: nowIso,
      }
      setProblems((prev) => [problem, ...prev])
      return problem
    },
    [currentUser.name],
  )

  const updateProblem = React.useCallback(
    (id: string, input: ProblemInput) => {
      setProblems((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                ...input,
                updatedAt: new Date().toISOString(),
              }
            : p,
        ),
      )
    },
    [],
  )

  const deleteProblem = React.useCallback((id: string) => {
    setProblems((prev) => prev.filter((p) => p.id !== id))
    setFavorites((prev) => prev.filter((f) => f !== id))
  }, [])

  const addArea = React.useCallback(
    (data: Omit<Area, "slug"> & { slug?: string }) => {
      setAreas((prev) => {
        const slug = data.slug || slugify(data.name)
        if (prev.some((a) => a.slug === slug)) return prev
        const color =
          data.color || AREA_COLORS[prev.length % AREA_COLORS.length]
        return [
          ...prev,
          {
            slug,
            name: data.name,
            description: data.description,
            color,
            icon: data.icon || "folder",
          },
        ]
      })
    },
    [],
  )

  const updateArea = React.useCallback(
    (slug: string, data: Partial<Area>) => {
      setAreas((prev) =>
        prev.map((a) => (a.slug === slug ? { ...a, ...data } : a)),
      )
    },
    [],
  )

  const deleteArea = React.useCallback((slug: string) => {
    setAreas((prev) => prev.filter((a) => a.slug !== slug))
    setProblems((prev) => prev.filter((p) => p.areaSlug !== slug))
  }, [])

  const addUser = React.useCallback((data: Omit<User, "id" | "color">) => {
    setUsers((prev) => [
      ...prev,
      {
        ...data,
        id: uid("u"),
        color: AREA_COLORS[prev.length % AREA_COLORS.length],
      },
    ])
  }, [])

  const updateUser = React.useCallback((id: string, data: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)))
  }, [])

  const deleteUser = React.useCallback(
    (id: string) => {
      setUsers((prev) => {
        if (prev.length <= 1) return prev
        return prev.filter((u) => u.id !== id)
      })
      setCurrentUserId((cur) => (cur === id ? INITIAL_USERS[0].id : cur))
    },
    [],
  )

  const addTag = React.useCallback((tag: string) => {
    const clean = tag.trim().toLowerCase()
    if (!clean) return
    setManagedTags((prev) => (prev.includes(clean) ? prev : [...prev, clean]))
  }, [])

  const deleteTag = React.useCallback((tag: string) => {
    setManagedTags((prev) => prev.filter((t) => t !== tag))
    setProblems((prev) =>
      prev.map((p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) })),
    )
  }, [])

  const toggleFavorite = React.useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    )
  }, [])

  const isFavorite = React.useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  )

  const value: StoreContextValue = {
    areas,
    problems,
    users,
    tags,
    currentUser,
    role,
    canEdit,
    canAdmin,
    favorites,
    getArea,
    getProblem,
    problemsByArea,
    areaStats,
    search,
    relatedProblems,
    tagCounts,
    addProblem,
    updateProblem,
    deleteProblem,
    addArea,
    updateArea,
    deleteArea,
    addUser,
    updateUser,
    deleteUser,
    setCurrentUser: setCurrentUserId,
    addTag,
    deleteTag,
    toggleFavorite,
    isFavorite,
  }

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  )
}

export function useStore(): StoreContextValue {
  const ctx = React.useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
