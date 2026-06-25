"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { site } from "@/lib/site";

const NAV = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/portfoy", label: "Portföy" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-paper/90 backdrop-blur border-b border-line"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src={site.logoMark}
            alt={site.name}
            width={40}
            height={35}
            priority
            className="h-9 w-auto sm:h-10"
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl tracking-tight text-ink sm:text-2xl">
              {site.name}
            </span>
            <span className="mt-0.5 text-[0.6rem] uppercase tracking-[0.22em] text-muted">
              {site.role}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative text-sm tracking-wide transition-colors hover:text-ink ${
                isActive(item.href) ? "text-ink" : "text-muted"
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute -bottom-1.5 left-0 h-px w-full bg-accent" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${site.phoneHref}`}
            className="hidden items-center gap-2 rounded-sm border border-ink px-4 py-2 text-sm text-ink transition-colors hover:bg-ink hover:text-paper md:inline-flex"
          >
            <Phone size={15} />
            {site.phone}
          </a>
          <button
            type="button"
            aria-label="Menü"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center text-ink md:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-line bg-paper md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-5 py-2 sm:px-8">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`border-b border-line-soft py-3.5 text-sm ${
                  isActive(item.href) ? "text-ink" : "text-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`tel:${site.phoneHref}`}
              className="mt-4 mb-3 inline-flex items-center justify-center gap-2 rounded-sm bg-ink px-4 py-3 text-sm text-paper"
            >
              <Phone size={15} /> {site.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
