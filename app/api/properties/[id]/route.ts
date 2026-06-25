import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  deleteProperty,
  getPropertyById,
  updateProperty,
} from "@/lib/properties";
import { parsePropertyInput } from "@/lib/validation";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }
  const { id } = await params;
  const property = getPropertyById(Number(id));
  if (!property) {
    return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  }
  return NextResponse.json(property);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }
  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz veri." }, { status: 400 });
  }

  const parsed = parsePropertyInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const updated = updateProperty(Number(id), parsed.data);
  if (!updated) {
    return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }
  const { id } = await params;
  const ok = deleteProperty(Number(id));
  if (!ok) {
    return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
