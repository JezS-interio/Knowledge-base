"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useStore, type ProblemInput } from "@/components/store-provider"
import type { Problem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TagInput } from "@/components/tag-input"
import { ImageUploader } from "@/components/image-uploader"

interface ProblemFormProps {
  /** existing problem when editing */
  problem?: Problem
  /** preselected area when creating */
  defaultAreaSlug?: string
}

export function ProblemForm({ problem, defaultAreaSlug }: ProblemFormProps) {
  const router = useRouter()
  const { areas, tags, addProblem, updateProblem } = useStore()
  const isEditing = Boolean(problem)

  const [areaSlug, setAreaSlug] = useState(
    problem?.areaSlug ?? defaultAreaSlug ?? areas[0]?.slug ?? "",
  )
  const [title, setTitle] = useState(problem?.title ?? "")
  const [description, setDescription] = useState(problem?.description ?? "")
  const [solution, setSolution] = useState(problem?.solution ?? "")
  const [problemTags, setProblemTags] = useState<string[]>(problem?.tags ?? [])
  const [images, setImages] = useState<Problem["images"]>(
    problem?.images ?? [],
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!title.trim()) next.title = "A title is required."
    if (!areaSlug) next.areaSlug = "Choose an area."
    if (!description.trim()) next.description = "Describe the problem."
    if (!solution.trim()) next.solution = "Add a solution or workaround."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) {
      toast.error("Please fix the highlighted fields.")
      return
    }
    const input: ProblemInput = {
      areaSlug,
      title: title.trim(),
      description: description.trim(),
      solution: solution.trim(),
      tags: problemTags,
      images,
    }
    if (isEditing && problem) {
      updateProblem(problem.id, input)
      toast.success("Problem updated.")
      router.push(`/problems/${problem.id}`)
    } else {
      const created = addProblem(input)
      toast.success("Problem published.")
      router.push(`/problems/${created.id}`)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-8 items-start">
        {/* main document column */}
        <div className="min-w-0 flex-1 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short, searchable summary of the problem"
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Problem description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is happening? Include symptoms, error messages, and when it occurs."
              className="min-h-32"
              aria-invalid={Boolean(errors.description)}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="solution">Solution / workaround</Label>
            <Textarea
              id="solution"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="Steps to resolve. Use blank lines for paragraphs, and - for bullet points."
              className="min-h-40"
              aria-invalid={Boolean(errors.solution)}
            />
            <p className="text-xs text-muted-foreground">
              {"Formatting: use a blank line for a new paragraph, lines starting with - for bullets, and `code` for inline code."}
            </p>
            {errors.solution && (
              <p className="text-xs text-destructive">{errors.solution}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Reference images</Label>
            <ImageUploader value={images} onChange={setImages} />
          </div>
        </div>

        {/* sticky properties sidebar */}
        <div className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-20 space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="area">Area</Label>
              <Select value={areaSlug} onValueChange={setAreaSlug}>
                <SelectTrigger id="area" className="w-full">
                  <SelectValue placeholder="Select an area" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((a) => (
                    <SelectItem key={a.slug} value={a.slug}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.areaSlug && (
                <p className="text-xs text-destructive">{errors.areaSlug}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <TagInput
                value={problemTags}
                onChange={setProblemTags}
                suggestions={tags}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button type="submit" className="w-full">
              {isEditing ? "Save changes" : "Publish problem"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
          </div>
        </div>

        {/* mobile: area + tags + submit below content */}
        <div className="lg:hidden space-y-4 mt-2">
          <div className="rounded-xl border border-border bg-card p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="area-mobile">Area</Label>
              <Select value={areaSlug} onValueChange={setAreaSlug}>
                <SelectTrigger id="area-mobile" className="w-full">
                  <SelectValue placeholder="Select an area" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((a) => (
                    <SelectItem key={a.slug} value={a.slug}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.areaSlug && (
                <p className="text-xs text-destructive">{errors.areaSlug}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Tags</Label>
              <TagInput value={problemTags} onChange={setProblemTags} suggestions={tags} />
            </div>
          </div>
          <Button type="submit" className="w-full">
            {isEditing ? "Save changes" : "Publish problem"}
          </Button>
          <Button type="button" variant="ghost" className="w-full" onClick={() => router.back()}>Cancel</Button>
        </div>
      </div>
    </form>
  )
}
