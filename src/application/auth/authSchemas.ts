import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Le nom d'utilisateur est requis").max(254),
  password: z.string().min(1, "Le mot de passe est requis")
});

export const registerSchema = z.object({
  username: z.string().trim().min(1, "Le nom d'utilisateur est requis").max(40),
  email: z
    .string()
    .trim()
    .min(1, "L'email est requis")
    .email("L'adresse email est invalide")
    .max(254),
  password: z
    .string()
    .min(1, "Le mot de passe est requis")
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .max(128, "Le mot de passe ne doit pas dépasser 128 caractères")
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
