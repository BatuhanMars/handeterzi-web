import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hakkımda",
  description: site.about.lead,
};

export default function AboutPage() {
  return (
    <div>
      {/* Intro */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow">Hakkımda</span>
            <h1 className="mt-4 font-display text-4xl leading-tight text-ink sm:text-5xl">
              {site.name}
            </h1>
            <div className="mt-2 text-sm uppercase tracking-[0.22em] text-muted">
              {site.role}
            </div>
            <p className="mt-6 text-lg leading-relaxed text-ink">
              {site.about.lead}
            </p>
          </div>
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
        </div>
      </section>

      {/* Story */}
      <section className="border-y border-line bg-sand">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="space-y-5 text-base leading-relaxed text-ink-soft">
            {site.about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-4">
            {site.about.stats.map((s) => (
              <div key={s.label} className="bg-paper p-6 text-center">
                <div className="font-display text-3xl text-ink">{s.value}</div>
                <div className="mt-1.5 text-xs uppercase tracking-wider text-muted">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="max-w-xl">
          <span className="eyebrow">Çalışma İlkelerim</span>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
            Neden benimle çalışmalısınız?
          </h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              t: "Şeffaflık",
              d: "Süreç boyunca her adımı açıkça paylaşır, sizi gerçekçi verilerle bilgilendiririm.",
            },
            {
              t: "Doğru Fiyatlama",
              d: "Piyasa analizine dayalı, ne fazla ne eksik; gerçek değerinde fiyatlama.",
            },
            {
              t: "Güçlü Pazarlık",
              d: "Çıkarlarınızı koruyan, sonuç odaklı ve profesyonel pazarlık yönetimi.",
            },
            {
              t: "Hukuki Güvence",
              d: "Sözleşme, evrak ve tapu süreçlerinde eksiksiz takip ve güvenli işlem.",
            },
            {
              t: "Bölge Uzmanlığı",
              d: "Bölgeyi ve piyasa dinamiklerini yakından bilen yerinde danışmanlık.",
            },
            {
              t: "7/24 Erişim",
              d: "Sorularınıza hızlı yanıt; ihtiyaç duyduğunuz an ulaşabileceğiniz danışman.",
            },
          ].map((item) => (
            <div key={item.t} className="rounded-sm border border-line bg-paper p-6">
              <Check className="text-accent" size={20} />
              <h3 className="mt-3 font-display text-lg text-ink">{item.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line bg-ink">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8">
          <h2 className="mx-auto max-w-2xl font-display text-3xl text-paper sm:text-4xl">
            Gayrimenkul yolculuğunuza birlikte başlayalım.
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/portfoy"
              className="inline-flex items-center gap-2 rounded-sm bg-paper px-6 py-3.5 text-sm text-ink transition-opacity hover:opacity-90"
            >
              Portföyü Gör <ArrowRight size={16} />
            </Link>
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 rounded-sm border border-paper/30 px-6 py-3.5 text-sm text-paper transition-colors hover:bg-paper/10"
            >
              İletişime Geç
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
