"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  FileType2,
  Globe,
  GripVertical,
  Link2,
  ListOrdered,
  Lock,
  MessageCircle,
  MoreVertical,
  Send,
  User,
  X,
} from "lucide-react";
import { WidgetFlowNeuralMeshSvg } from "@/components/interactive/widget-flow-neural-mesh";

type QId = "hours" | "pricing" | "company" | "handbook" | "offer" | "faq";
type RId =
  | "crawlHours"
  | "crawlPricing"
  | "userApi"
  | "docPdf"
  | "docWord"
  | "listText";

const Q_IDS: QId[] = [
  "hours",
  "pricing",
  "company",
  "handbook",
  "offer",
  "faq",
];
const R_IDS: RId[] = [
  "crawlHours",
  "crawlPricing",
  "userApi",
  "docPdf",
  "docWord",
  "listText",
];

const DEFAULT_LINKS: Record<QId, RId> = {
  hours: "crawlHours",
  pricing: "crawlPricing",
  company: "userApi",
  handbook: "docPdf",
  offer: "docWord",
  faq: "listText",
};

function assignLink(
  links: Record<QId, RId>,
  qid: QId,
  rid: RId,
): Record<QId, RId> {
  const next = { ...links };
  const oldR = next[qid];
  const partner = Q_IDS.find((q) => q !== qid && next[q] === rid);
  if (partner !== undefined && oldR !== undefined) {
    next[partner] = oldR;
  }
  next[qid] = rid;
  return next;
}

function reorderOrder(order: QId[], from: QId, to: QId): QId[] {
  const i = order.indexOf(from);
  const j = order.indexOf(to);
  if (i === -1 || j === -1 || i === j) return order;
  const next = [...order];
  const [item] = next.splice(i, 1);
  next.splice(j, 0, item);
  return next;
}

/** Half-width of endpoint dot (size-3.5 ≈ 14px) — path meets dot centers */
const ENDPOINT_RX = 7;

function buildPath(
  container: DOMRect,
  qEl: DOMRect,
  rEl: DOMRect,
): string {
  const x1 = qEl.right - container.left - ENDPOINT_RX;
  const y1 = qEl.top + qEl.height / 2 - container.top;
  const x2 = rEl.left - container.left + ENDPOINT_RX;
  const y2 = rEl.top + rEl.height / 2 - container.top;
  const cx1 = x1 + (x2 - x1) * 0.42;
  const cx2 = x1 + (x2 - x1) * 0.58;
  return `M ${x1} ${y1} C ${cx1} ${y1} ${cx2} ${y2} ${x2} ${y2}`;
}

function SourceGlyph({ rid }: { rid: RId }) {
  const common = "mt-0.5 size-4 shrink-0 text-[#002c92]";
  switch (rid) {
    case "crawlHours":
    case "crawlPricing":
      return <Globe className={cn(common, "opacity-75")} />;
    case "userApi":
      return <Link2 className={common} />;
    case "docPdf":
      return <FileText className={common} />;
    case "docWord":
      return <FileType2 className={common} />;
    case "listText":
      return <ListOrdered className={common} />;
    default:
      return <Globe className={common} />;
  }
}

const PIN_THRESHOLD_PX = 72;

type EmbedCase = {
  user: string;
  reply: string;
  citation: string;
  badge: string;
  href: string;
};

function WidgetFlowEmbedChat({
  onCollapse,
  onClose,
}: {
  onCollapse: () => void;
  onClose: () => void;
}) {
  const t = useTranslations("widgetFlow");
  const tChat = useTranslations("chatPreview");

  const cases: EmbedCase[] = useMemo(() => {
    const base = t("brandUrl");
    return [
      {
        user: t("previewAnim0User"),
        reply: t("previewAnim0Reply"),
        citation: t("previewAnim0Citation"),
        badge: t("previewAnim0Badge"),
        href: "https://musterfirma.de/zeiten",
      },
      {
        user: t("previewAnim1User"),
        reply: t("previewAnim1Reply"),
        citation: t("previewAnim1Citation"),
        badge: t("previewAnim1Badge"),
        href: "https://musterfirma.de/pricing",
      },
      {
        user: t("previewAnim2User"),
        reply: t("previewAnim2Reply"),
        citation: t("previewAnim2Citation"),
        badge: t("previewAnim2Badge"),
        href: `${base}/docs/handbuch.pdf`,
      },
      {
        user: t("previewAnim3User"),
        reply: t("previewAnim3Reply"),
        citation: t("previewAnim3Citation"),
        badge: t("previewAnim3Badge"),
        href: `${base}/#faq`,
      },
    ];
  }, [t]);

  type EmbedStep =
    | { kind: "greeting" }
    | { kind: "turn"; role: "user" | "bot"; caseIdx: number };

  const steps = useMemo((): EmbedStep[] => {
    const turns = [0, 1, 2, 3].flatMap((i) => [
      { kind: "turn" as const, role: "user" as const, caseIdx: i },
      { kind: "turn" as const, role: "bot" as const, caseIdx: i },
    ]);
    return [{ kind: "greeting" as const }, ...turns];
  }, []);

  const [visibleCount, setVisibleCount] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const pinnedToBottomRef = useRef(true);

  const updatePinnedFromScroll = useCallback(() => {
    const el = messagesScrollRef.current;
    if (!el) return;
    const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
    pinnedToBottomRef.current = dist <= PIN_THRESHOLD_PX;
  }, []);

  useEffect(() => {
    if (visibleCount >= steps.length) {
      setIsTyping(false);
      return;
    }
    const step = steps[visibleCount];
    const delay =
      step.kind === "greeting"
        ? 1100
        : step.role === "user"
          ? 1700
          : 2600;
    setIsTyping(true);
    const typingTimer = window.setTimeout(() => {
      setIsTyping(false);
      setVisibleCount((prev) => prev + 1);
    }, delay);
    return () => clearTimeout(typingTimer);
  }, [visibleCount, steps]);

  useEffect(() => {
    const el = messagesScrollRef.current;
    if (!el || !pinnedToBottomRef.current) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [visibleCount, isTyping]);

  const pending =
    visibleCount < steps.length ? steps[visibleCount] : null;
  const visibleMessages = steps.slice(0, visibleCount);
  const isComplete = visibleCount >= steps.length && !isTyping;

  return (
    <div className="relative isolate w-full max-h-full [contain:layout]">
      <div className="relative flex max-h-[min(52vh,360px)] min-h-[240px] w-full max-w-[18rem] flex-col overflow-hidden rounded-3xl border border-[rgb(196_197_215/0.15)] bg-page-tint/85 shadow-[0_25px_50px_-12px_rgb(0_0_0/0.22)] backdrop-blur-[10px] sm:max-h-[min(50vh,380px)] sm:max-w-[19rem] sm:min-h-[260px]">
        <div className="flex shrink-0 items-center justify-between gap-1 bg-[#002c92] px-2 py-2.5 sm:px-3 sm:py-3.5">
          <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/15 sm:size-8">
              <Bot className="size-3.5 text-white sm:size-4" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold leading-tight text-white sm:text-sm">
                {tChat("title")}
              </p>
              <p className="text-[9px] leading-tight text-white/60 sm:text-[10px]">
                {isComplete ? tChat("statusDone") : tChat("status")}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              onClick={onCollapse}
              className="rounded-md p-1.5 text-white/90 hover:bg-white/10"
              aria-label={t("previewCollapse")}
            >
              <ChevronDown className="size-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1.5 text-white/90 hover:bg-white/10"
              aria-label={t("previewClose")}
            >
              <X className="size-4" />
            </button>
            <MoreVertical className="size-4 text-white/50" aria-hidden />
          </div>
        </div>

        <div
          ref={messagesScrollRef}
          onScroll={updatePinnedFromScroll}
          className="widget-embed-scroll min-h-0 min-h-[200px] flex-1 overflow-y-auto overscroll-y-contain sm:min-h-[220px]"
        >
          <div className="flex min-h-full flex-col gap-3 p-4 sm:p-4">
            {visibleMessages.map((step, i) => {
              if (step.kind === "greeting") {
                return (
                  <div
                    key="greeting"
                    className="chat-preview-msg-in flex gap-2.5 flex-row"
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#002c92]/10 text-[#002c92]">
                      <Bot className="size-4" />
                    </div>
                    <div className="max-w-[92%] rounded-2xl rounded-tl-sm bg-chat-bubble-user px-3.5 py-3 text-sm leading-relaxed text-foreground shadow-sm">
                      {t("previewGreeting")}
                    </div>
                  </div>
                );
              }
              const c = cases[step.caseIdx];
              if (step.role === "user") {
                return (
                  <div
                    key={`u-${step.caseIdx}-${i}`}
                    className="chat-preview-msg-in flex gap-2 flex-row-reverse"
                  >
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[rgb(0_44_146/0.05)] text-[#002c92]">
                      <User className="size-3.5" />
                    </div>
                    <div className="max-w-[88%] rounded-2xl rounded-tr-sm border border-[rgb(0_44_146/0.1)] bg-[rgb(0_44_146/0.05)] px-3 py-2 text-xs leading-relaxed text-[#002c92] sm:text-xs">
                      {c.user}
                    </div>
                  </div>
                );
              }
              return (
                <div
                  key={`b-${step.caseIdx}-${i}`}
                  className="chat-preview-msg-in flex gap-2 flex-row"
                >
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#002c92]/10 text-[#002c92]">
                    <Bot className="size-3.5" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="rounded-2xl rounded-tl-sm bg-chat-bubble-user px-3 py-2.5 text-xs leading-relaxed text-foreground shadow-sm sm:text-[13px]">
                      <div className="flex flex-wrap items-center gap-1.5 border-b border-[rgb(196_197_215/0.25)] pb-2">
                        <a
                          href={c.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-w-0 items-center gap-0.5 break-all text-[11px] font-semibold text-[#002c92] underline-offset-2 hover:underline"
                        >
                          {c.citation}
                          <ArrowRight className="size-3 shrink-0 opacity-70" />
                        </a>
                        <span className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
                          {c.badge}
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed sm:text-[13px]">
                        {c.reply}
                      </p>
                    </div>
                    <p className="flex items-start gap-1.5 rounded-lg bg-soft-accent/70 px-2.5 py-1.5 text-[10px] leading-snug text-muted-foreground">
                      <span className="mt-0.5 shrink-0 font-medium text-[#002c92]/90">
                        ↳
                      </span>
                      <span>
                        <span className="font-medium text-foreground">
                          {t("colSources")}:
                        </span>{" "}
                        {c.citation}
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}

            {isTyping && pending && (
              <div
                className={cn(
                  "chat-preview-typing-in flex gap-2",
                  pending.kind === "turn" && pending.role === "user"
                    ? "flex-row-reverse"
                    : "flex-row",
                )}
              >
                <div
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full",
                    pending.kind === "greeting" ||
                      (pending.kind === "turn" && pending.role === "bot")
                      ? "bg-[#002c92]/10 text-[#002c92]"
                      : "bg-[rgb(0_44_146/0.05)] text-[#002c92]",
                  )}
                >
                  {pending.kind === "greeting" ||
                  (pending.kind === "turn" && pending.role === "bot") ? (
                    <Bot className="size-3.5" />
                  ) : (
                    <User className="size-3.5" />
                  )}
                </div>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3",
                    pending.kind === "greeting" ||
                      (pending.kind === "turn" && pending.role === "bot")
                      ? "rounded-tl-sm bg-chat-bubble-user"
                      : "rounded-tr-sm border border-[rgb(0_44_146/0.1)] bg-[rgb(0_44_146/0.05)]",
                  )}
                >
                  <div className="flex gap-1.5">
                    <span className="chat-preview-dot size-1.5 rounded-full bg-[#434654]/50" />
                    <span className="chat-preview-dot size-1.5 rounded-full bg-[#434654]/50" />
                    <span className="chat-preview-dot size-1.5 rounded-full bg-[#434654]/50" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 border-t border-[rgb(196_197_215/0.12)] bg-chat-input-bg p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2 rounded-xl border border-[rgb(196_197_215/0.2)] bg-white px-3 py-2 sm:px-4 sm:py-2.5">
            <span className="flex-1 truncate text-xs text-[#434654]/80">
              {tChat("placeholder")}
            </span>
            <Send className="size-[18px] shrink-0 text-[#434654]/60" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function WidgetFlowSection() {
  const t = useTranslations("widgetFlow");

  const [links, setLinks] = useState<Record<QId, RId>>(DEFAULT_LINKS);
  const [questionOrder, setQuestionOrder] = useState<QId[]>([...Q_IDS]);
  const [dragOverR, setDragOverR] = useState<RId | null>(null);
  const [dragOverQ, setDragOverQ] = useState<QId | null>(null);
  const [sizeTick, setSizeTick] = useState(0);
  const [paths, setPaths] = useState<string[]>([]);
  const [svgBox, setSvgBox] = useState({ w: 0, h: 0 });
  const [previewWidgetOpen, setPreviewWidgetOpen] = useState(true);
  const [previewWidgetCollapsed, setPreviewWidgetCollapsed] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const qRefs = useRef<Partial<Record<QId, HTMLDivElement | null>>>({});
  const rRefs = useRef<Partial<Record<RId, HTMLDivElement | null>>>({});

  const setQRef = useCallback((id: QId, el: HTMLDivElement | null) => {
    qRefs.current[id] = el;
  }, []);

  const setRRef = useCallback((id: RId, el: HTMLDivElement | null) => {
    rRefs.current[id] = el;
  }, []);

  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      setSvgBox({ w: rect.width, h: rect.height });
      const next: string[] = [];
      (Object.entries(links) as [QId, RId][]).forEach(([qid, rid]) => {
        const qEl = qRefs.current[qid];
        const rEl = rRefs.current[rid];
        if (!qEl || !rEl) return;
        const q = qEl.getBoundingClientRect();
        const r = rEl.getBoundingClientRect();
        next.push(buildPath(rect, q, r));
      });
      setPaths(next);
    });
    return () => cancelAnimationFrame(id);
  }, [links, sizeTick, questionOrder]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      setSizeTick((n) => n + 1);
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  const qLabel = useCallback(
    (qid: QId) => {
      switch (qid) {
        case "hours":
          return t("qHours");
        case "pricing":
          return t("qPricing");
        case "company":
          return t("qCompany");
        case "handbook":
          return t("qHandbook");
        case "offer":
          return t("qOffer");
        case "faq":
          return t("qFaq");
        default:
          return "";
      }
    },
    [t],
  );

  const rTitle = useCallback(
    (rid: RId) => {
      switch (rid) {
        case "crawlHours":
          return t("sourceCrawlHours");
        case "crawlPricing":
          return t("sourceCrawlPricing");
        case "userApi":
          return t("sourceUserApi");
        case "docPdf":
          return t("sourceDocPdf");
        case "docWord":
          return t("sourceDocWord");
        case "listText":
          return t("sourceListText");
        default:
          return "";
      }
    },
    [t],
  );

  const rSub = useCallback(
    (rid: RId) => {
      switch (rid) {
        case "crawlHours":
          return t("sourceCrawlHoursUrl");
        case "crawlPricing":
          return t("sourceCrawlPricingUrl");
        case "userApi":
          return t("sourceUserApiHint");
        case "docPdf":
          return t("sourceDocPdfUrl");
        case "docWord":
          return t("sourceDocWordUrl");
        case "listText":
          return t("sourceListTextHint");
        default:
          return "";
      }
    },
    [t],
  );

  const onDragStart = (e: React.DragEvent, qid: QId) => {
    e.dataTransfer.setData("text/plain", qid);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragEnd = () => {
    setDragOverR(null);
    setDragOverQ(null);
  };

  const onDropSource = (e: React.DragEvent, rid: RId) => {
    e.preventDefault();
    setDragOverR(null);
    const raw = e.dataTransfer.getData("text/plain") as QId;
    if (!Q_IDS.includes(raw)) return;
    setLinks((prev) => assignLink(prev, raw, rid));
  };

  const onDropQuestion = (e: React.DragEvent, targetQid: QId) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverQ(null);
    const raw = e.dataTransfer.getData("text/plain") as QId;
    if (!Q_IDS.includes(raw) || raw === targetQid) return;
    setQuestionOrder((prev) => reorderOrder(prev, raw, targetQid));
  };

  const qForSource = useCallback(
    (rid: RId) => Q_IDS.find((q) => links[q] === rid),
    [links],
  );

  return (
    <section
      id="widget-flow"
      className="surface-rose border-t border-[rgb(196_197_215/0.2)] py-16 sm:py-24"
      aria-labelledby="widget-flow-heading"
    >
      <div className="container-wide section-padding">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="widget-flow-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-10">
          <div className="relative flex min-h-[480px] flex-col lg:col-span-7">
            <div className="mb-4 flex items-start justify-between gap-3 px-1">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {t("panelTitle")}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("panelHint")}
                </p>
              </div>
              <span className="hidden rounded-full border border-[#002c92]/20 bg-soft-accent px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#002c92] sm:inline">
                {t("dragMe")}
              </span>
            </div>

            <div className="relative flex min-h-0 flex-1 flex-col overflow-visible rounded-3xl border border-[rgb(196_197_215/0.35)] bg-white shadow-[0_1px_3px_rgb(0_0_0/0.06)]">
              <div className="flex items-start gap-2 border-b border-amber-200/60 bg-amber-50/90 px-4 py-3">
                <Lock className="mt-0.5 size-4 shrink-0 text-amber-800/80" />
                <p className="text-xs leading-relaxed text-amber-950/90">
                  <Badge className="mr-2 border-amber-300/60 bg-amber-100 text-[10px] font-bold text-amber-900 hover:bg-amber-100">
                    {t("proBadge")}
                  </Badge>
                  {t("proBanner")}
                </p>
              </div>

              <div
                ref={canvasRef}
                className="relative grid min-h-[360px] flex-1 grid-cols-2 gap-x-5 gap-y-3 overflow-visible p-4 sm:gap-x-8 sm:p-5 md:min-h-[380px]"
              >
                {svgBox.w > 0 && svgBox.h > 0 && (
                  <svg
                    className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
                    viewBox={`0 0 ${svgBox.w} ${svgBox.h}`}
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <defs>
                      <linearGradient
                        id="wf-neural-grad-light"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop
                          offset="0%"
                          stopColor="#002c92"
                          stopOpacity="0.35"
                        />
                        <stop
                          offset="50%"
                          stopColor="#2563eb"
                          stopOpacity="0.85"
                        />
                        <stop
                          offset="100%"
                          stopColor="#002c92"
                          stopOpacity="0.35"
                        />
                      </linearGradient>
                      <filter
                        id="wf-glow-light"
                        x="-30%"
                        y="-30%"
                        width="160%"
                        height="160%"
                      >
                        <feGaussianBlur stdDeviation="1.5" result="b" />
                        <feMerge>
                          <feMergeNode in="b" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <WidgetFlowNeuralMeshSvg w={svgBox.w} h={svgBox.h} />
                    {paths.map((d, i) => (
                      <path
                        key={`base-${i}`}
                        d={d}
                        fill="none"
                        className="widget-flow-link-base"
                      />
                    ))}
                    {paths.map((d, i) => (
                      <path
                        key={`anim-${i}`}
                        d={d}
                        fill="none"
                        stroke="url(#wf-neural-grad-light)"
                        strokeWidth={2}
                        filter="url(#wf-glow-light)"
                        className="widget-neural-path"
                      />
                    ))}
                  </svg>
                )}

                <div className="relative z-20 flex max-h-[min(70vh,640px)] min-w-0 flex-col gap-2 overflow-y-auto">
                  <p className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-[#002c92]/80">
                    {t("colQuestions")}
                  </p>
                  {questionOrder.map((qid) => (
                    <div
                      key={qid}
                      ref={(el) => setQRef(qid, el)}
                      className="flex w-full min-w-0 items-center gap-0"
                    >
                      <div
                        draggable
                        onDragStart={(e) => onDragStart(e, qid)}
                        onDragEnd={onDragEnd}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = "move";
                          setDragOverQ(qid);
                        }}
                        onDragLeave={() => setDragOverQ(null)}
                        onDrop={(e) => onDropQuestion(e, qid)}
                        className={cn(
                          "flex min-w-0 flex-1 cursor-grab touch-manipulation items-center gap-2 rounded-l-xl rounded-r-none border border-r-0 bg-page-tint px-3 py-2.5 text-left text-sm text-foreground shadow-sm active:cursor-grabbing",
                          "border-[rgb(196_197_215/0.45)] transition-[border-color,box-shadow]",
                          "hover:border-[#002c92]/35 hover:shadow-md",
                          dragOverQ === qid &&
                            "border-[#002c92]/50 ring-2 ring-[#002c92]/15",
                        )}
                      >
                        <GripVertical className="size-4 shrink-0 text-[#002c92]/45" />
                        <span className="leading-snug">{qLabel(qid)}</span>
                      </div>
                      <div
                        draggable
                        role="button"
                        tabIndex={0}
                        onDragStart={(e) => {
                          e.stopPropagation();
                          onDragStart(e, qid);
                        }}
                        onDragEnd={onDragEnd}
                        className={cn(
                          "widget-flow-endpoint z-30 size-3.5 shrink-0 rounded-full border-2 border-[#002c92] bg-white shadow-md",
                          "cursor-grab touch-manipulation transition-transform hover:scale-110 active:cursor-grabbing",
                        )}
                        aria-label={t("dragEndpointHint")}
                      />
                    </div>
                  ))}
                </div>

                <div className="relative z-20 flex max-h-[min(70vh,640px)] min-w-0 flex-col gap-2 overflow-y-auto pl-1">
                  <p className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-[#002c92]/80">
                    {t("colSources")}
                  </p>
                  {R_IDS.map((rid) => {
                    const qAttach = qForSource(rid);
                    return (
                      <div
                        key={rid}
                        ref={(el) => setRRef(rid, el)}
                        className="flex w-full min-w-0 items-center gap-0"
                      >
                        <div
                          draggable={!!qAttach}
                          role="button"
                          tabIndex={0}
                          onDragStart={(e) => {
                            if (qAttach) onDragStart(e, qAttach);
                          }}
                          onDragEnd={onDragEnd}
                          className={cn(
                            "widget-flow-endpoint z-30 size-3.5 shrink-0 rounded-full border-2 border-[#002c92] bg-white shadow-md ring-2 ring-white",
                            "touch-manipulation transition-transform hover:scale-110",
                            qAttach
                              ? "cursor-grab active:cursor-grabbing"
                              : "pointer-events-none opacity-30",
                          )}
                          aria-label={t("dragEndpointHint")}
                        />
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = "move";
                            setDragOverR(rid);
                          }}
                          onDragLeave={() => setDragOverR(null)}
                          onDrop={(e) => onDropSource(e, rid)}
                          className={cn(
                            "min-w-0 flex-1 rounded-l-none rounded-r-xl border border-l-0 bg-white py-2.5 pl-3 pr-3 text-left shadow-sm transition-[border-color,box-shadow]",
                            "border-[rgb(196_197_215/0.45)]",
                            dragOverR === rid &&
                              "border-[#002c92]/45 ring-2 ring-[#002c92]/15",
                          )}
                        >
                          <div className="flex items-start gap-2">
                            <SourceGlyph rid={rid} />
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-medium text-foreground">
                                  {rTitle(rid)}
                                </span>
                                {rid === "userApi" && (
                                  <Badge
                                    variant="secondary"
                                    className="border-violet-200 bg-violet-50 text-[10px] text-violet-800"
                                  >
                                    {t("proBadge")}
                                  </Badge>
                                )}
                              </div>
                              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                {rSub(rid)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:col-span-5">
            <div className="mb-4 px-1">
              <p className="text-sm font-semibold text-foreground">
                {t("previewTitle")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("previewHint")}
              </p>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_24px_50px_-12px_rgb(0_0_0/0.12)]">
              <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-slate-200/80 bg-slate-50/95 px-3 py-2.5">
                <div className="flex gap-1.5 pl-0.5" aria-hidden>
                  <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="size-2.5 rounded-full bg-[#febc2e]" />
                  <span className="size-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-white px-2.5 py-1.5 text-[11px] shadow-inner ring-1 ring-slate-200/90 sm:text-xs">
                  <Lock className="size-3 shrink-0 text-muted-foreground" />
                  <span className="truncate font-mono text-muted-foreground">
                    https://{t("demoSiteUrl")}
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className="shrink-0 border-slate-200 bg-white text-[10px] font-medium tracking-wide text-muted-foreground"
                >
                  {t("previewExampleBadge")}
                </Badge>
              </div>

              <div className="relative flex min-h-[380px] flex-col overflow-hidden bg-gradient-to-b from-slate-100/90 via-page-tint to-soft-accent/55 pb-2 pt-6 sm:min-h-[400px] sm:pt-8 sm:pb-3">
                {/* Page body — scrolls; chat widget overlays the lower area (same frame size as before) */}
                <div className="widget-embed-scroll min-h-0 flex-1 overflow-y-auto px-3 pb-28 sm:pb-32">
                  <div className="mx-auto w-full max-w-sm px-2 text-left sm:max-w-md">
                    <nav
                      className="flex flex-wrap gap-x-3 gap-y-1 border-b border-[rgb(196_197_215/0.25)] pb-2.5 text-[10px] font-medium text-[#002c92]/80"
                      aria-label={t("previewFauxHero")}
                    >
                      <span className="cursor-default">{t("previewFauxNav1")}</span>
                      <span className="cursor-default">{t("previewFauxNav2")}</span>
                      <span className="cursor-default">{t("previewFauxNav3")}</span>
                    </nav>
                    <p className="mt-3 text-sm font-semibold text-foreground/90">
                      {t("previewFauxHero")}
                    </p>
                    <p className="mt-1 max-w-[22rem] text-[10px] leading-relaxed text-muted-foreground sm:text-[11px]">
                      {t("previewFauxSub")}
                    </p>
                    <p className="mt-3 text-xs font-semibold leading-snug tracking-tight text-foreground sm:text-sm" role="presentation">
                      {t("previewFauxHeadline")}
                    </p>
                    <p className="mt-1.5 text-[10px] leading-relaxed text-muted-foreground sm:text-[11px]">
                      {t("previewFauxLead")}
                    </p>
                    <ul className="mt-3 space-y-1.5">
                      {(
                        [
                          "previewFauxFeature1",
                          "previewFauxFeature2",
                          "previewFauxFeature3",
                        ] as const
                      ).map((key) => (
                        <li
                          key={key}
                          className="flex gap-2 text-[10px] leading-snug text-muted-foreground sm:text-[11px]"
                        >
                          <Check
                            className="mt-0.5 size-3.5 shrink-0 text-[#002c92]/65"
                            strokeWidth={2.25}
                            aria-hidden
                          />
                          <span>{t(key)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 rounded-lg border border-[rgb(196_197_215/0.35)] bg-white/40 px-2.5 py-2 backdrop-blur-[2px]">
                      <p className="text-[10px] font-semibold text-foreground/90">
                        {t("previewFauxAsideTitle")}
                      </p>
                      <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">
                        {t("previewFauxAsideBody")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 border-t border-[rgb(196_197_215/0.18)] bg-gradient-to-t from-soft-accent/85 via-page-tint/55 to-transparent px-3 pb-2 pt-10 sm:pt-12">
                  <div className="pointer-events-auto flex w-full flex-col items-end">
                    {!previewWidgetOpen && (
                      <div className="flex w-full justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewWidgetOpen(true);
                            setPreviewWidgetCollapsed(false);
                          }}
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#002c92]/25 bg-[#002c92] text-white shadow-[0_10px_28px_-8px_rgb(0_44_146/0.45)] transition-transform hover:scale-105"
                          aria-label={t("previewOpenChat")}
                        >
                          <MessageCircle className="size-6" strokeWidth={1.75} />
                        </button>
                      </div>
                    )}

                    {previewWidgetOpen && (
                      <div
                        className={cn(
                          "flex w-full max-w-full justify-end",
                          previewWidgetCollapsed
                            ? ""
                            : "max-h-[min(52vh,360px)] min-h-0",
                        )}
                      >
                        <div
                          className={cn(
                            "flex w-full flex-col items-end gap-0",
                            previewWidgetCollapsed
                              ? "max-w-[min(100%,16rem)]"
                              : "max-w-[min(100%,19rem)]",
                          )}
                        >
                          {previewWidgetCollapsed ? (
                            <div className="flex w-full items-center gap-2 rounded-2xl border border-[rgb(196_197_215/0.35)] bg-page-tint/95 px-2.5 py-2 shadow-[0_12px_40px_-12px_rgb(0_44_146/0.3)] backdrop-blur-sm">
                              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#002c92]/12 text-[#002c92]">
                                <Bot className="size-4" />
                              </div>
                              <span className="min-w-0 flex-1 truncate text-xs font-semibold text-foreground">
                                {t("previewWidgetTitle")}
                              </span>
                              <button
                                type="button"
                                onClick={() => setPreviewWidgetCollapsed(false)}
                                className="rounded-lg p-1 text-[#002c92] hover:bg-[#002c92]/10"
                                aria-label={t("previewExpand")}
                              >
                                <ChevronUp className="size-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setPreviewWidgetOpen(false)}
                                className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                                aria-label={t("previewClose")}
                              >
                                <X className="size-4" />
                              </button>
                            </div>
                          ) : (
                            <WidgetFlowEmbedChat
                              onCollapse={() => setPreviewWidgetCollapsed(true)}
                              onClose={() => setPreviewWidgetOpen(false)}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center text-center sm:mt-16">
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t("ctaLead")}
          </p>
          <Link
            href="/solutions/chat-widget"
            className={cn(
              buttonVariants({ size: "lg" }),
              "btn-figma-primary mt-6 gap-2 rounded-xl border-0 px-8 text-base text-white shadow-[0_14px_40px_-12px_rgb(0_44_146/0.35)] transition-transform hover:scale-[1.02]",
            )}
          >
            {t("ctaButton")}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
