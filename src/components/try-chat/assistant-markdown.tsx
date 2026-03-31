"use client";

import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

const components: Components = {
  p: ({ children }) => (
    <p className="mb-2 last:mb-0 [&+p]:mt-2">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-[#221823]">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => (
    <ul className="mb-2 list-disc space-y-1 pl-4 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-2 list-decimal space-y-1 pl-4 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-[#002c92] underline underline-offset-2 hover:text-[#003fc7]"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  h1: ({ children }) => (
    <p className="mb-2 text-base font-bold leading-snug text-[#221823] last:mb-0">
      {children}
    </p>
  ),
  h2: ({ children }) => (
    <p className="mb-2 text-[15px] font-bold leading-snug text-[#221823] last:mb-0">
      {children}
    </p>
  ),
  h3: ({ children }) => (
    <p className="mb-2 text-sm font-bold leading-snug text-[#221823] last:mb-0">
      {children}
    </p>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 border-[#002c92]/35 pl-3 text-[#434654]">
      {children}
    </blockquote>
  ),
  pre: ({ children }) => (
    <pre className="my-2 overflow-x-auto rounded-lg bg-[#f6e3f3]/60 px-3 py-2 text-[13px] leading-relaxed [&_code]:bg-transparent [&_code]:p-0">
      {children}
    </pre>
  ),
  code: ({ className, children, ...props }) => {
    const text = typeof children === "string" ? children : "";
    const hasLanguage = /\blanguage-/.test(String(className ?? ""));
    const isBlock = hasLanguage || text.includes("\n");
    if (isBlock) {
      return (
        <code
          className={cn(
            "font-mono text-[13px] text-[#221823]",
            className,
          )}
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        className="rounded bg-[#f6e3f3]/80 px-1 py-0.5 font-mono text-[13px] text-[#221823]"
        {...props}
      >
        {children}
      </code>
    );
  },
  hr: () => <hr className="my-3 border-[rgb(196_197_215/0.35)]" />,
};

export function AssistantMarkdown({ content }: { content: string }) {
  return (
    <div className="text-left text-sm leading-relaxed text-[#221823]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
