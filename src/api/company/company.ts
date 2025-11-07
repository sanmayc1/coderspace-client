import type {
  IGetCompanyResponse,
  ISuccessResponse,
} from "@/types/response.types";
import { API_ROUTES } from "../apiRoutes";
import { coderspaceBackend } from "../instance";
import type { AxiosResponse } from "axios";

export const getComapny = async (): Promise<IGetCompanyResponse> => {
  const res: AxiosResponse<ISuccessResponse<IGetCompanyResponse>> =
    await coderspaceBackend.get(API_ROUTES.GET_COMPANY);
  return res.data.data;
};
