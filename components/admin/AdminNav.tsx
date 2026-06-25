"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Mail,
  ExternalLink,
  LogOut,
  Building2,
} from "lucide-react";
import { site } from "@/lib/site";

const LINKS = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard, exact: true },
  { href: "/admin/ilan/yeni", label: "Yeni İlan", icon: PlusCircle },
  { href: "/admin/mesajlar", label: "Mesajlar", icon: Mail },
];

export default function AdminNav({ unread }: { unread: number }) {
  const pathname = usePathname();
  const router = useRouter();

  const active = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      {/* Top bar (mobile) + sidebar (desktop) */}
      <aside className="flex shrink-0 flex-col border-line bg-ink text-paper md:sticky md:top-0 md:h-screen md:w-60 md:self-start md:border-r">
        <div className="flex items-center gap-2.5 border-b border-paper/10 px-5 py-5">
          <Building2 size={20} className="text-paper/70" />
          <div className="leading-tight">
            <div className="font-display text-lg">{site.name}</div>
            <div className="text-[0.62rem] uppercase tracking-[0.2em] text-paper/50">
              Yönetim
            </div>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto p-3 md:flex-1 md:flex-col md:overflow-visible">
          {LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = active(link.href, link.exact);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 whitespace-nowrap rounded-sm px-3.5 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-paper/15 text-paper"
                    : "text-paper/65 hover:bg-paper/10 hover:text-paper"
                }`}
              >
                <Icon size={17} />
                {link.label}
                {link.href === "/admin/mesajlar" && unread > 0 && (
                  <span className="ml-auto rounded-full bg-accent px-1.5 py-0.5 text-[0.65rem] font-medium text-ink">
                    {unread}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden flex-col gap-1 border-t border-paper/10 p-3 md:flex">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-sm px-3.5 py-2.5 text-sm text-paper/65 transition-colors hover:bg-paper/10 hover:text-paper"
          >
            <ExternalLink size={17} /> Siteyi Gör
          </a>
          <button
            onClick={logout}
            className="flex items-center gap-3 rounded-sm px-3.5 py-2.5 text-sm text-paper/65 transition-colors hover:bg-paper/10 hover:text-paper"
          >
            <LogOut size={17} /> Çıkış Yap
          </button>
        </div>
      </aside>
    </>
  );
}
