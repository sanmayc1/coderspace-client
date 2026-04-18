import type {ICommonResponse, ICreateOrderResponse, IGetAllPlansResponse } from '@/types/response.types';
import { API_ROUTES } from '../apiRoutes';
import { coderspaceBackend } from '../instance';

export async function getAllPlans(): Promise<IGetAllPlansResponse[]> {
  
    const response = await coderspaceBackend.get(API_ROUTES.GET_ALL_PLANS);
    return response.data.data;

}


export async function createRazorpayOrder(planId: string):Promise<ICreateOrderResponse> {
  
    const response = await coderspaceBackend.post(API_ROUTES.CREATE_ORDER, { planId });
    return response.data.data;

}


export async function verifyRazorpayOrder<T>(data:T):Promise<ICommonResponse> {
 
    const response = await coderspaceBackend.post(API_ROUTES.VERIFY_ORDER, data);
    return response.data;
 

}

export async function markPaymentFailed(orderId:string):Promise<ICommonResponse> {
  
    const response = await coderspaceBackend.post(API_ROUTES.MARK_PAYMENT_FAILED, {orderId});
    return response.data;

}

