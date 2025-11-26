import type {
  ICommonResponse,
  IGetAllProblemAdminListing,
  IGetLanguageDetails,
  IGetProblem,
  IGetTestcase,
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

export async function getLanguageDetails(
  id: string
): Promise<ISuccessResponse<IGetLanguageDetails>> {
  try {
    const res = await coderspaceBackend.get(API_ROUTES.GET_LANGUAGE(id));

    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function updateLanguage<T>(data: T): Promise<ICommonResponse> {
  try {
    const res = await coderspaceBackend.patch(API_ROUTES.UPDATE_LANGUAGE, data);

    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function addSingleTestcase<T>(data: T): Promise<ICommonResponse> {
  try {
    const res = await coderspaceBackend.post(API_ROUTES.ADD_TESTCASE, data);

    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getAllTestcase(
  id: string
): Promise<ISuccessResponse<IGetTestcase[]>> {
  try {
    const res = await coderspaceBackend.get(API_ROUTES.GET_TESTCASES(id));

    return res.data;
  } catch (error) {
    throw error;
  }
}


export async function deleteTestcase(
  id: string
): Promise<ICommonResponse> {
  try {
    const res = await coderspaceBackend.delete(API_ROUTES.TESTCASE_DELETED(id));

    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getProblem(
  id: string
): Promise<ISuccessResponse<IGetProblem>> {
  try {
    const res = await coderspaceBackend.get(API_ROUTES.GET_PROBLEM(id));
    return res.data;
  } catch (error) {
    throw error;
  }
}


export async function updateProblem<T>(data: T): Promise<ICommonResponse> {
  try {
    const res = await coderspaceBackend.patch(API_ROUTES.UPDATE_PROBLEM, data);

    return res.data;
  } catch (error) {
    throw error;
  }
}


export async function changeVisibility<T>(data: T): Promise<ICommonResponse> {
  try {
    const res = await coderspaceBackend.patch(API_ROUTES.CHANGE_VISIBILITY, data);

    return res.data;
  } catch (error) {
    throw error;
  }
}
