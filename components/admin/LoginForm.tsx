"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { site } from "@/lib/site";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Giriş başarısız.");
        setLoading(false);
        return;
      }
      const from = params.get("from") || "/admin";
      router.push(from);
      router.refresh();
    } catch {
      setError("Bağlantı hatası.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand px-5">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-sm bg-ink text-paper">
            <Lock size={20} />
          </div>
          <h1 className="mt-5 font-display text-2xl text-ink">{site.name}</h1>
          <p className="mt-1 text-sm text-muted">Yönetim Paneli Girişi</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-8 rounded-sm border border-line bg-paper p-6"
        >
          <label className="block text-sm text-ink-soft">Şifre</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
            placeholder="••••••••"
            className="mt-2 w-full rounded-sm border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink"
          />
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-sm bg-ink px-4 py-3 text-sm text-paper transition-colors hover:bg-ink-soft disabled:opacity-60"
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          Siteye dön{" "}
          <Link href="/" className="text-ink underline-offset-4 hover:underline">
            handeterzi.com.tr
          </Link>
        </p>
      </div>
    </div>
  );
}
