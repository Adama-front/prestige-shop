import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Le nom d'utilisateur est requis"),
  password: z.string().min(1, "Le mot de passe est requis")
});

export const registerSchema = z.object({
  username: z.string().trim().min(1, "Le nom d'utilisateur est requis"),
  email: z
    .string()
    .trim()
    .min(1, "L'email est requis")
    .email("L'adresse email est invalide"),
  password: z
    .string()
    .min(1, "Le mot de passe est requis")
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
