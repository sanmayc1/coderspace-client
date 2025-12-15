import type { IGetAllSkills, ISuccessResponse } from "@/types/response.types";
import { coderspaceBackend } from "../instance";
import { API_ROUTES } from "../apiRoutes";

export async function getAllSkills(): Promise<ISuccessResponse<IGetAllSkills>> {
  try {
    const res = await coderspaceBackend.get(API_ROUTES.GET_ALL_SKILLS);

    return res.data;
  } catch (error) {
    throw error;
  }
}
