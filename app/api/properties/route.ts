import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createProperty, listProperties } from "@/lib/properties";
import { parsePropertyInput } from "@/lib/validation";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }
  return NextResponse.json(listProperties({ includeUnpublished: true }));
}

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }
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

  const property = createProperty(parsed.data);
  return NextResponse.json(property, { status: 201 });
}
