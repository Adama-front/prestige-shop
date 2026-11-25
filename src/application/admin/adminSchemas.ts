import { z } from "zod";

export const adminProductSchema = z.object({
  title: z.string().trim().min(2, "Le titre doit contenir au moins 2 caractères.").max(180),
  description: z.string().trim().min(5, "La description doit contenir au moins 5 caractères.").max(4000),
  imageUrl: z.string().trim().url("L'URL de l'image est invalide."),
  categoryId: z.coerce.number().int().positive("Veuillez sélectionner une catégorie."),
  priceXof: z.coerce.number().int().nonnegative("Le prix doit être positif ou nul."),
  stock: z.coerce.number().int().nonnegative("Le stock doit être positif ou nul."),
  isPublished: z.boolean().default(false),
  isNew: z.boolean().default(false),
  discountPercent: z.coerce.number().int().min(0).max(95).default(0)
});

export const adminProductPatchSchema = adminProductSchema.partial();

export const adminCategorySchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères.").max(80),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Le slug ne peut contenir que des minuscules, chiffres et tirets.")
    .optional()
});

export const adminOrderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED"
  ])
});

export const adminCreateManagerSchema = z.object({
  username: z.string().trim().min(2, "Minimum 2 caractères.").max(40),
  email: z.string().trim().email("Email invalide.").max(254),
  password: z.string().min(6, "Minimum 6 caractères.").max(128)
});

export const adminUpdateUserRoleSchema = z.object({
  role: z.enum(["CUSTOMER", "ADMIN"])
});

export const adminSettingsSchema = z.object({
  storeName: z.string().trim().min(2).max(80),
  supportEmail: z.string().trim().email().max(254),
  supportPhone: z.string().trim().min(4).max(40),
  defaultShippingCostXof: z.coerce.number().int().nonnegative(),
  maintenanceMode: z.boolean(),
  maintenanceMessage: z.string().trim().min(5).max(500)
});
