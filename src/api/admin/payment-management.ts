import type {
  ICommonResponse,
  IGetAllPlansResponse,
  ISuccessResponse,
} from '@/types/response.types';
import { coderspaceBackend } from '../instance';
import { API_ROUTES } from '../apiRoutes';
import type { IGetAllPaymentsResponse } from '@/types/dummy-payment.types';

export interface getAllPaymentsParams {
  page: number;
  sort: string;
  search: string;
  limit: string;
}

export async function getAllPlansAdmin(): Promise<IGetAllPlansResponse[]> {
  try {
    const response = await coderspaceBackend.get(API_ROUTES.GET_ALL_PLANS_ADMIN);
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function updatePlanAdmin(planData: IGetAllPlansResponse): Promise<ICommonResponse> {
  try {
    const response = await coderspaceBackend.patch(API_ROUTES.UPDATE_PLAN_ADMIN, planData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getAllPaymentsAdmin(
  params: getAllPaymentsParams
): Promise<ISuccessResponse<IGetAllPaymentsResponse[]>> {
  try {
    const response = await coderspaceBackend.get(
      API_ROUTES.GET_ALL_PAYMENTS_ADMIN(params.page, params.sort, params.search, params.limit)
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
