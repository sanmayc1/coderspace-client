import type { IGetAllChatsResponse, IGetChatMessagesResponse } from '@/types/response.types';
import { API_ROUTES } from '../apiRoutes';
import { coderspaceBackend } from '../instance';

export async function getAllChats(): Promise<IGetAllChatsResponse[]> {
  const response = await coderspaceBackend.get(API_ROUTES.GET_ALL_CHATS);
  return response.data.data;
}

export async function getChatMessages(receiverId: string): Promise<IGetChatMessagesResponse> {
  const response = await coderspaceBackend.get(API_ROUTES.GET_CHAT_MESSAGES(receiverId));
  return response.data.data;
}
