import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getPropertyById, setFeatured, setPublished } from "@/lib/properties";

// Toggle published / featured flags without sending the whole property.
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }
  const { id } = await params;
  const nid = Number(id);
  if (!getPropertyById(nid)) {
    return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz veri." }, { status: 400 });
  }

  if (typeof body.published === "boolean") setPublished(nid, body.published);
  if (typeof body.featured === "boolean") setFeatured(nid, body.featured);

  return NextResponse.json(getPropertyById(nid));
}
