"use client";

import { Lock, ShieldCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function AdminLoginForm() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const safeReturnTo =
    returnTo && returnTo.startsWith("/admin") ? returnTo : "/admin";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: identifier, password })
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error?.message || "Connexion refusée.");
      }
      window.location.assign(safeReturnTo);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Impossible de se connecter."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F172A] px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111827] p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#059669] text-white shadow-lg shadow-[#059669]/25">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-white">
            Portail Administrateur
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Accès sécurisé réservé à la gestion de PrestigeShop
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-medium text-red-300"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-identifier"
              className="mb-1.5 block text-xs font-medium text-slate-300"
            >
              Email ou nom d&apos;utilisateur
            </label>
            <input
              id="admin-identifier"
              type="text"
              required
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="admin@exemple.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#10B981] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="mb-1.5 block text-xs font-medium text-slate-300"
            >
              Mot de passe
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#10B981] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#059669] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#059669]/20 transition-colors hover:bg-[#047857] disabled:opacity-60"
          >
            <Lock className="h-4 w-4" />
            <span>{loading ? "Vérification..." : "Accéder au Dashboard"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F172A]" />}>
      <AdminLoginForm />
    </Suspense>
  );
}
