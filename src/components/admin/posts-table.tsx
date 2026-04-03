"use client";

import Link from "next/link";
import { useState } from "react";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

type PostRow = {
  id: number;
  slug: string;
  title: string;
  status: string;
  locale: string;
  views: number;
  publishedAt: Date | null;
  updatedAt: Date;
  author: { name: string };
};

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  DRAFT: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  ARCHIVED: "bg-muted text-muted-foreground",
};

export function PostsTable({ posts }: { posts: PostRow[] }) {
  const [deleting, setDeleting] = useState<number | null>(null);

  if (posts.length === 0) {
    return (
      <p className="px-5 py-12 text-center text-sm text-muted-foreground">
        No posts found.
      </p>
    );
  }

  async function deletePost(id: number, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        window.location.reload();
      } else {
        alert("Failed to delete post.");
      }
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-muted-foreground">
            <th className="px-5 py-3 font-medium">Title</th>
            <th className="px-5 py-3 font-medium">Author</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Locale</th>
            <th className="px-5 py-3 font-medium">Views</th>
            <th className="px-5 py-3 font-medium">Updated</th>
            <th className="px-5 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {posts.map((post) => (
            <tr
              key={post.id}
              className={cn("hover:bg-muted/30", deleting === post.id && "opacity-50")}
            >
              <td className="max-w-xs px-5 py-3">
                <span className="block truncate font-medium">{post.title}</span>
                <span className="text-xs text-muted-foreground">/blog/{post.slug}</span>
              </td>
              <td className="px-5 py-3 text-muted-foreground">{post.author.name}</td>
              <td className="px-5 py-3">
                <span
                  className={cn(
                    "inline-block rounded-full px-2 py-0.5 text-xs font-medium",
                    STATUS_STYLES[post.status] ?? STATUS_STYLES.ARCHIVED,
                  )}
                >
                  {post.status.toLowerCase()}
                </span>
              </td>
              <td className="px-5 py-3 uppercase text-muted-foreground">{post.locale}</td>
              <td className="px-5 py-3 tabular-nums text-muted-foreground">
                {post.views.toLocaleString()}
              </td>
              <td className="px-5 py-3 text-muted-foreground">
                {new Date(post.updatedAt).toLocaleDateString("en-GB")}
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="rounded p-1 hover:bg-muted"
                    title="Edit"
                  >
                    <Pencil className="size-4 text-muted-foreground" />
                  </Link>
                  {post.status === "PUBLISHED" && (
                    <Link
                      href={`/${post.locale === "de" ? "de/" : ""}blog/${post.slug}`}
                      target="_blank"
                      className="rounded p-1 hover:bg-muted"
                      title="View live"
                    >
                      <ExternalLink className="size-4 text-muted-foreground" />
                    </Link>
                  )}
                  <button
                    onClick={() => deletePost(post.id, post.title)}
                    disabled={deleting === post.id}
                    className="rounded p-1 hover:bg-red-50 dark:hover:bg-red-950/30"
                    title="Delete"
                  >
                    <Trash2 className="size-4 text-red-500" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
