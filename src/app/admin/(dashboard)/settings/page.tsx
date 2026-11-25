"use client";

import { Skeleton } from "@/presentation/components/ui/Skeleton";
import { AlertTriangle, CheckCircle2, Save, ShieldAlert, Store, Truck } from "lucide-react";
import { useEffect, useState } from "react";

interface SiteSettings {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  defaultShippingCostXof: number;
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SiteSettings>({
    storeName: "PrestigeShop",
    supportEmail: "contact@prestigeshop.ci",
    supportPhone: "+225 07 00 00 00 00",
    defaultShippingCostXof: 2000,
    maintenanceMode: false,
    maintenanceMessage:
      "Notre boutique est actuellement en maintenance. Nous revenons très vite !"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedBanner, setSavedBanner] = useState(false);

  useEffect(() => {
    fetch("/api/v1/admin/settings", { cache: "no-store" })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error?.message || "Erreur serveur");
        setForm({
          storeName: json.data.storeName,
          supportEmail: json.data.supportEmail,
          supportPhone: json.data.supportPhone,
          defaultShippingCostXof: json.data.defaultShippingCostXof,
          maintenanceMode: json.data.maintenanceMode,
          maintenanceMessage: json.data.maintenanceMessage
        });
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Erreur de chargement.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSavedBanner(false);
    try {
      const res = await fetch("/api/v1/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || "Erreur d'enregistrement");
      setSavedBanner(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur d'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6" role="status" aria-label="Chargement des paramètres">
        <div className="space-y-2">
          <Skeleton className="h-8 w-52 rounded-lg" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">
          Paramètres de l&apos;application
        </h1>
        <p className="text-sm text-[#64748B]">
          Configurez le mode maintenance, les coordonnées de support et la livraison.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {savedBanner && (
        <div className="flex items-center gap-2 rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] p-3 text-sm font-medium text-[#047857]">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Paramètres enregistrés avec succès.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Maintenance Mode Card */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-xl p-2.5 ${
                    form.maintenanceMode
                      ? "bg-amber-100 text-amber-700"
                      : "bg-[#ECFDF5] text-[#059669]"
                  }`}
                >
                  <ShieldAlert className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-[#0F172A]">
                    Mode Maintenance
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Bloque temporairement l&apos;accès public à la boutique tout en gardant l&apos;accès Admin.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={form.maintenanceMode}
                  onChange={(e) =>
                    setForm({ ...form, maintenanceMode: e.target.checked })
                  }
                  className="peer sr-only"
                />
                <div className="h-6 w-11 rounded-full bg-slate-200 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-amber-500 peer-checked:after:translate-x-5" />
              </label>
            </div>

            {form.maintenanceMode && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-medium text-amber-800">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>
                  Attention : la boutique publique affiche actuellement la page de maintenance.
                </span>
              </div>
            )}

            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-[#0F172A]">
                Message affiché aux visiteurs
              </label>
              <textarea
                rows={3}
                required
                value={form.maintenanceMessage}
                onChange={(e) =>
                  setForm({ ...form, maintenanceMessage: e.target.value })
                }
                className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#059669] focus:outline-none"
              />
            </div>
          </div>

          {/* Store & Delivery Info Card */}
          <div className="space-y-4 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-[#ECFDF5] p-2.5 text-[#059669]">
                <Store className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-base font-bold text-[#0F172A]">
                  Informations de la boutique
                </h2>
                <p className="text-xs text-[#64748B]">
                  Coordonnées de contact et paramètres de livraison.
                </p>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#0F172A]">
                Nom de la boutique
              </label>
              <input
                type="text"
                required
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#059669] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#0F172A]">
                  Email support
                </label>
                <input
                  type="email"
                  required
                  value={form.supportEmail}
                  onChange={(e) =>
                    setForm({ ...form, supportEmail: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#059669] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#0F172A]">
                  Téléphone / WhatsApp
                </label>
                <input
                  type="text"
                  required
                  value={form.supportPhone}
                  onChange={(e) =>
                    setForm({ ...form, supportPhone: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#059669] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-[#0F172A]">
                <Truck className="h-4 w-4 text-[#059669]" />
                <span>Frais de livraison par défaut (FCFA)</span>
              </label>
              <input
                type="number"
                min={0}
                required
                value={form.defaultShippingCostXof}
                onChange={(e) =>
                  setForm({
                    ...form,
                    defaultShippingCostXof: Number(e.target.value)
                  })
                }
                className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#059669] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#059669] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#047857] disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Enregistrement..." : "Enregistrer les paramètres"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
