"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function ContactForm({
  propertyId,
  defaultSubject,
  compact = false,
}: {
  propertyId?: number;
  defaultSubject?: string;
  compact?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, propertyId }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-sm border border-line bg-sand p-8 text-center">
        <CheckCircle2 className="text-accent" size={36} strokeWidth={1.5} />
        <p className="font-display text-xl text-ink">Mesajınız iletildi</p>
        <p className="text-sm text-muted">
          En kısa sürede sizinle iletişime geçeceğim. Teşekkürler.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-1 text-sm text-ink underline-offset-4 hover:underline"
        >
          Yeni mesaj gönder
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-sm border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-ink";

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className={compact ? "space-y-3" : "grid gap-3 sm:grid-cols-2"}>
        <input name="name" required placeholder="Adınız Soyadınız *" className={inputClass} />
        <input name="phone" placeholder="Telefon" className={inputClass} />
      </div>
      <input
        type="email"
        name="email"
        required
        placeholder="E-posta *"
        className={inputClass}
      />
      {!propertyId && (
        <input
          name="subject"
          defaultValue={defaultSubject}
          placeholder="Konu"
          className={inputClass}
        />
      )}
      <textarea
        name="message"
        required
        rows={compact ? 3 : 5}
        placeholder={
          propertyId
            ? "Bu ilan hakkında bilgi almak istiyorum..."
            : "Mesajınız *"
        }
        className={`${inputClass} resize-none`}
      />
      {status === "error" && (
        <p className="text-sm text-red-600">
          Bir hata oluştu. Lütfen tekrar deneyin veya telefonla ulaşın.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-ink px-5 py-3 text-sm text-paper transition-colors hover:bg-ink-soft disabled:opacity-60"
      >
        <Send size={15} />
        {status === "loading" ? "Gönderiliyor..." : "Mesaj Gönder"}
      </button>
    </form>
  );
}
