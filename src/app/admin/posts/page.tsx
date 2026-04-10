import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSessionFromCookies } from "@/lib/admin-session";
import { AdminShell, AdminPageHeader, NewPostButton } from "@/components/admin/admin-shell";
import { PostsTable } from "@/components/admin/posts-table";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Posts" };

interface SearchParams {
  page?: string;
  status?: string;
  locale?: string;
  q?: string;
}

export default async function AdminPostsPage({
  searchParams: rawSP,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    redirect("/admin/login?from=/admin/posts");
  }

  const searchParams = await rawSP;

  const page = Math.max(1, parseInt(searchParams.page ?? "1"));
  const limit = 20;
  const status = searchParams.status as "PUBLISHED" | "DRAFT" | "ARCHIVED" | undefined;
  const locale = searchParams.locale;
  const q = searchParams.q?.trim();

  const where = {
    ...(status && { status }),
    ...(locale && { locale }),
    ...(q && {
      OR: [
        { title: { contains: q, mode: "insensitive" as const } },
        { excerpt: { contains: q, mode: "insensitive" as const } },
      ],
    }),
  };

  const [total, posts] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      select: {
        id: true,
        slug: true,
        title: true,
        status: true,
        locale: true,
        views: true,
        publishedAt: true,
        updatedAt: true,
        author: { select: { name: true } },
      },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
      <AdminShell userName={session.name}>
      <AdminPageHeader
        title="Posts"
        description={`${total} post${total !== 1 ? "s" : ""} total`}
        action={<NewPostButton />}
      />

      <div className="p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {[undefined, "PUBLISHED", "DRAFT", "ARCHIVED"].map((s) => (
            <Link
              key={s ?? "all"}
              href={`/admin/posts?${new URLSearchParams({ ...(s && { status: s }), ...(q && { q }), ...(locale && { locale }) }).toString()}`}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                status === s
                  ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/40"
                  : "hover:bg-muted"
              }`}
            >
              {s ?? "All"}
            </Link>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-xl border bg-background">
          <PostsTable posts={posts} />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/posts?page=${page - 1}${status ? `&status=${status}` : ""}`}
                  className="rounded-lg border px-3 py-1.5 hover:bg-muted"
                >
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/posts?page=${page + 1}${status ? `&status=${status}` : ""}`}
                  className="rounded-lg border px-3 py-1.5 hover:bg-muted"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
