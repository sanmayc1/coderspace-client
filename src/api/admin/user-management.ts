import type { AxiosResponse } from "axios";
import { coderspaceBackend } from "../instance";

interface getAllUsersParams {
  page: number;
  sort: string;
  search: string;
  limit: string;
}

interface updateUserData {
  id: string;
  level: number;
  badge: string;
}

export async function getAllUsers(
  params: getAllUsersParams
): Promise<AxiosResponse<any>> {
  try {
    const res: AxiosResponse<any> = await coderspaceBackend.get(
      `/admin/users?page=${params.page}&sort=${params.sort}&search=${params.search}&limit=${params.limit}`
    );
    return res;
  } catch (error) {
    throw error;
  }
}

export async function updateUser(
  params: updateUserData
): Promise<AxiosResponse<any>> {
  try {
    const res: AxiosResponse<any> = await coderspaceBackend.patch(
      `/admin/users/${params.id}`,
      { currentLevel: params.level, currentBadge: params.badge }
    );
    return res;
  } catch (error) {
    throw error;
  }
}

export async function updateUserStatus(id:string): Promise<AxiosResponse<any>> {
  try {
    const res: AxiosResponse<any> = await coderspaceBackend.patch(
      `/admin/users/${id}/status`
    );
    return res;
  } catch (error) {
    throw error;
  }
}
