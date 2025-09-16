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