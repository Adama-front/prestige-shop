"use client";

import { Skeleton } from "@/presentation/components/ui/Skeleton";
import { formatXof } from "@/shared/utils/formatXof";
import { ORDER_STATUS_META } from "@/presentation/features/admin/orderStatusMeta";
import type { OrderStatus } from "@/generated/prisma/client";
import {
  AlertTriangle,
  ArrowRight,
  FolderPlus,
  Package,
  PackagePlus,
  ShoppingBag,
  Sparkles,
  Tag,
  TrendingUp,
  Users
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface StatsData {
  totalRevenueXof: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  publishedProducts: number;
  promoProducts: number;
  newProducts: number;
  totalCustomers: number;
  lowStockProducts: Array<{
    id: number;
    title: string;
    stock: number;
    priceXof: number;
    imageUrl: string;
    isPublished: boolean;
  }>;
  recentOrders: Array<{
    id: string;
    status: OrderStatus;
    customerName: string;
    phone: string;
    city: string;
    totalXof: number;
    itemsCount: number;
    createdAt: string;
  }>;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/v1/admin/stats", { cache: "no-store" })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error?.message || "Erreur serveur");
        setStats(json.data);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Erreur de chargement.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6" role="status" aria-label="Chargement du tableau de bord">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-4 w-72 rounded-md" />
          </div>
          <div className="flex gap-2.5">
            <Skeleton className="h-10 w-36 rounded-xl bg-[#D1FAE5]/70" />
            <Skeleton className="h-10 w-40 rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-28 rounded-md" />
                  <Skeleton className="h-7 w-32 rounded-md" />
                </div>
                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>
              <Skeleton className="h-3 w-40 rounded-md" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 space-y-4 xl:col-span-2">
            <Skeleton className="h-5 w-44 rounded-md" />
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 space-y-3">
            <Skeleton className="h-5 w-40 rounded-md" />
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error || "Impossible de charger les statistiques."}
      </div>
    );
  }

  const kpis = [
    {
      label: "Chiffre d'affaires",
      value: formatXof(stats.totalRevenueXof),
      sub: `${stats.totalOrders} commande(s) au total`,
      icon: TrendingUp,
      accent: "bg-[#ECFDF5] text-[#059669]"
    },
    {
      label: "Commandes en attente",
      value: String(stats.pendingOrders),
      sub: "À confirmer ou préparer",
      icon: ShoppingBag,
      accent: "bg-amber-50 text-amber-600"
    },
    {
      label: "Produits en boutique",
      value: `${stats.publishedProducts} / ${stats.totalProducts}`,
      sub: `${stats.newProducts} nouveauté(s) · ${stats.promoProducts} promo(s)`,
      icon: Package,
      accent: "bg-blue-50 text-blue-600"
    },
    {
      label: "Clients inscrits",
      value: String(stats.totalCustomers),
      sub: "Comptes clients actifs",
      icon: Users,
      accent: "bg-purple-50 text-purple-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Vue d&apos;ensemble</h1>
          <p className="text-sm text-[#64748B]">
            Suivez vos ventes, commandes et catalogue en temps réel.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/products?create=1"
            className="inline-flex items-center gap-2 rounded-xl bg-[#059669] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#047857]"
          >
            <PackagePlus className="h-4 w-4" />
            <span>Nouveau produit</span>
          </Link>
          <Link
            href="/admin/categories?create=1"
            className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-semibold text-[#0F172A] transition-colors hover:bg-[#F1F5F9]"
          >
            <FolderPlus className="h-4 w-4 text-[#059669]" />
            <span>Nouvelle catégorie</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                    {kpi.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-[#0F172A]">
                    {kpi.value}
                  </p>
                </div>
                <span className={`rounded-xl p-2.5 ${kpi.accent}`}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-3 text-xs text-[#64748B]">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Links for New Arrivals & Promos */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link
          href="/admin/products?filter=new"
          className="flex items-center justify-between rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm transition-colors hover:border-[#059669]"
        >
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-[#ECFDF5] p-2.5 text-[#059669]">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">
                Gérer les Nouveautés
              </p>
              <p className="text-xs text-[#64748B]">
                {stats.newProducts} produit(s) marqué(s) comme nouveau
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-[#64748B]" />
        </Link>

        <Link
          href="/admin/products?filter=promo"
          className="flex items-center justify-between rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm transition-colors hover:border-[#059669]"
        >
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
              <Tag className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">
                Gérer les Promotions
              </p>
              <p className="text-xs text-[#64748B]">
                {stats.promoProducts} produit(s) en promotion
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-[#64748B]" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent Orders */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0F172A]">
              Dernières commandes
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-[#059669] hover:underline"
            >
              Tout voir
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#64748B]">
              Aucune commande enregistrée pour le moment.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-xs uppercase text-[#64748B]">
                    <th className="pb-3 font-semibold">Client</th>
                    <th className="pb-3 font-semibold">Ville</th>
                    <th className="pb-3 font-semibold">Statut</th>
                    <th className="pb-3 text-right font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {stats.recentOrders.map((order) => {
                    const meta = ORDER_STATUS_META[order.status];
                    return (
                      <tr key={order.id} className="hover:bg-[#F8FAFC]">
                        <td className="py-3">
                          <p className="font-medium text-[#0F172A]">
                            {order.customerName}
                          </p>
                          <p className="text-xs text-[#64748B]">
                            {order.phone} · {order.itemsCount} article(s)
                          </p>
                        </td>
                        <td className="py-3 text-[#64748B]">{order.city}</td>
                        <td className="py-3">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${meta.badgeClass}`}
                          >
                            {meta.label}
                          </span>
                        </td>
                        <td className="py-3 text-right font-semibold text-[#0F172A]">
                          {formatXof(order.totalXof)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-bold text-[#0F172A]">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span>Alertes stock faible</span>
            </h2>
            <Link
              href="/admin/products?filter=low-stock"
              className="text-xs font-semibold text-[#059669] hover:underline"
            >
              Gérer
            </Link>
          </div>

          {stats.lowStockProducts.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#64748B]">
              Tous vos produits ont un stock suffisant.
            </p>
          ) : (
            <div className="space-y-3">
              {stats.lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-xl border border-[#F1F5F9] bg-[#F8FAFC] p-3"
                >
                  <div className="min-w-0 pr-3">
                    <p className="truncate text-sm font-medium text-[#0F172A]">
                      {product.title}
                    </p>
                    <p className="text-xs text-[#64748B]">
                      {formatXof(product.priceXof)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      product.stock === 0
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {product.stock === 0 ? "Rupture" : `${product.stock} restant(s)`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
