import type { ICommonResponse, IGetAllCodersResponse, IGetCoderResponse } from '@/types/response.types';
import { API_ROUTES } from '../apiRoutes';
import { coderspaceBackend } from '../instance';

export async function getAllCoders(): Promise<IGetAllCodersResponse[]> {
  try {
    const response = await coderspaceBackend.get(API_ROUTES.GET_ALL_CODERS);
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function followCoder(coderId: string): Promise<ICommonResponse> {
  try {
    const response = await coderspaceBackend.post(API_ROUTES.FOLLOW_CODER, {
      followingId: coderId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function unFollowCoder(coderId: string): Promise<ICommonResponse> {
  try {
    const response = await coderspaceBackend.delete(API_ROUTES.UNFOLLOW_CODER(coderId));
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getCoder(coderId: string): Promise<IGetCoderResponse> {
  try {
    const response = await coderspaceBackend.get(API_ROUTES.GET_CODER(coderId));
    return response.data.data;
  } catch (error) {
    throw error;
  }
}