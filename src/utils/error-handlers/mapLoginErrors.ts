import type { ILoginResponse } from "@/types/types";
import type z from "zod";

export function mapLoginErrors<T>(
  error: ILoginResponse,
  statusCode: number,
  setErrors: React.Dispatch<
    React.SetStateAction<Partial<Record<keyof z.core.output<T>, string>>>
  >
) {
  if (
    (statusCode === 400 && error.message === "Invalid credentials") ||
    (statusCode === 403 && error.message === "Login access denied") ||
    (statusCode === 403 && error.message === "Account blocked contact support")
  ) {
    const newError: Partial<Record<keyof z.infer<T>, string>> = {};
    newError["password" as keyof z.infer<T>] = error.errors[0]?.message;
    newError["email" as keyof z.infer<T>] = " ";
    setErrors(newError);
  } else if (
    statusCode === 400 &&
    error.message === "Validation error occurred"
  ) {
    let newError: Partial<Record<keyof z.infer<T>, string>> = {};
    error.errors.forEach((err: Record<string, string>) => {
      newError[err?.path as keyof z.infer<T>] = err?.message;
    });
    setErrors(newError);
  }
}
