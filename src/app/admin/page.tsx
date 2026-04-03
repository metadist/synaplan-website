import type { Metadata } from "next";
import { FileText, Eye, Globe, LayoutDashboard } from "lucide-react";

const iconCls = "size-4 text-muted-foreground";
import { prisma } from "@/lib/prisma";
import { getAdminSessionFromCookies } from "@/lib/admin-session";
import { AdminShell, AdminPageHeader, StatCard } from "@/components/admin/admin-shell";
import { RecentPostsTable } from "@/components/admin/recent-posts-table";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const session = await getAdminSessionFromCookies();

  const [total, published, drafts, totalViews, recentPosts] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.post.count({ where: { status: "DRAFT" } }),
    prisma.post.aggregate({ _sum: { views: true } }),
    prisma.post.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        slug: true,
        title: true,
        status: true,
        locale: true,
        views: true,
        updatedAt: true,
        author: { select: { name: true } },
      },
    }),
  ]);

  return (
    <AdminShell userName={session?.name}>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your blog and content"
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total posts" value={total} icon={<FileText className={iconCls} />} />
          <StatCard label="Published" value={published} icon={<Globe className={iconCls} />} />
          <StatCard label="Drafts" value={drafts} icon={<LayoutDashboard className={iconCls} />} />
          <StatCard label="Total views" value={totalViews._sum.views ?? 0} icon={<Eye className={iconCls} />} />
        </div>

        {/* Recent posts */}
        <div className="rounded-xl border bg-background">
          <div className="border-b px-5 py-4">
            <h2 className="font-medium">Recent posts</h2>
          </div>
          <RecentPostsTable posts={recentPosts} />
        </div>
      </div>
    </AdminShell>
  );
}
