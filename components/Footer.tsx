import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { site } from "@/lib/site";
import { InstagramIcon, FacebookIcon, LinkedinIcon } from "@/components/BrandIcons";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-line bg-sand">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <Image
            src={site.logoFull}
            alt={`${site.name} — ${site.role}`}
            width={220}
            height={117}
            className="h-20 w-auto"
          />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-soft">
            {site.tagline}
          </p>
          <div className="mt-6 flex gap-3">
            {site.social.instagram && (
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-line text-muted transition-colors hover:border-ink hover:text-ink"
              >
                <InstagramIcon size={16} />
              </a>
            )}
            {site.social.facebook && (
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-line text-muted transition-colors hover:border-ink hover:text-ink"
              >
                <FacebookIcon size={16} />
              </a>
            )}
            {site.social.linkedin && (
              <a
                href={site.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-line text-muted transition-colors hover:border-ink hover:text-ink"
              >
                <LinkedinIcon size={16} />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Menü</h4>
          <ul className="space-y-2.5 text-sm text-ink-soft">
            <li><Link href="/" className="hover:text-ink">Ana Sayfa</Link></li>
            <li><Link href="/portfoy" className="hover:text-ink">Portföy</Link></li>
            <li><Link href="/hakkimizda" className="hover:text-ink">Hakkımızda</Link></li>
            <li><Link href="/iletisim" className="hover:text-ink">İletişim</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-4">İletişim</h4>
          <ul className="space-y-3 text-sm text-ink-soft">
            <li>
              <a href={`tel:${site.phoneHref}`} className="flex items-start gap-2.5 hover:text-ink">
                <Phone size={15} className="mt-0.5 shrink-0 text-accent" />
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex items-start gap-2.5 hover:text-ink">
                <Mail size={15} className="mt-0.5 shrink-0 text-accent" />
                {site.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={15} className="mt-0.5 shrink-0 text-accent" />
              {site.address}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-muted sm:flex-row sm:px-8">
          <p>© {year} {site.name}. Tüm hakları saklıdır.</p>
          <p>
            <Link href="/admin" className="hover:text-ink">Yönetim Paneli</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
