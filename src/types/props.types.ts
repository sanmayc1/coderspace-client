
import type {
  z,
  ZodObject,
} from "zod";

export interface ISectionProps {
  reverse?: boolean;
  head: string;
  description: string;
  exploreUrl: string;
  bannerUrl: string;
}

export interface  FieldConfig  {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
};

export interface CustomFormProps<T extends ZodObject<any>> {
  fields: FieldConfig[];
  zodSchema: T;
  onSubmit: (values: z.infer<T>) => void;
  gap?:string,
  btnName:string
}
