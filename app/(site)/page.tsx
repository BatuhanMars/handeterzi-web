import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone, Check } from "lucide-react";
import { site } from "@/lib/site";
import { listProperties } from "@/lib/properties";
import PropertyCard from "@/components/PropertyCard";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const featured = listProperties({ featuredOnly: true, limit: 6 });
  const latest = listProperties({ limit: 6 });
  const showcase = featured.length > 0 ? featured : latest;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-paper">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pt-16 pb-20 sm:px-8 lg:grid-cols-2 lg:pt-24 lg:pb-28">
          <div className="animate-fade-up">
            <span className="eyebrow">{site.role}</span>
            <h1 className="mt-5 font-display text-4xl leading-[1.1] text-ink sm:text-5xl lg:text-6xl">
              {site.tagline}
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft">
              {site.heroSubtitle}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/portfoy"
                className="inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3.5 text-sm text-paper transition-colors hover:bg-ink-soft"
              >
                Portföyü Keşfet <ArrowRight size={16} />
              </Link>
              <a
                href={`tel:${site.phoneHref}`}
                className="inline-flex items-center gap-2 rounded-sm border border-ink px-6 py-3.5 text-sm text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                <Phone size={15} /> Hemen Ara
              </a>
            </div>
          </div>

          <div className="relative animate-fade-up">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-sand-deep">
              <Image
                src={site.portrait}
                alt={`${site.name} — ${site.role}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-sm border border-line bg-paper px-6 py-5 shadow-[0_18px_40px_-24px_rgba(26,24,22,0.4)] sm:block">
              <div className="font-display text-3xl text-ink">{site.about.stats[0].value}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted">
                {site.about.stats[0].label}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured portfolio */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Portföy</span>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              {featured.length > 0 ? "Öne Çıkan Gayrimenkuller" : "Güncel Gayrimenkuller"}
            </h2>
          </div>
          <Link
            href="/portfoy"
            className="hidden shrink-0 items-center gap-2 text-sm text-ink hover:text-accent sm:inline-flex"
          >
            Tümünü Gör <ArrowRight size={15} />
          </Link>
        </div>

        {showcase.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {showcase.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <p className="mt-10 rounded-sm border border-dashed border-line bg-sand p-10 text-center text-muted">
            Henüz ilan eklenmedi. Yönetim panelinden ilk gayrimenkulünüzü ekleyin.
          </p>
        )}

        <div className="mt-10 text-center sm:hidden">
          <Link href="/portfoy" className="inline-flex items-center gap-2 text-sm text-ink">
            Tümünü Gör <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="border-y border-line bg-sand">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <div className="max-w-xl">
            <span className="eyebrow">Hizmetler</span>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              Uçtan uca gayrimenkul danışmanlığı
            </h2>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {site.services.map((s) => (
              <div key={s.title} className="bg-paper p-7 transition-colors hover:bg-sand">
                <h3 className="font-display text-xl text-ink">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[5/4] overflow-hidden rounded-sm bg-sand-deep">
            <Image
              src="/brand/coast.jpg"
              alt="Ege ve Marmara kıyıları"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <span className="eyebrow">Hakkımda</span>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              {site.name}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-soft">
              {site.about.lead}
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Şeffaf fiyatlama ve gerçekçi bilgilendirme",
                "Eksiksiz evrak, sözleşme ve tapu takibi",
                "Bölge ve piyasa odaklı yatırım danışmanlığı",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink-soft">
                  <Check size={17} className="mt-0.5 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/hakkimizda"
              className="mt-8 inline-flex items-center gap-2 text-sm text-ink hover:text-accent"
            >
              Daha Fazlası <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-y border-line bg-ink">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 py-14 sm:px-8 lg:grid-cols-4">
          {site.about.stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-4xl text-paper">{s.value}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.18em] text-paper/60">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 py-24 text-center sm:px-8">
        <span className="eyebrow">İletişim</span>
        <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl text-ink sm:text-4xl">
          Gayrimenkulünüzü değerlendirelim, doğru kararı birlikte verelim.
        </h2>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            href="/iletisim"
            className="inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3.5 text-sm text-paper transition-colors hover:bg-ink-soft"
          >
            İletişime Geç <ArrowRight size={16} />
          </Link>
          <a
            href={`https://wa.me/${site.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-sm border border-ink px-6 py-3.5 text-sm text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
