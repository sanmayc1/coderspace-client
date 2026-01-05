import z from 'zod';
import { strongEmailRegex } from '../regex';
import { nameSchema, passwordSchema } from './user-validation';

export const CompanyRegistreSchema = z
  .object({
    companyName: nameSchema,
    email: z.string().trim().regex(strongEmailRegex, { message: 'Invalid email format' }),
    gstin: z
      .string()
      .trim()
      .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, {
        message: 'Invalid GSTIN',
      }),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Password do not match',
        path: ['confirmPassword'],
      });
    }
  });

export const createContestSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  dateAndTime: z
    .string()
    .min(1, 'Date and time is required')
    .refine(
      (v) =>
        !isNaN(Date.parse(v)) &&
        new Date(v) >= new Date(new Date().toISOString().slice(0, 16).replace('T', ' ') + ':00'),
      'Date and time must be in the future'
    ),
  duration: z.string().refine((v) => !isNaN(Number(v)) && Number(v) > 0, {
    message: 'Duration must be a positive number',
  }),
  visibility: z.string().refine((v) => v === 'public' || v === 'private', 'Visibility required'),
  domain: z.string().min(1, 'Domain required'),
  // premium optional
  skills: z
    .array(z.object({ id: z.string(), title: z.string() }))
    .min(1, 'At least one skill required'),
  problems: z
    .array(z.object({ id: z.string(), title: z.string() }))
    .min(1, 'At least one problem is required'),
  rewards: z
    .array(
      z.object({
        rank: z.union([z.string().min(1), z.number().min(1)]),
        description: z.string().min(1, 'Description is required'),
      })
    )
    .min(1, 'At least one reward is required'),
});
