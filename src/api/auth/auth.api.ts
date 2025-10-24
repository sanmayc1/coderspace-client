import type { AxiosResponse } from "axios";
import { coderspaceBackend } from "../instance";
import { API_ROUTES } from "../apiRoutes";
import type { ICommonResponse } from "@/types/response.types";

// register user
export async function userSignup<T>(
  data: T
): Promise<AxiosResponse<ICommonResponse>> {
  const res: AxiosResponse<ICommonResponse> = await coderspaceBackend.post(
    API_ROUTES.USER_SIGNUP,
    data
  );
  return res;
}

// Send otp
export async function sendOtp(): Promise<AxiosResponse<ICommonResponse>> {
  const res: AxiosResponse<ICommonResponse> = await coderspaceBackend.post(
    API_ROUTES.SEND_OTP
  );
  return res;
}

// Verify Otp

export async function verifyOtp(
  data: string
): Promise<AxiosResponse<ICommonResponse>> {
  const res: AxiosResponse<ICommonResponse> = await coderspaceBackend.patch(
    API_ROUTES.VERIFY_OTP,
    { otp: data }
  );

  return res;
}

export async function logout(): Promise<AxiosResponse<ICommonResponse>> {
  const res: AxiosResponse<ICommonResponse> = await coderspaceBackend.post(
    API_ROUTES.LOGOUT
  );
  return res;
}

export async function forgetPassword<T>(
  data: T
): Promise<AxiosResponse<ICommonResponse>> {
  const res: AxiosResponse<ICommonResponse> = await coderspaceBackend.post(
    API_ROUTES.FORGET_PASSWORD,
    data
  );
  return res;
}

export async function resetPassword<T>(
  data: T
): Promise<AxiosResponse<ICommonResponse>> {
  const res: AxiosResponse<ICommonResponse> = await coderspaceBackend.patch(
    API_ROUTES.REST_PASSWORD,
    data
  );
  return res;
}

// company register

export async function companyRegister<T>(
  data: T
): Promise<AxiosResponse<ICommonResponse>> {
  const res: AxiosResponse<ICommonResponse> = await coderspaceBackend.post(
    API_ROUTES.COMPANY_REGISTER,
    data
  );
  return res;
}
