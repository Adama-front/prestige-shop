import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().min(1).max(99)
});

export const createOrderSchema = z
  .object({
    items: z.array(orderItemSchema).min(1).max(50),
    deliveryAddress: z.object({
      firstName: z.string().trim().min(1).max(80),
      lastName: z.string().trim().min(1).max(80),
      phone: z.string().trim().min(7).max(24),
      secondaryPhone: z.string().trim().max(24).nullable().optional(),
      city: z.string().trim().min(1).max(100),
      district: z.string().trim().min(1).max(100),
      address: z.string().trim().min(1).max(200),
      additionalInfo: z.string().trim().max(500).nullable().optional()
    }),
    paymentMethod: z.literal("cash_on_delivery")
  })
  .superRefine(({ items }, context) => {
    const productIds = items.map(({ productId }) => productId);
    if (new Set(productIds).size !== productIds.length) {
      context.addIssue({
        code: "custom",
        path: ["items"],
        message: "Un produit ne peut apparaître qu’une fois dans la commande."
      });
    }
  });

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
