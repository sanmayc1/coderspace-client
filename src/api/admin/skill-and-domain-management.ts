import type {
  ICommonResponse,
  IGetAllDomains,
 
  ISuccessResponse,
} from "@/types/response.types";
import { coderspaceBackend } from "../instance";
import { API_ROUTES } from "../apiRoutes";

export async function createDomain<T>(data: T): Promise<ICommonResponse> {
  try {
    const res = await coderspaceBackend.post(API_ROUTES.CREATE_DOMAIN, data);

    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getAllDomains(): Promise<
  ISuccessResponse<IGetAllDomains>
> {
  try {
    const res = await coderspaceBackend.get(API_ROUTES.GET_ALL_DOMAINS);

    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteDomain(id: string): Promise<ICommonResponse> {
  try {
    const res = await coderspaceBackend.delete(API_ROUTES.DELETE_DOMAIN(id));

    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function createSkill<T>(data: T): Promise<ICommonResponse> {
  try {
    const res = await coderspaceBackend.post(API_ROUTES.CREATE_SKILL, data);

    return res.data;
  } catch (error) {
    throw error;
  }
}


export async function deleteSkill(id: string): Promise<ICommonResponse> {
  try {
    const res = await coderspaceBackend.delete(API_ROUTES.DELETE_SKILL(id));

    return res.data;
  } catch (error) {
    throw error;
  }
}
