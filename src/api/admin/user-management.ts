import type { AxiosResponse } from "axios";
import { coderspaceBackend } from "../instance";
import { API_ROUTES } from "../apiRoutes";
import type {
  ICommonResponse,
  IGetAllUsersResponse,
  ISuccessResponse,
} from "@/types/response.types";

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
): Promise<AxiosResponse<ISuccessResponse<IGetAllUsersResponse>>> {
  const res: AxiosResponse<ISuccessResponse<IGetAllUsersResponse>> =
    await coderspaceBackend.get(
      API_ROUTES.GET_ALL_USERS(
        params.page,
        params.sort,
        params.search,
        params.limit
      )
    );
  return res;
}

export async function updateUser(
  params: updateUserData
): Promise<AxiosResponse<ICommonResponse>> {
  const res: AxiosResponse<ICommonResponse> = await coderspaceBackend.patch(
    API_ROUTES.UPDATE_USERS(params.id),
    { currentLevel: params.level, currentBadge: params.badge }
  );
  return res;
}

export async function updateUserStatus(
  id: string
): Promise<AxiosResponse<ICommonResponse>> {
  const res: AxiosResponse<ICommonResponse> = await coderspaceBackend.patch(
    API_ROUTES.UPDATE_USERS_STATUS(id)
  );
  return res;
}
