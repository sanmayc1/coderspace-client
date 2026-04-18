import type { ICommonResponse, IGetAllCodersResponse, IGetCoderResponse } from '@/types/response.types';
import { API_ROUTES } from '../apiRoutes';
import { coderspaceBackend } from '../instance';

export async function getAllCoders(): Promise<IGetAllCodersResponse[]> {
  
    const response = await coderspaceBackend.get(API_ROUTES.GET_ALL_CODERS);
    return response.data.data;

}

export async function followCoder(coderId: string): Promise<ICommonResponse> {
  
    const response = await coderspaceBackend.post(API_ROUTES.FOLLOW_CODER, {
      followingId: coderId,
    });
    return response.data;
 
}

export async function unFollowCoder(coderId: string): Promise<ICommonResponse> {
  
    const response = await coderspaceBackend.delete(API_ROUTES.UNFOLLOW_CODER(coderId));
    return response.data;

}

export async function getCoder(coderId: string): Promise<IGetCoderResponse> {
  
    const response = await coderspaceBackend.get(API_ROUTES.GET_CODER(coderId));
    return response.data.data;

}