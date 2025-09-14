import type { AxiosResponse } from "axios";
import { coderspaceBackend } from "../instance";

// register user
export async function userSignup<T>(
  data: T
): Promise<AxiosResponse<any> | void> {
  try {
    const res: AxiosResponse<any> = await coderspaceBackend.post(
      "/auth/signup",
      data
    );
    return res;
  } catch (error) {
    throw error;
  }
}

// Send otp
export async function sendOtp(): Promise<AxiosResponse<any> | void> {
  try {
    const res: AxiosResponse<any> = await coderspaceBackend.post("/auth/otp");
    return res;
  } catch (error) {
    throw error;
  }
}

// Verify Otp

export async function verifyOtp(
  data: string
): Promise<AxiosResponse<any> | void> {
  try {
    const res: AxiosResponse<any> = await coderspaceBackend.patch(
      "/auth/verify",
      { otp: data }
    );

    return res;
  } catch (error) {
    throw error;
  }
}

// user login
export async function userLogin<T>(
  data: T
): Promise<AxiosResponse<any> | void> {
  try {
    const res: AxiosResponse<any> = await coderspaceBackend.post(
      "/auth/login",
      data
    );
    return res;
  } catch (error) {
    throw error;
  }
}

export async function authCheck(): Promise<AxiosResponse<any> | void> {
  try {
    const res: AxiosResponse<any> = await coderspaceBackend.get("/auth/me");
    return res;
  } catch (error) {
    throw error;
  }
}

export async function logout(): Promise<AxiosResponse<any> | void> {
  try {
    const res: AxiosResponse<any> = await coderspaceBackend.post(
      "/auth/logout"
    );
    return res;
  } catch (error) {
    throw error;
  }
}

export async function forgetPassword<T>(data: T) {
  try {
    const res: AxiosResponse<any> = await coderspaceBackend.post(
      "/auth/password/forget",
      data
    );
    return res;
  } catch (error) {
    throw error;
  }
}

export async function resetPassword<T>(data: T) {
  try {
    const res: AxiosResponse<any> = await coderspaceBackend.patch(
      "/auth/password/reset",
      data
    );
    return res;
  } catch (error) {
    throw error;
  }
}

export async function commonLogin<T>(
  data: T
): Promise<AxiosResponse<any> | void> {
  try {
    const res: AxiosResponse<any> = await coderspaceBackend.post(
      "auth/common/login",
      data
    );
    return res;
  } catch (error) {
    throw error;
  }
}
