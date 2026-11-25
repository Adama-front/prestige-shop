import { z } from "zod";

export const productQuerySchema = z
  .object({
    q: z.string().trim().max(120).optional(),
    category: z.string().trim().min(1).max(80).optional(),
    priceMin: z.coerce.number().int().min(0).optional(),
    priceMax: z.coerce.number().int().min(0).optional(),
    sort: z.enum(["newest", "price_asc", "price_desc"]).default("newest"),
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(100).default(20)
  })
  .superRefine((query, context) => {
    if (
      query.priceMin !== undefined &&
      query.priceMax !== undefined &&
      query.priceMin > query.priceMax
    ) {
      context.addIssue({
        code: "custom",
        path: ["priceMin"],
        message: "Le prix minimum doit être inférieur ou égal au prix maximum."
      });
    }
  });

export type ProductQuery = z.infer<typeof productQuerySchema>;

export const productIdSchema = z.coerce.number().int().positive();
