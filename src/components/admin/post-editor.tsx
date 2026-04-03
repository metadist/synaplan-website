"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles, Eye, Code2, Loader2, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

interface PostData {
  id?: number;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  status?: PostStatus;
  locale?: string;
  tags?: string[];
}

interface PostEditorProps {
  initial?: PostData;
}

export function PostEditor({ initial = {} }: PostEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Form state
  const [title, setTitle] = useState(initial.title ?? "");
  const [slug, setSlug] = useState(initial.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial.excerpt ?? "");
  const [content, setContent] = useState(initial.content ?? "");
  const [coverImage, setCoverImage] = useState(initial.coverImage ?? "");
  const [status, setStatus] = useState<PostStatus>(initial.status ?? "DRAFT");
  const [locale, setLocale] = useState(initial.locale ?? "de");
  const [tags, setTags] = useState((initial.tags ?? []).join(", "));
  const [error, setError] = useState("");

  // Editor view
  const [view, setView] = useState<"edit" | "preview">("edit");

  // AI panel
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiMode, setAiMode] = useState<"full" | "outline" | "expand">("full");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState("");

  const isEdit = Boolean(initial.id);

  // Auto-generate slug from title (only if slug is untouched)
  function handleTitleChange(val: string) {
    setTitle(val);
    if (!initial.slug && !slug) {
      setSlug(
        val
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-"),
      );
    }
  }

  // ── Save ────────────────────────────────────────────────────────────────────

  async function save(targetStatus?: PostStatus) {
    setError("");
    const resolvedStatus = targetStatus ?? status;

    const body = {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      status: resolvedStatus,
      locale,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    const url = isEdit
      ? `/api/admin/posts/${initial.id}`
      : "/api/admin/posts";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError((data as { error?: string }).error ?? "Failed to save post");
      return;
    }

    const data = await res.json();
    if (!isEdit) {
      router.push(`/admin/posts/${(data as { post: { id: number } }).post.id}/edit`);
      router.refresh();
    } else {
      setStatus(resolvedStatus);
      router.refresh();
    }
  }

  // ── AI write ────────────────────────────────────────────────────────────────

  const generateWithAI = useCallback(async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiOutput("");

    try {
      const res = await fetch("/api/admin/ai-write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt, locale, mode: aiMode }),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({}));
        setAiOutput(`Error: ${(err as { error?: string }).error ?? "Unknown error"}`);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        // SSE: parse data: lines
        for (const line of chunk.split("\n")) {
          if (line.startsWith("data: ")) {
            const payload = line.slice(6).trim();
            if (payload === "[DONE]") break;
            try {
              const parsed = JSON.parse(payload) as { content?: string; delta?: string; text?: string };
              const text = parsed.content ?? parsed.delta ?? parsed.text ?? "";
              accumulated += text;
              setAiOutput(accumulated);
            } catch {
              // plain text SSE
              accumulated += payload;
              setAiOutput(accumulated);
            }
          }
        }
      }
    } finally {
      setAiLoading(false);
    }
  }, [aiPrompt, locale, aiMode]);

  function insertAiOutput() {
    setContent((prev) => (prev ? `${prev}\n\n${aiOutput}` : aiOutput));
    setAiOutput("");
    setAiPrompt("");
    setAiOpen(false);
  }

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b bg-background px-6 py-3">
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setView("edit")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors",
              view === "edit" ? "bg-muted font-medium" : "text-muted-foreground hover:bg-muted",
            )}
          >
            <Code2 className="size-4" />
            Write
          </button>
          <button
            onClick={() => setView("preview")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors",
              view === "preview" ? "bg-muted font-medium" : "text-muted-foreground hover:bg-muted",
            )}
          >
            <Eye className="size-4" />
            Preview
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAiOpen(!aiOpen)}
            className="flex items-center gap-2 rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-100 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-300"
          >
            <Sparkles className="size-4" />
            AI Write
          </button>

          <button
            onClick={() => startTransition(() => save("DRAFT"))}
            disabled={isPending}
            className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-muted disabled:opacity-60"
          >
            Save draft
          </button>

          <button
            onClick={() => startTransition(() => save("PUBLISHED"))}
            disabled={isPending}
            className="rounded-lg bg-brand-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : status === "PUBLISHED" ? (
              "Update"
            ) : (
              "Publish"
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Form + editor */}
        <div className={cn("flex flex-1 flex-col overflow-auto", aiOpen && "lg:w-[calc(100%-400px)]")}>
          {/* Meta fields */}
          <div className="border-b bg-background px-6 py-4 space-y-4">
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
                {error}
              </p>
            )}

            <input
              placeholder="Post title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full border-none bg-transparent text-2xl font-bold outline-none placeholder:text-muted-foreground/50"
            />

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Slug</label>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full rounded-lg border bg-muted/30 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="my-post-slug"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Status</label>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PostStatus)}
                    className="w-full appearance-none rounded-lg border bg-muted/30 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Locale</label>
                <div className="relative">
                  <select
                    value={locale}
                    onChange={(e) => setLocale(e.target.value)}
                    className="w-full appearance-none rounded-lg border bg-muted/30 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="de">German (de)</option>
                    <option value="en">English (en)</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Tags (comma-sep.)</label>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full rounded-lg border bg-muted/30 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="KI, SaaS, Synaplan"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Excerpt</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border bg-muted/30 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Short description shown in post listings…"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Cover image URL</label>
                <input
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full rounded-lg border bg-muted/30 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* Markdown editor / preview */}
          <div className="flex-1 p-6">
            {view === "edit" ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[500px] w-full resize-none rounded-lg border bg-muted/20 px-4 py-3 font-mono text-sm leading-relaxed outline-none focus:ring-2 focus:ring-brand-500"
                placeholder={`# Post title\n\nWrite your post in Markdown…`}
              />
            ) : (
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content || "_Nothing to preview yet._"}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>

        {/* AI Writing Panel */}
        {aiOpen && (
          <div className="flex w-[400px] flex-col border-l bg-background">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="size-4 text-brand-500" />
                AI Write
              </div>
              <button
                onClick={() => setAiOpen(false)}
                className="rounded p-1 hover:bg-muted"
              >
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
              {/* Mode */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Mode</label>
                <div className="flex gap-2">
                  {(["full", "outline", "expand"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setAiMode(m)}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                        aiMode === m
                          ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/40"
                          : "hover:bg-muted",
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  What should the AI write?
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder={
                    aiMode === "full"
                      ? "Write a blog post about how Synaplan helps teams save 4h/day with AI…"
                      : aiMode === "outline"
                        ? "Outline a post comparing AI gateway solutions…"
                        : "Paste text to expand here…"
                  }
                />
              </div>

              <button
                onClick={generateWithAI}
                disabled={aiLoading || !aiPrompt.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    Generate
                  </>
                )}
              </button>

              {/* Output */}
              {aiOutput && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Output</span>
                    <button
                      onClick={insertAiOutput}
                      className="rounded-lg bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                    >
                      Insert into editor
                    </button>
                  </div>
                  <div className="max-h-96 overflow-auto rounded-lg bg-muted/30 p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                    {aiOutput}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
