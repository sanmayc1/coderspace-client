import type {
  DashboardDataResponse,
  ICommonResponse,
  IGetAllAvailableProblems,
  IGetAllContest,
  IGetCompanyResponse,
  IGetContestResponse,
  ISuccessResponse,
} from '@/types/response.types';
import { API_ROUTES } from '../apiRoutes';
import { coderspaceBackend } from '../instance';
import type { AxiosResponse } from 'axios';

export const getComapny = async (): Promise<IGetCompanyResponse> => {
  const res: AxiosResponse<ISuccessResponse<IGetCompanyResponse>> = await coderspaceBackend.get(
    API_ROUTES.GET_COMPANY
  );
  return res.data.data;
};

export async function updateCompany<T>(data: T): Promise<ICommonResponse> {
  
    const res = await coderspaceBackend.patch(API_ROUTES.UPDATE_COMPANY, data);
    return res.data;

}

export async function createContest<T>(data: T): Promise<ICommonResponse> {
 
    const res = await coderspaceBackend.post(API_ROUTES.CREATE_CONTEST_BY_COMPANY, data);
    return res.data;

}

export async function getAllCreatedContestsOfCompany(
  search: string,
  page: string,
  limit: string
): Promise<ISuccessResponse<IGetAllContest>> {
 
    const res = await coderspaceBackend.get(
      API_ROUTES.GET_ALL_CONTEST_CREATED_BY_COMPANY(search, page, limit)
    );
    return res.data;

}

export async function getContestById(id: string): Promise<ISuccessResponse<IGetContestResponse>> {
 
    const res = await coderspaceBackend.get(API_ROUTES.GET_CONTEST(id));
    return res.data;

}

export async function updateContest<T>(data: T): Promise<ICommonResponse> {
 
    const res = await coderspaceBackend.patch(API_ROUTES.UPDATE_CONTEST, data);
    return res.data;

}

export async function deleteContest(id: string): Promise<ICommonResponse> {
 
    const res = await coderspaceBackend.delete(API_ROUTES.DELETE_CONTEST(id));
    return res.data;

}

export async function getAllAvailableProblems(): Promise<IGetAllAvailableProblems> {
  
    const res = await coderspaceBackend.get(API_ROUTES.GET_ALL_AVAILABLE_PROBLEMS_COMPANY);
    return res.data.data;
 
}

export async function  getCompanyDashboard():Promise<ISuccessResponse<DashboardDataResponse>> {
  const res = await coderspaceBackend.get(API_ROUTES.GET_COMPANY_DASHBOARD)
  return res.data
}