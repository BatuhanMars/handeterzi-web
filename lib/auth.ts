// Lightweight single-admin auth: a password (from env) unlocks an HMAC-signed
// session cookie. Signing uses Web Crypto so the same code runs both in
// middleware (edge runtime) and in server components / route handlers (node).

export const SESSION_COOKIE = "ht_session";
const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 gün

const enc = new TextEncoder();

function getSecret(): string {
  return (
    process.env.SESSION_SECRET ||
    "dev-insecure-secret-change-me-in-env-local-please"
  );
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin1234";
}

function b64urlFromBytes(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function bytesFromB64url(input: string): Uint8Array {
  let s = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = s.length % 4 ? 4 - (s.length % 4) : 0;
  s += "=".repeat(pad);
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmac(data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return new Uint8Array(sig);
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function createSessionToken(ttlMs = DEFAULT_TTL_MS): Promise<string> {
  const payload = b64urlFromBytes(
    enc.encode(JSON.stringify({ exp: Date.now() + ttlMs })),
  );
  const sig = b64urlFromBytes(await hmac(payload));
  return `${payload}.${sig}`;
}

export async function verifySessionToken(
  token: string | undefined | null,
): Promise<boolean> {
  if (!token || !token.includes(".")) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  try {
    const expected = await hmac(payload);
    if (!constantTimeEqual(expected, bytesFromB64url(sig))) return false;
    const data = JSON.parse(
      new TextDecoder().decode(bytesFromB64url(payload)),
    ) as { exp?: number };
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

// Server-only: reads the cookie via next/headers. Do not call from middleware.
export async function isAuthenticated(): Promise<boolean> {
  const { cookies } = await import("next/headers");
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export function checkPassword(input: string): boolean {
  const expected = enc.encode(getAdminPassword());
  const given = enc.encode(input || "");
  return constantTimeEqual(expected, given);
}
