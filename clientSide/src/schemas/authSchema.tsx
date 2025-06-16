import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z
    .string()
    .min(8, "Minimal 8 karakter")
    .refine((val) => /[A-Z]/.test(val), {
      message: "Uppercase",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Lowercase",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "Number",
    })
    .refine((val) => /[^A-Za-z0-9]/.test(val), {
      message: "Symbol",
    }),
});
