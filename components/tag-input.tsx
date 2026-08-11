"use client"

import { useState, type KeyboardEvent } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  suggestions?: string[]
  placeholder?: string
}

export function TagInput({
  value,
  onChange,
  suggestions = [],
  placeholder = "Add a tag and press Enter",
}: TagInputProps) {
  const [draft, setDraft] = useState("")

  function addTag(raw: string) {
    const tag = raw.trim().toLowerCase()
    if (!tag) return
    if (value.includes(tag)) {
      setDraft("")
      return
    }
    onChange([...value, tag])
    setDraft("")
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag))
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(draft)
    } else if (e.key === "Backspace" && !draft && value.length) {
      removeTag(value[value.length - 1])
    }
  }

  const filteredSuggestions = suggestions
    .filter((s) => !value.includes(s))
    .filter((s) => (draft ? s.includes(draft.toLowerCase()) : true))
    .slice(0, 6)

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-input bg-background px-2 py-1.5 focus-within:ring-2 focus-within:ring-ring/40">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground"
          >
            <span className="text-accent-foreground/60">#</span>
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="rounded-full p-0.5 hover:bg-background/60"
              aria-label={`Remove ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addTag(draft)}
          placeholder={value.length ? "" : placeholder}
          className="min-w-[8rem] flex-1 bg-transparent px-1 py-0.5 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      {filteredSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs text-muted-foreground">Suggestions:</span>
          {filteredSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addTag(s)}
              className={cn(
                "rounded-full border border-dashed border-border px-2 py-0.5 text-xs text-muted-foreground",
                "transition-colors hover:border-ring/40 hover:text-foreground",
              )}
            >
              #{s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
