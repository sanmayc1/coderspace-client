import type {ICommonResponse, ICreateOrderResponse, IGetAllPlansResponse } from '@/types/response.types';
import { API_ROUTES } from '../apiRoutes';
import { coderspaceBackend } from '../instance';

export async function getAllPlans(): Promise<IGetAllPlansResponse[]> {
  try {
    const response = await coderspaceBackend.get(API_ROUTES.GET_ALL_PLANS);
    return response.data.data;
  } catch (error) {
    throw error;
  }
}


export async function createRazorpayOrder(planId: string):Promise<ICreateOrderResponse> {
  try {
    const response = await coderspaceBackend.post(API_ROUTES.CREATE_ORDER, { planId });
    return response.data.data;
  } catch (error) {
    throw error;
  }
}


export async function verifyRazorpayOrder<T>(data:T):Promise<ICommonResponse> {
  try {
    const response = await coderspaceBackend.post(API_ROUTES.VERIFY_ORDER, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function markPaymentFailed(orderId:string):Promise<ICommonResponse> {
  try {
    const response = await coderspaceBackend.post(API_ROUTES.MARK_PAYMENT_FAILED, {orderId});
    return response.data;
  } catch (error) {
    throw error;
  }
}

