import type {  AxiosResponse } from "axios";
import { coderspaceBackend } from "../instance";
import { API_ROUTES } from "../apiRoutes";


// register user
export async function userSignup<T>(
  data: T
): Promise<AxiosResponse<any> | void> {
  try {
    const res: AxiosResponse<any> = await coderspaceBackend.post(
      API_ROUTES.USER_SIGNUP,
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
    const res: AxiosResponse<any> = await coderspaceBackend.post(API_ROUTES.SEND_OTP);
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
      API_ROUTES.VERIFY_OTP,
      { otp: data }
    );

    return res;
  } catch (error) {
    throw error;
  }
}


export async function logout(): Promise<AxiosResponse<any> | void> {
  try {
    const res: AxiosResponse<any> = await coderspaceBackend.post(
      API_ROUTES.LOGOUT
    );
    return res;
  } catch (error) {
    throw error;
  }
}

export async function forgetPassword<T>(data: T) {
  try {
    const res: AxiosResponse<any> = await coderspaceBackend.post(
      API_ROUTES.FORGET_PASSWORD ,
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
     API_ROUTES.REST_PASSWORD,
      data
    );
    return res;
  } catch (error) {
    throw error;
  }
}



// company register

export async function companyRegister<T>(
  data: T
): Promise<AxiosResponse<any> | void> {
  try {
    const res: AxiosResponse<any> = await coderspaceBackend.post(
     API_ROUTES.COMPANY_REGISTER,
      data
    );
    return res;
  } catch (error) {
    throw error;
  }
}


