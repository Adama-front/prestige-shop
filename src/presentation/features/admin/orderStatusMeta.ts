import type { OrderStatus } from "@/generated/prisma/client";

export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; badgeClass: string }
> = {
  PENDING: {
    label: "En attente",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200"
  },
  CONFIRMED: {
    label: "Confirmée",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200"
  },
  PROCESSING: {
    label: "En préparation",
    badgeClass: "bg-indigo-100 text-indigo-800 border-indigo-200"
  },
  SHIPPED: {
    label: "Expédiée",
    badgeClass: "bg-purple-100 text-purple-800 border-purple-200"
  },
  DELIVERED: {
    label: "Livrée",
    badgeClass: "bg-[#D1FAE5] text-[#047857] border-[#A7F3D0]"
  },
  CANCELLED: {
    label: "Annulée",
    badgeClass: "bg-red-100 text-red-700 border-red-200"
  }
};

export const ORDER_STATUS_OPTIONS: Array<{ value: OrderStatus; label: string }> = [
  { value: "PENDING", label: "En attente" },
  { value: "CONFIRMED", label: "Confirmée" },
  { value: "PROCESSING", label: "En préparation" },
  { value: "SHIPPED", label: "Expédiée" },
  { value: "DELIVERED", label: "Livrée" },
  { value: "CANCELLED", label: "Annulée" }
];
