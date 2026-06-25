import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { site } from "@/lib/site";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "İletişim",
  description: `${site.name} ile iletişime geçin. ${site.phone}`,
};

export default function ContactPage() {
  const items = [
    {
      icon: Phone,
      label: "Telefon",
      value: site.phone,
      href: `tel:${site.phoneHref}`,
    },
    {
      icon: Mail,
      label: "E-posta",
      value: site.email,
      href: `mailto:${site.email}`,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Mesaj gönder",
      href: `https://wa.me/${site.whatsapp}`,
    },
    { icon: MapPin, label: "Hizmet Bölgeleri", value: site.address },
    { icon: Clock, label: "Çalışma Saatleri", value: site.workingHours },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="max-w-2xl">
        <span className="eyebrow">İletişim</span>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
          Bana ulaşın
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-soft">
          Alım, satım, kiralama veya yatırım danışmanlığı için bana
          ulaşabilirsiniz. Formu doldurun ya da doğrudan telefon ile arayın.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        {/* Info + map */}
        <div>
          <div className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2">
            {items.map((item) => {
              const Icon = item.icon;
              const content = (
                <>
                  <Icon className="text-accent" size={18} />
                  <div className="mt-3 text-xs uppercase tracking-wider text-muted">
                    {item.label}
                  </div>
                  <div className="mt-1 text-sm text-ink">{item.value}</div>
                </>
              );
              return item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="bg-paper p-6 transition-colors hover:bg-sand"
                >
                  {content}
                </a>
              ) : (
                <div key={item.label} className="bg-paper p-6">
                  {content}
                </div>
              );
            })}
          </div>

          <div className="mt-6 aspect-[16/10] overflow-hidden rounded-sm border border-line">
            <iframe
              src={site.mapEmbed}
              title="Ofis konumu"
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Form */}
        <div className="rounded-sm border border-line bg-paper p-6 sm:p-8">
          <h2 className="font-display text-2xl text-ink">Mesaj gönderin</h2>
          <p className="mt-1 text-sm text-muted">
            * ile işaretli alanlar zorunludur.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
