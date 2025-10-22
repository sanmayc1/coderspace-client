import type { AxiosResponse } from "axios";
import { coderspaceBackend } from "../instance";



export async function getUser(): Promise<AxiosResponse<any>> {
  try {
    const res: AxiosResponse<any> = await coderspaceBackend.get("/user");
    return res;
  } catch (error) {
    throw error;
  }
}

export async function updateSuggestionLevel<T>(data:T): Promise<AxiosResponse<{success:boolean,message:string}>> {
  try {
    const res: AxiosResponse<any> = await coderspaceBackend.patch("/user/suggestion/level",data);
    return res;
  } catch (error) {
    throw error;
  }
}