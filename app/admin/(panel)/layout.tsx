import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { unreadMessageCount } from "@/lib/properties";
import AdminNav from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defense in depth — middleware also guards this, but never render the
  // panel for an unauthenticated request.
  if (!(await isAuthenticated())) redirect("/admin/login");

  const unread = unreadMessageCount();

  return (
    <div className="flex min-h-screen flex-col bg-sand md:flex-row">
      <AdminNav unread={unread} />
      <div className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">{children}</div>
      </div>
    </div>
  );
}
