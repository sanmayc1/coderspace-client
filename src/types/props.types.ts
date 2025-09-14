import type { z, ZodObject } from "zod";

export interface ISectionProps {
  reverse?: boolean;
  head: string;
  description: string;
  exploreUrl: string;
  bannerUrl: string;
}

export interface FieldConfig {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
}

export interface CustomFormProps<T extends ZodObject<any>> {
  fields: FieldConfig[];
  zodSchema: T;
  onSubmit: (
    values: z.infer<T>,
    setErrors: React.Dispatch<
      React.SetStateAction<Partial<Record<keyof z.core.output<T>, string>>>
    >
  ) => void;
  gap?: string;
  btnName: string | React.ReactNode;
  error?: Record<string, string>;
  btnDisable?:boolean
}

export interface OtpProps {
  onSubmit: (otp: string) => Promise<void>;
}
