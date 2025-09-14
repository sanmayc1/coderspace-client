import z from "zod";
import { strongEmailRegex } from "../regex";
import { nameSchema, passwordSchema } from "./user-validation";

export const CompanyRegistreSchema = z
  .object({
    companyName: nameSchema,
    email: z
      .string()
      .trim()
      .regex(strongEmailRegex, { message: "Invalid email format" }),
    gstin: z
      .string()
      .trim()
      .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, {
        message: "Invalid GSTIN",
      }),
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
