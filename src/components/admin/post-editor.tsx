"use client";

import {
  useState,
  useTransition,
  useCallback,
  useRef,
  type ChangeEvent,
} from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Sparkles, Eye, Code2, Loader2, X, ChevronDown,
  ImageUp, CheckCircle2, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
type AiMode = "full" | "outline" | "continue" | "rewrite" | "improve" | "translate";

interface LocaleData {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: PostStatus;
  tags: string; // comma-separated
}

interface PostEditorProps {
  initial?: {
    id?: number;
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    status?: PostStatus;
    locale?: string;
    tags?: string[];
    translationKey?: string | null;
    // pre-loaded translation (opposite locale)
    translation?: {
      id?: number;
      title?: string;
      slug?: string;
      excerpt?: string;
      content?: string;
      status?: PostStatus;
      tags?: string[];
    } | null;
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function makeDefaultLocaleData(
  locale: string,
  d?: PostEditorProps["initial"],
): LocaleData {
  const src =
    locale === (d?.locale ?? "de") ? d : d?.translation;
  return {
    id: src?.id,
    title: src?.title ?? "",
    slug: src?.slug ?? "",
    excerpt: src?.excerpt ?? "",
    content: src?.content ?? "",
    status: src?.status ?? "DRAFT",
    tags: (src?.tags ?? []).join(", "),
  };
}

// ─── AI streaming helper ──────────────────────────────────────────────────────

async function streamAI(
  payload: object,
  onChunk: (text: string) => void,
): Promise<void> {
  const res = await fetch("/api/admin/ai-write", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok || !res.body) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "AI error");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    for (const line of decoder.decode(value, { stream: true }).split("\n")) {
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6).trim();
      if (payload === "[DONE]") return;
      try {
        const p = JSON.parse(payload) as { content?: string; delta?: string; text?: string };
        onChunk(p.content ?? p.delta ?? p.text ?? "");
      } catch {
        onChunk(payload);
      }
    }
  }
}

// ─── AI Panel ─────────────────────────────────────────────────────────────────

const AI_MODES: { value: AiMode; label: string; hint: string }[] = [
  { value: "full",      label: "Full post",  hint: "Write a complete article from your prompt" },
  { value: "outline",   label: "Outline",    hint: "Generate a structured outline" },
  { value: "continue",  label: "Continue",   hint: "Continue writing from current content" },
  { value: "rewrite",   label: "Rewrite",    hint: "Rewrite the current text (or selection)" },
  { value: "improve",   label: "Improve",    hint: "Polish grammar, flow and clarity" },
  { value: "translate", label: "Translate",  hint: "Translate content to the other language" },
];

interface AiPanelProps {
  locale: string;
  content: string;
  selection: string;
  onInsert: (text: string) => void;
  onReplace: (text: string) => void;
  onClose: () => void;
}

function AiPanel({ locale, content, selection, onInsert, onReplace, onClose }: AiPanelProps) {
  const [aiMode, setAiMode] = useState<AiMode>("full");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const targetLocale = locale === "de" ? "en" : "de";
  const isReplace = ["rewrite", "improve", "translate"].includes(aiMode);

  async function generate() {
    if (!prompt.trim() && !["continue", "rewrite", "improve", "translate"].includes(aiMode)) return;
    setError("");
    setOutput("");
    setLoading(true);
    try {
      await streamAI(
        { prompt, locale, mode: aiMode, content, selection, targetLocale },
        (chunk) => setOutput((p) => p + chunk),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const selectedMode = AI_MODES.find((m) => m.value === aiMode)!;

  return (
    <div className="flex w-[380px] shrink-0 flex-col border-l bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <Sparkles className="size-4 text-brand-500" />
          AI Assistant
        </div>
        <button onClick={onClose} className="rounded p-1 hover:bg-gray-100">
          <X className="size-4 text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Mode selector */}
        <div>
          <p className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Mode</p>
          <div className="grid grid-cols-3 gap-1.5">
            {AI_MODES.map((m) => (
              <button
                key={m.value}
                onClick={() => setAiMode(m.value)}
                title={m.hint}
                className={cn(
                  "rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors",
                  aiMode === m.value
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-gray-200 hover:bg-gray-50 text-gray-600",
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-gray-400">{selectedMode.hint}</p>
        </div>

        {/* Selection hint */}
        {selection && (
          <div className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-2">
            <p className="text-xs font-medium text-brand-700">Selection active</p>
            <p className="mt-0.5 truncate text-xs text-brand-600">{selection.slice(0, 80)}…</p>
          </div>
        )}

        {/* Prompt */}
        {!["continue", "rewrite", "improve", "translate"].includes(aiMode) || aiMode === "translate" ? (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              {aiMode === "translate"
                ? `Translate to ${targetLocale === "en" ? "English" : "German"}`
                : "Prompt"}
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={aiMode === "translate" ? 2 : 4}
              placeholder={
                aiMode === "translate"
                  ? "Optional: additional translation instructions…"
                  : aiMode === "full"
                    ? `Write a blog post about AI chatbots for German businesses…`
                    : `Describe what to outline…`
              }
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-500/15"
            />
          </div>
        ) : (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              Additional instructions <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={2}
              placeholder={
                aiMode === "continue" ? "e.g. focus on the ROI aspect…" : "e.g. make it more formal…"
              }
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-500/15"
            />
          </div>
        )}

        <button
          onClick={generate}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? (
            <><Loader2 className="size-4 animate-spin" /> Generating…</>
          ) : (
            <><Sparkles className="size-4" /> Generate</>
          )}
        </button>

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
            <AlertCircle className="size-4 shrink-0 text-red-500 mt-0.5" />
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {/* Output */}
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">Output</span>
              <div className="flex gap-1.5">
                {isReplace ? (
                  <button
                    onClick={() => onReplace(output)}
                    className="flex items-center gap-1 rounded-md bg-brand-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-brand-700"
                  >
                    <CheckCircle2 className="size-3.5" /> Replace
                  </button>
                ) : null}
                <button
                  onClick={() => onInsert(output)}
                  className="flex items-center gap-1 rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium hover:bg-gray-50"
                >
                  Insert
                </button>
              </div>
            </div>
            <div className="max-h-80 overflow-auto rounded-lg border bg-gray-50 p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap">
              {output}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Image Upload Button ───────────────────────────────────────────────────────

interface ImageUploadProps {
  onUploaded: (url: string) => void;
}

function ImageUploadButton({ onUploaded }: ImageUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      onUploaded(data.url!);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="relative">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      <button
        type="button"
        title={error || "Upload image"}
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className={cn(
          "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60",
          error
            ? "border-red-300 text-red-600 hover:bg-red-50"
            : "border-gray-200 text-gray-600 hover:bg-gray-100",
        )}
      >
        {uploading ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <ImageUp className="size-3.5" />
        )}
        {uploading ? "Uploading…" : "Image"}
      </button>
    </div>
  );
}

// ─── Single locale form ───────────────────────────────────────────────────────

interface LocaleFormProps {
  data: LocaleData;
  locale: string;
  isEdit: boolean;
  onChange: (patch: Partial<LocaleData>) => void;
  view: "edit" | "preview";
  titleAutoSlug: boolean;
  onTitleChange: (val: string) => void;
  onImageInsert: (url: string) => void;
}

function LocaleForm({
  data, locale, onChange, view, titleAutoSlug, onTitleChange, onImageInsert,
}: LocaleFormProps) {
  function insertImage(url: string) {
    const md = `\n![image](${url})\n`;
    onChange({ content: data.content + md });
    onImageInsert(url);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Title */}
      <input
        placeholder={locale === "de" ? "Titel des Artikels…" : "Post title…"}
        value={data.title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="w-full border-none bg-transparent text-2xl font-bold text-gray-900 outline-none placeholder:text-gray-300"
      />

      {/* Meta row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Slug</label>
          <input
            value={data.slug}
            onChange={(e) => onChange({ slug: e.target.value })}
            placeholder="my-post-slug"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm outline-none focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-500/15"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Status</label>
          <div className="relative">
            <select
              value={data.status}
              onChange={(e) => onChange({ status: e.target.value as PostStatus })}
              className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm outline-none focus:border-brand-400 focus:bg-white"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="col-span-2">
          <label className="mb-1 block text-xs font-medium text-gray-500">Tags (comma-separated)</label>
          <input
            value={data.tags}
            onChange={(e) => onChange({ tags: e.target.value })}
            placeholder="AI, SaaS, Synaplan"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm outline-none focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-500/15"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Excerpt</label>
        <textarea
          value={data.excerpt}
          onChange={(e) => onChange({ excerpt: e.target.value })}
          rows={2}
          placeholder={locale === "de" ? "Kurze Beschreibung für die Übersichtsseite…" : "Short description shown in post listings…"}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm outline-none focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-500/15"
        />
      </div>

      {/* Image upload toolbar */}
      <div className="flex items-center gap-2 border-b pb-3">
        <span className="text-xs text-gray-400">Insert:</span>
        <ImageUploadButton onUploaded={insertImage} />
      </div>

      {/* Content */}
      {view === "edit" ? (
        <textarea
          value={data.content}
          onChange={(e) => onChange({ content: e.target.value })}
          className="min-h-[420px] w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm leading-relaxed outline-none focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-500/15"
          placeholder={locale === "de"
            ? "# Überschrift\n\nSchreib deinen Artikel hier in Markdown…"
            : "# Heading\n\nWrite your article here in Markdown…"}
        />
      ) : (
        <div className="prose prose-neutral max-w-none rounded-xl border border-gray-100 bg-gray-50 px-6 py-5">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {data.content || "_Nothing to preview yet._"}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}

// ─── Main PostEditor ──────────────────────────────────────────────────────────

export function PostEditor({ initial = {} }: PostEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const primaryLocale = initial.locale ?? "de";
  const secondaryLocale = primaryLocale === "de" ? "en" : "de";

  // Per-locale state
  const [localeData, setLocaleData] = useState<Record<string, LocaleData>>({
    [primaryLocale]: makeDefaultLocaleData(primaryLocale, initial),
    [secondaryLocale]: makeDefaultLocaleData(secondaryLocale, initial),
  });

  const [activeLocale, setActiveLocale] = useState(primaryLocale);
  const [coverImage, setCoverImage] = useState(initial.coverImage ?? "");
  const [translationKey, setTranslationKey] = useState(
    initial.translationKey ?? slugify(initial.title ?? ""),
  );

  const [view, setView] = useState<"edit" | "preview">("edit");
  const [aiOpen, setAiOpen] = useState(false);
  const [selection, setSelection] = useState("");
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");

  const data = localeData[activeLocale];
  const titleAutoSlug = useRef(!initial.slug);

  function patchLocale(locale: string, patch: Partial<LocaleData>) {
    setLocaleData((prev) => ({ ...prev, [locale]: { ...prev[locale], ...patch } }));
  }

  function handleTitleChange(val: string) {
    patchLocale(activeLocale, { title: val });
    if (titleAutoSlug.current) {
      const s = slugify(val);
      patchLocale(activeLocale, { title: val, slug: `${s}${activeLocale === "en" ? "-en" : ""}` });
      if (!translationKey) setTranslationKey(s);
    }
  }

  // ── Save one locale ────────────────────────────────────────────────────────

  async function saveLocale(locale: string, targetStatus?: PostStatus) {
    const d = localeData[locale];
    if (!d.title.trim()) return null;

    const resolvedStatus = targetStatus ?? d.status;
    const body = {
      title: d.title,
      slug: d.slug || slugify(d.title),
      excerpt: d.excerpt,
      content: d.content,
      coverImage,
      status: resolvedStatus,
      locale,
      tags: d.tags.split(",").map((t) => t.trim()).filter(Boolean),
      translationKey: translationKey || slugify(d.title),
      publishedAt: resolvedStatus === "PUBLISHED" ? new Date().toISOString() : undefined,
    };

    const url = d.id ? `/api/admin/posts/${d.id}` : "/api/admin/posts";
    const method = d.id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { error?: string }).error ?? "Save failed");
    }

    const json = await res.json() as { post: { id: number } };
    patchLocale(locale, { id: json.post.id, status: resolvedStatus });
    return json.post.id;
  }

  async function save(targetStatus?: PostStatus) {
    setError("");
    setSaveStatus("idle");
    try {
      const sibling = activeLocale === "de" ? "en" : "de";
      const activeId = await saveLocale(activeLocale, targetStatus);
      let siblingId: number | null = null;
      if (localeData[sibling].title.trim()) {
        siblingId = await saveLocale(sibling, targetStatus);
      }

      const anyNewId = activeId ?? siblingId;
      if (!initial.id && !anyNewId) {
        throw new Error("Add a title in at least one language tab before saving.");
      }

      if (!initial.id && anyNewId) {
        router.push(`/admin/posts/${anyNewId}/edit`);
        router.refresh();
      } else {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2500);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaveStatus("error");
    }
  }

  // ── AI callbacks ───────────────────────────────────────────────────────────

  const handleInsert = useCallback((text: string) => {
    patchLocale(activeLocale, { content: data.content + "\n\n" + text });
  }, [activeLocale, data.content]);

  const handleReplace = useCallback((text: string) => {
    patchLocale(activeLocale, { content: text });
  }, [activeLocale]);

  // ── Image upload for cover ─────────────────────────────────────────────────

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      credentials: "include",
      body: fd,
    });
    const json = await res.json() as { url?: string };
    if (json.url) setCoverImage(json.url);
  }

  const locales: { code: string; flag: string; label: string }[] = [
    { code: "de", flag: "🇩🇪", label: "Deutsch" },
    { code: "en", flag: "🇬🇧", label: "English" },
  ];

  return (
    <div className="flex h-full flex-col bg-white">
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b bg-white px-5 py-2.5">
        {/* Left: locale tabs + view toggle */}
        <div className="flex items-center gap-3">
          {/* Language tabs */}
          <div className="flex rounded-lg border border-gray-200 p-0.5">
            {locales.map((l) => {
              const ld = localeData[l.code];
              const hasContent = Boolean(ld.title.trim());
              const isPublished = ld.status === "PUBLISHED";
              return (
                <button
                  key={l.code}
                  onClick={() => setActiveLocale(l.code)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors",
                    activeLocale === l.code
                      ? "bg-brand-600 text-white"
                      : "text-gray-500 hover:bg-gray-100",
                  )}
                >
                  <span>{l.flag}</span>
                  {l.label}
                  {hasContent && (
                    <span className={cn(
                      "size-1.5 rounded-full",
                      isPublished ? "bg-green-400" : "bg-yellow-400",
                      activeLocale === l.code ? "opacity-100" : "opacity-70",
                    )} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Write / Preview */}
          <div className="flex rounded-lg border border-gray-200 p-0.5">
            {(["edit", "preview"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                  view === v ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600",
                )}
              >
                {v === "edit" ? <Code2 className="size-3.5" /> : <Eye className="size-3.5" />}
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Right: AI + save */}
        <div className="flex items-center gap-2">
          {saveStatus === "saved" && (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle2 className="size-3.5" /> Saved
            </span>
          )}

          <button
            onClick={() => setAiOpen(!aiOpen)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
              aiOpen
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-gray-200 text-gray-600 hover:bg-gray-50",
            )}
          >
            <Sparkles className="size-3.5" />
            AI
          </button>

          <button
            onClick={() => startTransition(() => save("DRAFT"))}
            disabled={isPending}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-60"
          >
            Draft
          </button>

          <button
            onClick={() => startTransition(() => save("PUBLISHED"))}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {isPending ? <Loader2 className="size-3.5 animate-spin" /> : null}
            {data.status === "PUBLISHED" ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      {/* ── Error banner ─────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 px-5 py-2.5 text-sm text-red-600">
          <AlertCircle className="size-4 shrink-0" />
          {error}
          <button onClick={() => setError("")} className="ml-auto">
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor + meta */}
        <div className="flex flex-1 flex-col overflow-auto">
          {/* Cover image row */}
          <div className="flex items-center gap-3 border-b bg-gray-50 px-5 py-3">
            <span className="text-xs font-medium text-gray-500">Cover image</span>
            {coverImage ? (
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverImage} alt="" className="h-8 w-14 rounded object-cover border" />
                <button
                  onClick={() => setCoverImage("")}
                  className="text-xs text-gray-400 hover:text-red-500"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs text-gray-400 hover:border-brand-400 hover:text-brand-600 transition-colors">
                <ImageUp className="size-3.5" />
                Upload cover
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
              </label>
            )}

            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-gray-400">Translation key</span>
              <input
                value={translationKey}
                onChange={(e) => setTranslationKey(e.target.value)}
                placeholder="shared-slug-base"
                className="w-40 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs outline-none focus:border-brand-400"
              />
            </div>
          </div>

          {/* Form */}
          <div className="flex-1 p-5">
            <LocaleForm
              key={activeLocale}
              data={data}
              locale={activeLocale}
              isEdit={Boolean(data.id)}
              onChange={(patch) => patchLocale(activeLocale, patch)}
              view={view}
              titleAutoSlug={titleAutoSlug.current}
              onTitleChange={handleTitleChange}
              onImageInsert={() => {}}
            />
          </div>
        </div>

        {/* AI Panel */}
        {aiOpen && (
          <AiPanel
            locale={activeLocale}
            content={data.content}
            selection={selection}
            onInsert={handleInsert}
            onReplace={handleReplace}
            onClose={() => setAiOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
