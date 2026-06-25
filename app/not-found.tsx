import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <div className="font-display text-6xl text-ink">404</div>
      <p className="mt-4 max-w-sm text-base text-ink-soft">
        Aradığınız sayfa bulunamadı. İlan kaldırılmış ya da bağlantı hatalı
        olabilir.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-sm bg-ink px-5 py-3 text-sm text-paper hover:bg-ink-soft"
        >
          Ana Sayfa
        </Link>
        <Link
          href="/portfoy"
          className="rounded-sm border border-ink px-5 py-3 text-sm text-ink hover:bg-ink hover:text-paper"
        >
          Portföyü Gör
        </Link>
      </div>
    </div>
  );
}
