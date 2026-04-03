import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSessionFromCookies } from "@/lib/admin-session";
import { AdminShell } from "@/components/admin/admin-shell";
import { PostEditor } from "@/components/admin/post-editor";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit Post" };

type Params = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Params) {
  const session = await getAdminSessionFromCookies();
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      coverImage: true,
      status: true,
      locale: true,
      tags: true,
    },
  });

  if (!post) notFound();

  return (
    <AdminShell userName={session?.name}>
      <div className="flex h-screen flex-col overflow-hidden">
        <div className="border-b bg-background px-6 py-4">
          <h1 className="text-lg font-semibold">Edit post</h1>
          <p className="text-sm text-muted-foreground">{post.title}</p>
        </div>
        <div className="flex-1 overflow-hidden">
          <PostEditor
            initial={{
              ...post,
              excerpt: post.excerpt ?? undefined,
              coverImage: post.coverImage ?? undefined,
              status: post.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
            }}
          />
        </div>
      </div>
    </AdminShell>
  );
}
