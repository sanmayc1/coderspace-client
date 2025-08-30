import z from "zod";
import {
  strongEmailRegex,
  usernameRegex1,
  usernameRegex2,
  usernameRegex3,
} from "../regex";

export const nameSchema = z
  .string()
  .min(1, { message: "Name must be at least 2 characters long" })
  .trim()
  .regex(/^[a-zA-Z]+$/, {
    message: "Name must contain only alphabetic characters",
  });

export const usernameSchema = z
  .string()
  .lowercase({ message: "Username must be in lowercase only" })
  .trim()
  .regex(usernameRegex1, { message: "Username must start with @" })
  .regex(usernameRegex2, {
    message: "Username can only lowercase contain letters, numbers, and _",
  })
  .regex(usernameRegex3, {
    message: "Username must be at least 4 characters long",
  });

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .trim()
  .regex(/[0-9]/, { message: "Password must contain at least one digit" })
  .regex(/[@$!%*?&]/, {
    message: "Password must contain at least one special character",
  });

export const RegistreSchema = z
  .object({
    name: nameSchema,
    email: z
      .string()
      .regex(strongEmailRegex, { message: "Invalid email format" }),
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Password do not match",
        path: ["confirmPassword"],
      });
    }
  });

export const LoginShema = z.object({
  email: z
    .string()
    .regex(strongEmailRegex, { message: "Invalid email format" }),
  password: z.string().trim().min(1, { message: "Enter Password" }),
});
