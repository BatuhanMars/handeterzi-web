import { listMessages, getPropertyById } from "@/lib/properties";
import MessagesList from "@/components/admin/MessagesList";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mesajlar" };

export default function MessagesPage() {
  const messages = listMessages();

  // Build a lookup of linked properties for the messages that reference one.
  const linked: Record<number, { title: string; slug: string }> = {};
  for (const m of messages) {
    if (m.propertyId && !linked[m.propertyId]) {
      const p = getPropertyById(m.propertyId);
      if (p) linked[m.propertyId] = { title: p.title, slug: p.slug };
    }
  }

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <h1 className="font-display text-2xl text-ink sm:text-3xl">Mesajlar</h1>
      <p className="mt-1 mb-6 text-sm text-muted">
        Toplam {messages.length} mesaj · {unread} okunmamış
      </p>
      <MessagesList messages={messages} linked={linked} />
    </div>
  );
}
