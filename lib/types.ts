export type Role = "administrator" | "editor" | "viewer"

export interface Area {
  slug: string
  name: string
  description: string
  /** oklch color string used for accent chips */
  color: string
  /** lucide icon key, resolved in lib/icons */
  icon: string
}

export interface ProblemImage {
  id: string
  url: string
  caption?: string
}

export interface Problem {
  id: string
  areaSlug: string
  title: string
  description: string
  solution: string
  tags: string[]
  images: ProblemImage[]
  author: string
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  email: string
  role: Role
  color: string
  position?: string
  joinedAt?: string
}
