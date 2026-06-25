import { NextResponse } from "next/server";
import { createMessage } from "@/lib/properties";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Ad, e-posta ve mesaj zorunludur." },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Geçerli bir e-posta girin." },
        { status: 400 },
      );
    }

    createMessage({
      name,
      email,
      phone: body.phone ? String(body.phone).trim() : null,
      subject: body.subject ? String(body.subject).trim() : null,
      message,
      propertyId: body.propertyId ? Number(body.propertyId) : null,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
