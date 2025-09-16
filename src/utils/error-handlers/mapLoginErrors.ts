import type { AxiosError } from "axios";
import type z from "zod";

export function mapLoginErrors<T>(
  axiosError: AxiosError<any>,
  setErrors: React.Dispatch<
    React.SetStateAction<Partial<Record<keyof z.core.output<T>, string>>>
  >
) {
  if (
    (axiosError.status === 400 &&
      axiosError.response?.data?.message === "Invalid credentials") ||
    (axiosError.status === 403 &&
      axiosError.response?.data?.message === "Login access denied")
  ) {
    const newError: Partial<Record<keyof z.infer<T>, string>> = {};
    newError["password" as keyof z.infer<T>] =
      axiosError.response?.data?.errors[0]?.message;
    newError["email" as keyof z.infer<T>] = " ";
    setErrors(newError);
  } else if (
    axiosError.status === 400 &&
    axiosError.response?.data?.message === "Validation error occurred"
  ) {
    let newError: Partial<Record<keyof z.infer<T>, string>> = {};
    axiosError.response?.data?.errors.forEach((err: Record<string, string>) => {
      newError[err?.path as keyof z.infer<T>] = err?.message;
    });
    setErrors(newError);
  }
}
