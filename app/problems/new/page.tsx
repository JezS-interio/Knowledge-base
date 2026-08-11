"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useStore } from "@/components/store-provider"
import { ProblemForm } from "@/components/problem-form"
import { Breadcrumb } from "@/components/breadcrumb"
import { AccessDenied } from "@/components/access-denied"

function NewProblemContent() {
  const { canEdit } = useStore()
  const searchParams = useSearchParams()
  const area = searchParams.get("area") ?? undefined

  if (!canEdit) {
    return <AccessDenied message="You need editor access to add problems." />
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 lg:px-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "New problem" },
        ]}
      />
      <header className="mb-6 mt-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Add a problem
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Document a recurring issue and its solution so the team can find it later.
        </p>
      </header>
      <ProblemForm defaultAreaSlug={area} />
    </div>
  )
}

export default function NewProblemPage() {
  return (
    <Suspense fallback={null}>
      <NewProblemContent />
    </Suspense>
  )
}
