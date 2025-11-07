import { string, z } from "zod";
import { mongoDbIdRegex } from "../regex";

export const exampleSchema = z.object({
  id: z.string().optional(),
  input: z.string().min(1, { message: "input required" }),
  output: z.string().min(1, { message: "output required" }),
  explanation: z.string().min(1, { message: "explanation required" }),
});

export const skillsSchema = z.object({
  id: z.string().regex(mongoDbIdRegex, "invalid skill"),
  title: string(),
});

export const createProblemSchema = z.object({
  title: z.string().min(1, { message: "title required" }),
  description: z.string().min(1, { message: "description required" }),
  difficulty: z.string().min(1, { message: "difficulty required" }),
  domain: z.string().min(1, { message: "domain required" }),
  constrain: z.string().min(1, { message: "constrain required" }),
  premium: z.boolean("premium required"),
  skills: z
    .array(skillsSchema)
    .min(1, { message: "at least one skill required" }),
  examples: z
    .array(exampleSchema)
    .min(1, { message: "at least one example required" }),
});
