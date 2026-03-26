import type {
  ICommonResponse,
  IGetAllInterviewsResponse,
  ISuccessResponse,
} from '@/types/response.types';
import { coderspaceBackend } from '../instance';
import { API_ROUTES } from '../apiRoutes';
import type { IInterviewData } from '@/types/types';

export async function getAllInterviewsAdmin(params: {
  page: number;
  search: string;
  limit: string;
}): Promise<ISuccessResponse<IGetAllInterviewsResponse>> {
  const res = await coderspaceBackend.get(API_ROUTES.GET_ALL_INTERVIEWS, { params });
  return res.data;
}

export async function createInterview<T>(data: T): Promise<ISuccessResponse<IInterviewData>> {
  const res = await coderspaceBackend.post(API_ROUTES.CREATE_INTERVIEW, data);

  return res.data;
}

export async function deleteInterview(id: string): Promise<ICommonResponse> {
  const res = await coderspaceBackend.delete(API_ROUTES.DELETE_INTERVIEW(id));
  return res.data;
}
