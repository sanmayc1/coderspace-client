import type { ICommonResponse } from "@/types/response.types";
import { API_ROUTES } from "../apiRoutes";
import { coderspaceBackend } from "../instance";

export async function createProblem<T>(data: T): Promise<ICommonResponse> {
  try {
    const res = await coderspaceBackend.post(API_ROUTES.CREATE_PROBLEM, data);

    return res.data;
  } catch (error) {
    throw error;
  }
}

