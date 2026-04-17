import type { IGetAdminDashboardResponse, ISuccessResponse } from "@/types/response.types";
import { coderspaceBackend } from "../instance";
import { API_ROUTES } from "../apiRoutes";




export async function getAdminDashboardData(): Promise<ISuccessResponse<IGetAdminDashboardResponse>> {
  const res = await coderspaceBackend.get(API_ROUTES.GET_ADMIN_DASHBOARD);
  return res.data;
}