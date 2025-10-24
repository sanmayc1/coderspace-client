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
  btnDisable?: boolean;
}

export interface OtpProps {
  onSubmit: (otp: string) => Promise<void>;
}

export interface IAuthRequireProps {
  role: string;
  children: React.ReactNode;
}

interface ISelectTagOptions {
  value: string;
  label: string;
}

export interface ISelectTagProps {
  placeholder: string;
  label: string;
  options: ISelectTagOptions[];
  name:string
  handleChange:(value:string)=>void
  value:string
  head?:string
}

export interface ILoadingSkeletonWraper {
  isLoading: boolean;
  children: React.ReactNode;
  Skeleton: React.ComponentType;
}

export interface IPaginationProps {
  totalPages: number;
  currentPage: number;
  className?:string
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export interface IInputProps {
  label?:string,
  name:string,
  placeholder:string,
  value:string | number
  type?:string
  className?:string
  handleChange:(e:React.ChangeEvent<HTMLInputElement>)=>void,
  error?:string
} 

export interface ITextAreaProps {
  label?:string,
  name:string,
  placeholder:string,
  value:string | number
  className?:string
  handleChange:(e:React.ChangeEvent<HTMLTextAreaElement>)=>void,
  error?:string
}