import Link from "next/link";
import { cn } from "@/lib/utils";

type PostRow = {
  id: number;
  slug: string;
  title: string;
  status: string;
  locale: string;
  views: number;
  updatedAt: Date;
  author: { name: string };
};

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  DRAFT: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  ARCHIVED: "bg-muted text-muted-foreground",
};

export function RecentPostsTable({ posts }: { posts: PostRow[] }) {
  if (posts.length === 0) {
    return (
      <p className="px-5 py-8 text-center text-sm text-muted-foreground">
        No posts yet.{" "}
        <Link href="/admin/posts/new" className="text-brand-600 hover:underline">
          Create the first one →
        </Link>
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-muted-foreground">
            <th className="px-5 py-3 font-medium">Title</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Locale</th>
            <th className="px-5 py-3 font-medium">Views</th>
            <th className="px-5 py-3 font-medium">Updated</th>
            <th className="px-5 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-muted/30">
              <td className="max-w-xs truncate px-5 py-3 font-medium">
                {post.title}
              </td>
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
              <td className="px-5 py-3 uppercase text-muted-foreground">
                {post.locale}
              </td>
              <td className="px-5 py-3 tabular-nums text-muted-foreground">
                {post.views.toLocaleString()}
              </td>
              <td className="px-5 py-3 text-muted-foreground">
                {new Date(post.updatedAt).toLocaleDateString("en-GB")}
              </td>
              <td className="px-5 py-3">
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="text-brand-600 hover:underline"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
