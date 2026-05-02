import type { IGetAllCompanyResponse, ISuccessResponse } from '@/types/response.types';
import { API_ROUTES } from '../apiRoutes';
import { coderspaceBackend } from '../instance';

interface getAllCompaniesParams {
  page: number;
  limit: string;
  filter: string;
  search: string;
}

export async function getAllCompanies(
  params: getAllCompaniesParams
): Promise<ISuccessResponse<IGetAllCompanyResponse>> {
  const res = await coderspaceBackend.get(
    API_ROUTES.GET_ALL_COMPANIES(params.page, params.limit, params.search, params.filter)
  );
  return res.data;
}

export async function verifyCompany(
  id: string
): Promise<ISuccessResponse<null>> {
  const res = await coderspaceBackend.patch(
    API_ROUTES.VERIFY_COMPANY(id)
  );
  return res.data;
}

export async function rejectCompany(
  id: string,
  reason: string
): Promise<ISuccessResponse<null>> {
  const res = await coderspaceBackend.patch(
    API_ROUTES.REJECT_COMPANY(id),
    {reason}
  );
  return res.data;
}
