import type { Metadata } from "next";
import { getAdminSessionFromCookies } from "@/lib/admin-session";
import { AdminShell } from "@/components/admin/admin-shell";
import { PostEditor } from "@/components/admin/post-editor";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "New Post" };

export default async function NewPostPage() {
  const session = await getAdminSessionFromCookies();

  return (
    <AdminShell userName={session?.name}>
      <div className="flex h-[calc(100vh-0px)] flex-col overflow-hidden">
        <div className="border-b bg-background px-6 py-4">
          <h1 className="text-lg font-semibold">New post</h1>
        </div>
        <div className="flex-1 overflow-hidden">
          <PostEditor />
        </div>
      </div>
    </AdminShell>
  );
}
