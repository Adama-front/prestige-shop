import { z } from "zod";

const orderSchema = z.object({
  id: z.string().min(1),
  status: z.string(),
  items: z.array(z.object({
    productId: z.string().nullable(),
    title: z.string(),
    imageUrl: z.string().url(),
    unitPriceXof: z.number().int().nonnegative(),
    quantity: z.number().int().positive(),
    lineTotalXof: z.number().int().nonnegative()
  })),
  deliveryAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
    secondaryPhone: z.string().nullable(),
    city: z.string(),
    district: z.string(),
    address: z.string(),
    additionalInfo: z.string().nullable()
  }),
  subtotalXof: z.number().int().nonnegative(),
  shippingCostXof: z.number().int().nonnegative(),
  totalXof: z.number().int().nonnegative(),
  paymentMethod: z.literal("cash_on_delivery"),
  createdAt: z.string().datetime()
});

export type OrderDto = z.infer<typeof orderSchema>;

const responseSchema = z.object({ data: orderSchema });

const errorMessage = (payload: unknown) => {
  if (
    typeof payload === "object" && payload !== null && "error" in payload &&
    typeof payload.error === "object" && payload.error !== null &&
    "message" in payload.error && typeof payload.error.message === "string"
  ) return payload.error.message;
  return "Une erreur est survenue. Réessayez.";
};

const requestOrder = async (response: Response): Promise<OrderDto> => {
  const payload: unknown = await response.json();
  if (!response.ok) throw new Error(errorMessage(payload));
  const parsed = responseSchema.safeParse(payload);
  if (!parsed.success) throw new Error("Le serveur a renvoyé une commande invalide.");
  return parsed.data.data;
};

export const createOrder = async (
  input: {
    items: Array<{ productId: number; quantity: number }>;
    deliveryAddress: {
      firstName: string;
      lastName: string;
      phone: string;
      secondaryPhone: string | null;
      city: string;
      district: string;
      address: string;
      additionalInfo: string | null;
    };
    paymentMethod: "cash_on_delivery";
  },
  idempotencyKey: string
) => {
  let response: Response;
  try {
    response = await fetch("/api/v1/orders", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey
      },
      body: JSON.stringify(input)
    });
  } catch {
    throw new Error("Impossible de joindre le serveur. Votre panier est conservé.");
  }
  return requestOrder(response);
};

export const getOrder = async (orderId: string) => {
  let response: Response;
  try {
    response = await fetch(`/api/v1/orders/${encodeURIComponent(orderId)}`, {
      credentials: "same-origin",
      cache: "no-store"
    });
  } catch {
    throw new Error("Impossible de joindre le serveur. Réessayez.");
  }
  return requestOrder(response);
};
