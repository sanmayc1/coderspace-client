import type { CustomFormProps } from '@/types/props.types';
import { useState } from 'react';
import type { z, ZodObject } from 'zod';
import { Button } from '../ui/button';
import { Eye, EyeOff, Info } from 'lucide-react';

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
    acc[field.name as keyof FormValues] = '' as any;
    return acc;
  }, {} as Partial<FormValues>);

  const [formValues, setFormValues] = useState<Partial<FormValues>>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPassword((prev) => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  if (error) {
    setErrors(error as Partial<Record<keyof FormValues, string>>);
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    const fieldValue = type === 'file' ? (files ? files[0] : undefined) : value;
    setFormValues((prev) => ({ ...prev, [name]: fieldValue }));
    const result = zodSchema.safeParse({ ...formValues, [name]: fieldValue });

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
      className={`font-[anybody-regular] flex flex-col ${gap ? `gap-${gap}` : 'gap-3'} rounded-xl`}
    >
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          {field.label && (
            <label htmlFor={field.name} className="text-gray-700 pl-1 text-sm">
              {field.label}
            </label>
          )}

          <div className="relative w-full">
            <input
              id={field.name}
              name={field.name}
              type={field.type === 'password' && showPassword[field.name] ? 'text' : (field.type || 'text')}
              placeholder={field.placeholder}
              {...(field.type !== 'file' ? { value: (formValues[field.name as keyof FormValues] as string) || '' } : { accept: 'image/jpeg, image/png, image/jpg' })}
              onChange={handleChange}
              className={`w-full border-1 p-2 rounded-md text-sm ${field.type === 'password' ? 'pr-10' : ''} ${
                errors[field.name as keyof FormValues]
                  ? 'outline-red-600 border-red-300'
                  : 'outline-gray-200'
              }`}
            />
            {field.type === 'password' && (
              <button
                type="button"
                onClick={() => togglePasswordVisibility(field.name)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword[field.name] ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
          </div>
          
          {field.instructions && errors[field.name as keyof FormValues] && (
            <div className="flex items-start gap-1 mt-1 pl-1 text-red-400">
              <Info size={12} className="mt-[2px] shrink-0" />
              <p className="text-[10px] leading-tight">{field.instructions}</p>
            </div>
          )}

          {field.instructions && !errors[field.name as keyof FormValues] && !formValues[field.name as keyof FormValues] && (
            <div className="flex items-start gap-1 mt-1 pl-1 text-gray-500">
              <Info size={12} className="mt-[2px] shrink-0" />
              <p className="text-[10px] leading-tight">{field.instructions}</p>
            </div>
          )}

          {!field.instructions && errors[field.name as keyof FormValues] && (
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
