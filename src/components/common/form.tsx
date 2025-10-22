import type { CustomFormProps } from "@/types/props.types";
import { useState } from "react";
import type { z, ZodObject } from "zod";
import { Button } from "../ui/Button";

function CustomForm<T extends ZodObject<any>>({
  fields,
  zodSchema,
  onSubmit,
  gap,
  btnName,
  error,
  btnDisable = false,
}: CustomFormProps<T>) {
  type FormValues = z.infer<T>;

  const initialValues = fields.reduce((acc, field) => {
    acc[field.name as keyof FormValues] = "" as any;
    return acc;
  }, {} as Partial<FormValues>);

  const [formValues, setFormValues] =
    useState<Partial<FormValues>>(initialValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormValues, string>>
  >({});

  if (error) {
    setErrors(error as Partial<Record<keyof FormValues, string>>);
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    const result = zodSchema.safeParse({ ...formValues, [name]: value });

    if (!result.success) {
      const newErrors: Partial<Record<keyof FormValues, string>> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof FormValues;
        if (field === name && !newErrors[field]) {
          newErrors[field] = err.message;
        }
      });

      if (newErrors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: newErrors[name]!,
        }));
      } else {
        setErrors((prev) => {
          const { [name]: _, ...rest } = prev;
          return rest as Partial<Record<keyof FormValues, string>>;
        });
      }
    } else {
      setErrors((prev) => {
        const { [name]: _, ...rest } = prev;
        return rest as Partial<Record<keyof FormValues, string>>;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = zodSchema.safeParse(formValues);

    if (!result.success) {
      const newErrors: Partial<Record<keyof FormValues, string>> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof FormValues;
        if (newErrors[field]) return;
        newErrors[field] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit(formValues as FormValues, setErrors);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`font-[anybody-regular] flex flex-col ${
        gap ? `gap-${gap}` : "gap-3"
      } rounded-xl`}
    >
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          {field.label && (
            <label htmlFor={field.name} className="text-gray-700 pl-1 text-sm">
              {field.label}
            </label>
          )}

          <input
            id={field.name}
            name={field.name}
            type={field.type || "text"}
            placeholder={field.placeholder}
            value={(formValues[field.name as keyof FormValues] as string) || ""}
            onChange={handleChange}
            className={`border-1 p-2 rounded-md text-sm ${
              errors[field.name as keyof FormValues]
                ? "outline-red-600 border-red-300"
                : "outline-gray-200"  
            }`}
          />

          {errors[field.name as keyof FormValues] && (
            <span className="text-xs pt-1 pl-1 text-red-400">
              {errors[field.name as keyof FormValues]}
            </span>
          )}
        </div>
      ))}

      <Button type="submit" disabled={btnDisable}>
        {btnName}
      </Button>
    </form>
  );
}

export default CustomForm;
