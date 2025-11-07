import type { AxiosResponse } from "axios";
import { coderspaceBackend } from "../instance";
import { API_ROUTES } from "../apiRoutes";
import type {
  ICommonResponse,
  IGetUserResponse,
  ISuccessResponse,
} from "@/types/response.types";

export async function getUser(): Promise<
  AxiosResponse<ISuccessResponse<IGetUserResponse>>
> {
  const res: AxiosResponse<ISuccessResponse<IGetUserResponse>> =
    await coderspaceBackend.get(API_ROUTES.GET_USER_PROFILE);
  return res;
}

export async function updateSuggestionLevel<T>(
  data: T
): Promise<AxiosResponse<ICommonResponse>> {
  const res: AxiosResponse<ICommonResponse> = await coderspaceBackend.patch(
    API_ROUTES.UPDATE_USER_SUGGESTION_LEVEL,
    data
  );
  return res;
}
