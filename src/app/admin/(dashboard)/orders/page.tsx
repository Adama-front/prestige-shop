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
import {
  ORDER_STATUS_META,
  ORDER_STATUS_OPTIONS
} from "@/presentation/features/admin/orderStatusMeta";
import type { OrderStatus } from "@/generated/prisma/client";
import { Eye, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface AdminOrderItem {
  id: string;
  productId: number | null;
  productTitle: string;
  imageUrl: string;
  unitPriceXof: number;
  quantity: number;
  lineTotalXof: number;
}

interface AdminOrder {
  id: string;
  status: OrderStatus;
  paymentMethod: string;
  firstName: string;
  lastName: string;
  phone: string;
  secondaryPhone: string | null;
  city: string;
  district: string;
  address: string;
  additionalInfo: string | null;
  subtotalXof: number;
  shippingCostXof: number;
  totalXof: number;
  createdAt: string;
  user: { id: string; username: string; email: string };
  items: AdminOrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [query, setQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (query.trim()) params.set("q", query.trim());

      const res = await fetch(`/api/v1/admin/orders?${params.toString()}`, {
        cache: "no-store"
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || "Erreur serveur");
      setOrders(json.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, query]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadOrders();
    }, 200);
    return () => clearTimeout(timer);
  }, [loadOrders]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/v1/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || "Erreur");

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, status: newStatus } : null
        );
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Impossible de mettre à jour.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Suivi des commandes</h1>
        <p className="text-sm text-[#64748B]">
          Consultez les détails de livraison et mettez à jour l&apos;avancement des commandes.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setStatusFilter("ALL")}
            className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              statusFilter === "ALL"
                ? "bg-[#10B981] text-[#0F172A]"
                : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]"
            }`}
          >
            Toutes
          </button>
          {ORDER_STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStatusFilter(opt.value)}
              className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === opt.value
                  ? "bg-[#10B981] text-[#0F172A]"
                  : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par client, téléphone, ville ou ID..."
            className="w-full rounded-xl border border-[#E2E8F0] py-2 pl-9 pr-3 text-sm focus:border-[#059669] focus:outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-5" role="status" aria-label="Chargement des commandes">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="flex items-center justify-between gap-4 rounded-xl border border-[#F1F5F9] p-3">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-3 w-20 rounded-md" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-36 rounded-md" />
                  <Skeleton className="h-3 w-24 rounded-md" />
                </div>
                <Skeleton className="hidden h-4 w-24 rounded-md sm:block" />
                <Skeleton className="h-7 w-28 rounded-full" />
                <Skeleton className="h-8 w-16 rounded-xl" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#64748B]">
            Aucune commande trouvée.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs uppercase text-[#64748B]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Référence</th>
                  <th className="px-4 py-3 font-semibold">Client</th>
                  <th className="px-4 py-3 font-semibold">Livraison</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Statut</th>
                  <th className="px-4 py-3 text-right font-semibold">Détails</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {orders.map((order) => {
                  const meta = ORDER_STATUS_META[order.status];
                  return (
                    <tr key={order.id} className="hover:bg-[#F8FAFC]">
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs font-semibold text-[#0F172A]">
                          {order.id.slice(0, 10)}…
                        </p>
                        <p className="text-xs text-[#64748B]">
                          {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#0F172A]">
                          {order.firstName} {order.lastName}
                        </p>
                        <p className="text-xs text-[#64748B]">{order.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#64748B]">
                        <p className="font-medium text-[#0F172A]">
                          {order.city}, {order.district}
                        </p>
                        <p className="max-w-[200px] truncate">{order.address}</p>
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#0F172A]">
                        {formatXof(order.totalXof)}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) =>
                            handleStatusChange(
                              order.id,
                              e.target.value as OrderStatus
                            )
                          }
                          aria-label={`Statut de la commande ${order.id}`}
                          className={`rounded-xl border px-2.5 py-1 text-xs font-semibold focus:outline-none ${meta.badgeClass}`}
                        >
                          {ORDER_STATUS_OPTIONS.map((opt) => (
                            <option
                              key={opt.value}
                              value={opt.value}
                              className="bg-white text-[#0F172A]"
                            >
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-[#E2E8F0] px-3 py-1.5 text-xs font-semibold text-[#0F172A] hover:bg-[#F1F5F9]"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Voir</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Drawer */}
      <Drawer
        open={Boolean(selectedOrder)}
        onOpenChange={(open) => {
          if (!open) setSelectedOrder(null);
        }}
      >
        <DrawerContent>
          {selectedOrder && (
            <div className="mx-auto w-full max-w-2xl overflow-y-auto">
              <DrawerHeader>
                <DrawerTitle>Commande #{selectedOrder.id}</DrawerTitle>
                <DrawerDescription>
                  Passée le {new Date(selectedOrder.createdAt).toLocaleString("fr-FR")}
                </DrawerDescription>
              </DrawerHeader>

              <div className="space-y-5 px-6 py-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-[#F8FAFC] p-4">
                    <h3 className="text-xs font-semibold uppercase text-[#64748B]">
                      Client &amp; Contact
                    </h3>
                    <p className="mt-2 text-sm font-semibold text-[#0F172A]">
                      {selectedOrder.firstName} {selectedOrder.lastName}
                    </p>
                    <p className="text-xs text-[#64748B]">
                      Tél : {selectedOrder.phone}
                    </p>
                    {selectedOrder.secondaryPhone && (
                      <p className="text-xs text-[#64748B]">
                        Tél 2 : {selectedOrder.secondaryPhone}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-[#64748B]">
                      Compte : {selectedOrder.user.username} ({selectedOrder.user.email})
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F8FAFC] p-4">
                    <h3 className="text-xs font-semibold uppercase text-[#64748B]">
                      Adresse de livraison
                    </h3>
                    <p className="mt-2 text-sm font-semibold text-[#0F172A]">
                      {selectedOrder.city} — {selectedOrder.district}
                    </p>
                    <p className="text-xs text-[#64748B]">{selectedOrder.address}</p>
                    {selectedOrder.additionalInfo && (
                      <p className="mt-1 text-xs italic text-[#64748B]">
                        Note : {selectedOrder.additionalInfo}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase text-[#64748B]">
                    Articles commandés
                  </h3>
                  <div className="divide-y divide-[#F1F5F9] rounded-xl border border-[#E2E8F0]">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 p-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-[#0F172A]">
                            {item.productTitle}
                          </p>
                          <p className="text-xs text-[#64748B]">
                            {item.quantity} × {formatXof(item.unitPriceXof)}
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-semibold text-[#0F172A]">
                          {formatXof(item.lineTotalXof)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 border-t border-[#E2E8F0] pt-4 text-sm">
                  <div className="flex justify-between text-[#64748B]">
                    <span>Sous-total</span>
                    <span>{formatXof(selectedOrder.subtotalXof)}</span>
                  </div>
                  <div className="flex justify-between text-[#64748B]">
                    <span>Livraison</span>
                    <span>{formatXof(selectedOrder.shippingCostXof)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#0F172A]">
                    <span>Total (Paiement à la livraison)</span>
                    <span className="text-[#059669]">
                      {formatXof(selectedOrder.totalXof)}
                    </span>
                  </div>
                </div>
              </div>

              <DrawerFooter>
                <DrawerClose asChild>
                  <button
                    type="button"
                    className="cursor-pointer rounded-xl border border-[#E2E8F0] px-4 py-2 text-sm font-semibold text-[#0F172A] hover:bg-[#F1F5F9]"
                  >
                    Fermer
                  </button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
