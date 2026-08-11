"use client"

import * as React from "react"
import { UploadCloud, X, ImageIcon } from "lucide-react"
import type { ProblemImage } from "@/lib/types"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function ImageUploader({
  value,
  onChange,
}: {
  value: ProblemImage[]
  onChange: (images: ProblemImage[]) => void
}) {
  const [dragging, setDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const addFiles = React.useCallback(
    async (files: FileList | File[]) => {
      const images: ProblemImage[] = []
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`)
          continue
        }
        const url = await readFile(file)
        images.push({
          id: `img-${Math.random().toString(36).slice(2, 9)}`,
          url,
          caption: file.name.replace(/\.[^.]+$/, ""),
        })
      }
      if (images.length) onChange([...value, ...images])
    },
    [onChange, value],
  )

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          void addFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-8 text-center transition-colors",
          dragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-ring/40 hover:bg-muted/40",
        )}
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-muted">
          <UploadCloud className="size-5 text-muted-foreground" />
        </span>
        <p className="text-sm font-medium">
          Drag &amp; drop images, or{" "}
          <span className="text-primary">browse</span>
        </p>
        <p className="text-xs text-muted-foreground">
          Screenshots, error messages, dashboards, diagrams
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) void addFiles(e.target.files)
            e.target.value = ""
          }}
        />
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((img) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-lg border border-border bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url || "/placeholder.svg"}
                alt={img.caption || "Uploaded image"}
                className="aspect-video w-full object-cover"
              />
              <button
                type="button"
                onClick={() =>
                  onChange(value.filter((i) => i.id !== img.id))
                }
                aria-label="Delete image"
                className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-md bg-background/90 text-foreground opacity-0 shadow-sm transition-opacity hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
              >
                <X className="size-3.5" />
              </button>
              <div className="flex items-center gap-1.5 border-t border-border bg-card px-2 py-1.5">
                <ImageIcon className="size-3 shrink-0 text-muted-foreground" />
                <input
                  value={img.caption ?? ""}
                  onChange={(e) =>
                    onChange(
                      value.map((i) =>
                        i.id === img.id
                          ? { ...i, caption: e.target.value }
                          : i,
                      ),
                    )
                  }
                  placeholder="Caption"
                  className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
