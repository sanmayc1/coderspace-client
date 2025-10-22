import type { AxiosResponse } from "axios";
import { coderspaceBackend } from "../instance";
import { API_ROUTES } from "../apiRoutes";



export async function getUser(): Promise<AxiosResponse<any>> {
  try {
    const res: AxiosResponse<any> = await coderspaceBackend.get(API_ROUTES.GET_USER_PROFILE);
    return res;
  } catch (error) {
    throw error;
  }
}

export async function updateSuggestionLevel<T>(data:T): Promise<AxiosResponse<{success:boolean,message:string}>> {
  try {
    const res: AxiosResponse<any> = await coderspaceBackend.patch(API_ROUTES.UPDATE_USER_SUGGESTION_LEVEL,data);
    return res;
  } catch (error) {
    throw error;
  }
}