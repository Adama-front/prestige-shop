import { z } from "zod";

export const registerRequestSchema = z.object({
  username: z.string().trim().min(1).max(40),
  email: z.string().trim().email().max(254),
  password: z.string().min(6).max(128)
});

export const loginRequestSchema = z.object({
  username: z.string().trim().min(1).max(254),
  password: z.string().min(1).max(128)
});

export type PublicUser = {
  id: string;
  username: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  createdAt: string;
};
