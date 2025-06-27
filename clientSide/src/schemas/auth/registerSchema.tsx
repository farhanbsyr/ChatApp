import { z } from "zod";

export const registerSchema = z.object({
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
  nomor: z
    .string()
    .min(10, "Number is too short")
    .max(13, "Number is too long")
    .refine((val) => /^08[1-9][0-9]{7,10}$/.test(val), {
      message: "Number must start with 08 and be valid",
    }),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .refine((val) => /^[A-Za-z]/.test(val), {
      message: "Username cannot start with a number or space",
    })
    .refine((val) => /^[A-Za-z0-9]+$/.test(val), {
      message: "Username cannot contain symbols or special characters",
    }),
});
