import type { IGetAllCodersResponse, ISuccessResponse } from "@/types/response.types";
import { API_ROUTES } from "../apiRoutes";
import { coderspaceBackend } from "../instance";




export async function getAllCoders(): Promise<IGetAllCodersResponse[]> {
    
    try {
        const response = await coderspaceBackend.get(API_ROUTES.GET_ALL_CODERS);
        return response.data.data;
    } catch (error) {
        throw error
    }
}