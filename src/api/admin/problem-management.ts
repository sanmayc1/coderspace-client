import type {
  ICommonResponse,
  IGetAllProblemAdminListing,
  ISuccessResponse,
} from "@/types/response.types";
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

export async function getAllProblemAdminListing(
  search: string,
  sortBy: string,
  page: string
): Promise<ISuccessResponse<IGetAllProblemAdminListing>> {
  try {
    const res = await coderspaceBackend.get(
      API_ROUTES.GET_ALL_PROBLEM_ADMIN_LISTING(search, page, sortBy)
    );

    return res.data;
  } catch (error) {
    throw error;
  }
}


export async function addLanguage<T>(data: T): Promise<ICommonResponse> {
  try {
    const res = await coderspaceBackend.post(API_ROUTES.ADD_LANGUAGE, data);

    return res.data;
  } catch (error) {
    throw error;
  }
}