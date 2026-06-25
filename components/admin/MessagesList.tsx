"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, MailOpen, Trash2, Phone, ExternalLink } from "lucide-react";
import type { ContactMessage } from "@/lib/types";
import { formatDate } from "@/lib/format";

type Linked = Record<number, { title: string; slug: string }>;

export default function MessagesList({
  messages,
  linked,
}: {
  messages: ContactMessage[];
  linked: Linked;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<number | null>(null);

  async function toggleRead(m: ContactMessage) {
    setBusy(m.id);
    await fetch(`/api/messages/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !m.read }),
    });
    setBusy(null);
    router.refresh();
  }

  async function remove(m: ContactMessage) {
    if (!confirm("Bu mesajı silmek istiyor musunuz?")) return;
    setBusy(m.id);
    await fetch(`/api/messages/${m.id}`, { method: "DELETE" });
    setBusy(null);
    router.refresh();
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-line bg-paper p-12 text-center">
        <Mail className="mx-auto text-muted" size={26} />
        <p className="mt-3 font-display text-lg text-ink">Mesaj kutunuz boş</p>
        <p className="mt-1 text-sm text-muted">
          Ziyaretçiler iletişim formundan yazdığında burada görünecek.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {messages.map((m) => {
        const prop = m.propertyId ? linked[m.propertyId] : undefined;
        return (
          <li
            key={m.id}
            className={`rounded-sm border bg-paper p-5 transition-opacity ${
              busy === m.id ? "opacity-50" : ""
            } ${m.read ? "border-line" : "border-accent/40 bg-accent/[0.03]"}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  {!m.read && <span className="h-2 w-2 rounded-full bg-accent" />}
                  <span className="font-medium text-ink">{m.name}</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                  <a href={`mailto:${m.email}`} className="hover:text-ink">{m.email}</a>
                  {m.phone && (
                    <a href={`tel:${m.phone}`} className="inline-flex items-center gap-1 hover:text-ink">
                      <Phone size={11} /> {m.phone}
                    </a>
                  )}
                  <span>{formatDate(m.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleRead(m)}
                  title={m.read ? "Okunmadı işaretle" : "Okundu işaretle"}
                  className="flex h-8 w-8 items-center justify-center rounded-sm text-muted hover:bg-sand hover:text-ink"
                >
                  {m.read ? <MailOpen size={15} /> : <Mail size={15} />}
                </button>
                <button
                  onClick={() => remove(m)}
                  title="Sil"
                  className="flex h-8 w-8 items-center justify-center rounded-sm text-muted hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {(m.subject || prop) && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                {m.subject && (
                  <span className="rounded-sm bg-sand px-2 py-0.5 text-ink-soft">
                    {m.subject}
                  </span>
                )}
                {prop && (
                  <a
                    href={`/portfoy/${prop.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-sm bg-ink/5 px-2 py-0.5 text-ink hover:bg-ink/10"
                  >
                    <ExternalLink size={11} /> İlgili ilan: {prop.title}
                  </a>
                )}
              </div>
            )}

            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
              {m.message}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
