import type {
  ICommonResponse,
  IGetAllContest,
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


export async function updateCompany<T>(data:T):Promise<ICommonResponse>{
   
     try {
      const res = await coderspaceBackend.patch(API_ROUTES.UPDATE_COMPANY,data)
      return res.data
     } catch (error) {
      throw error
     }
} 


export async function createContest<T>(data:T):Promise<ICommonResponse> {
 
  try {
    const res = await coderspaceBackend.post(API_ROUTES.CREATE_CONTEST_BY_COMPANY,data)
    return res.data
  } catch (error) { 
     throw error
    
  }
}


export async function getAllCreatedContestsOfCompany(search:string,page:string):Promise<ISuccessResponse<IGetAllContest>> {
 
  try {
    const res = await coderspaceBackend.get(API_ROUTES.GET_ALL_CONTEST_CREATED_BY_COMPANY(search,page))
    return res.data
  } catch (error) { 
     throw error
    
  }
}
