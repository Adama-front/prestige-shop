"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/presentation/components/ui/drawer";
import { Skeleton } from "@/presentation/components/ui/Skeleton";
import { formatXof } from "@/shared/utils/formatXof";
import { Search, Shield, ShieldOff, UserPlus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface AdminCustomer {
  id: string;
  username: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  ordersCount: number;
  totalSpentXof: number;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());

      const res = await fetch(`/api/v1/admin/customers?${params.toString()}`, {
        cache: "no-store"
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || "Erreur serveur");
      setCustomers(json.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadCustomers();
    }, 200);
    return () => clearTimeout(timer);
  }, [loadCustomers]);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/v1/admin/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || "Création impossible.");

      setDrawerOpen(false);
      setUsername("");
      setEmail("");
      setPassword("");
      await loadCustomers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de création.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleRole = async (customer: AdminCustomer) => {
    const nextRole = customer.role === "ADMIN" ? "CUSTOMER" : "ADMIN";
    setTogglingId(customer.id);
    setError("");
    try {
      const res = await fetch(`/api/v1/admin/customers/${customer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: nextRole })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || "Modification impossible.");

      setCustomers((prev) =>
        prev.map((c) => (c.id === customer.id ? { ...c, role: nextRole } : c))
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">
            Clients &amp; Équipe Admin
          </h1>
          <p className="text-sm text-[#64748B]">
            Consultez vos clients et ajoutez d&apos;autres gestionnaires sur le dashboard.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#059669] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#047857]"
        >
          <UserPlus className="h-4 w-4" />
          <span>Ajouter un gestionnaire</span>
        </button>
      </div>

      {/* Full-width Search */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un client ou administrateur par nom ou email..."
            className="w-full rounded-xl border border-[#E2E8F0] py-2 pl-9 pr-3 text-sm focus:border-[#059669] focus:outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-5" role="status" aria-label="Chargement des clients">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex items-center justify-between gap-4 rounded-xl border border-[#F1F5F9] p-3">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32 rounded-md" />
                  <Skeleton className="h-3 w-44 rounded-md" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-4 w-10 rounded-md" />
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-8 w-28 rounded-xl" />
              </div>
            ))}
          </div>
        ) : customers.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#64748B]">
            Aucun utilisateur trouvé.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs uppercase text-[#64748B]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Utilisateur</th>
                  <th className="px-4 py-3 font-semibold">Rôle</th>
                  <th className="px-4 py-3 font-semibold">Commandes</th>
                  <th className="px-4 py-3 font-semibold">Total dépensé</th>
                  <th className="px-4 py-3 font-semibold">Inscrit le</th>
                  <th className="px-4 py-3 text-right font-semibold">Gestion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-[#F8FAFC]">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[#0F172A]">
                        {customer.username}
                      </p>
                      <p className="text-xs text-[#64748B]">{customer.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          customer.role === "ADMIN"
                            ? "bg-[#D1FAE5] text-[#047857]"
                            : "bg-[#F1F5F9] text-[#0F172A]"
                        }`}
                      >
                        {customer.role === "ADMIN" ? "Admin" : "Client"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-[#0F172A]">
                      {customer.ordersCount}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#0F172A]">
                      {formatXof(customer.totalSpentXof)}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#64748B]">
                      {new Date(customer.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        disabled={togglingId === customer.id}
                        onClick={() => handleToggleRole(customer)}
                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
                          customer.role === "ADMIN"
                            ? "border-red-200 text-red-600 hover:bg-red-50"
                            : "border-[#E2E8F0] text-[#0F172A] hover:bg-[#F1F5F9]"
                        }`}
                      >
                        {customer.role === "ADMIN" ? (
                          <>
                            <ShieldOff className="h-3.5 w-3.5" />
                            <span>Retirer Admin</span>
                          </>
                        ) : (
                          <>
                            <Shield className="h-3.5 w-3.5 text-[#059669]" />
                            <span>Nommer Admin</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Manager Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-md overflow-y-auto">
            <DrawerHeader>
              <DrawerTitle>Ajouter un gestionnaire</DrawerTitle>
              <DrawerDescription>
                Créez un compte administrateur qui pourra se connecter sur /admin/login.
              </DrawerDescription>
            </DrawerHeader>

            <form onSubmit={handleCreateAdmin}>
              <div className="space-y-4 px-6 py-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#0F172A]">
                    Nom d&apos;utilisateur
                  </label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ex: gestionnaire01"
                    className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#059669] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-[#0F172A]">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="manager@prestigeshop.ci"
                    className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#059669] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-[#0F172A]">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 caractères"
                    className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#059669] focus:outline-none"
                  />
                </div>
              </div>

              <DrawerFooter>
                <DrawerClose asChild>
                  <button
                    type="button"
                    className="cursor-pointer rounded-xl border border-[#E2E8F0] px-4 py-2 text-sm font-semibold text-[#0F172A] hover:bg-[#F1F5F9]"
                  >
                    Annuler
                  </button>
                </DrawerClose>
                <button
                  type="submit"
                  disabled={saving}
                  className="cursor-pointer rounded-xl bg-[#059669] px-5 py-2 text-sm font-semibold text-white hover:bg-[#047857] disabled:opacity-60"
                >
                  {saving ? "Création..." : "Créer le gestionnaire"}
                </button>
              </DrawerFooter>
            </form>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
