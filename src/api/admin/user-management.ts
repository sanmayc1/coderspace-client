import type { AxiosResponse } from "axios";
import { coderspaceBackend } from "../instance";



export async function getAllUsers(): Promise<AxiosResponse<any>> {
  try {
    const res: AxiosResponse<any> = await coderspaceBackend.get("/admin/users");
    return res;
  } catch (error) {
    throw error;
  }
}
