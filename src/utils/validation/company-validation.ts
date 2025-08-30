import z from "zod";
import { strongEmailRegex } from "../regex";
import { nameSchema, passwordSchema} from "./user-validation";

export const CompanyRegistreSchema = z
  .object({
    companyName: nameSchema,
    email: z
      .string()
      .regex(strongEmailRegex, { message: "Invalid email format" }),
    gstin: z.string().min(5, { message: "Invalid GSTIN" }),
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
