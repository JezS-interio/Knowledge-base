"use client"

import { use } from "react"
import Link from "next/link"
import { useStore } from "@/components/store-provider"
import { ProblemForm } from "@/components/problem-form"
import { Breadcrumb } from "@/components/breadcrumb"
import { AccessDenied } from "@/components/access-denied"
import { Button } from "@/components/ui/button"

export default function EditProblemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { getProblem, getArea, canEdit } = useStore()
  const problem = getProblem(id)

  if (!canEdit) {
    return <AccessDenied message="You need editor access to edit problems." />
  }

  if (!problem) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-lg font-semibold">Problem not found</h1>
        <Button asChild variant="outline" className="mt-4 bg-transparent">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    )
  }

  const area = getArea(problem.areaSlug)

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 lg:px-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          ...(area
            ? [{ label: area.name, href: `/areas/${area.slug}` }]
            : []),
          { label: problem.title, href: `/problems/${problem.id}` },
          { label: "Edit" },
        ]}
      />
      <header className="mb-6 mt-2">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          Edit problem
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update the details, solution, images, or tags for this entry.
        </p>
      </header>
      <ProblemForm problem={problem} />
    </div>
  )
}
