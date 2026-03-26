import type {
  ICommonResponse,
  IContestLeaderboardResponse,
  IGetAllSkills,
  ISuccessResponse,
} from '@/types/response.types';
import { coderspaceBackend } from '../instance';
import { API_ROUTES } from '../apiRoutes';

export async function getAllSkills(): Promise<ISuccessResponse<IGetAllSkills>> {
  const res = await coderspaceBackend.get(API_ROUTES.GET_ALL_SKILLS);

  return res.data;
}

export async function getContestLeaderboard(
  id: string,
  page: number,
  search: string
): Promise<IContestLeaderboardResponse> {
  const response = await coderspaceBackend.get(
    API_ROUTES.GET_CONTEST_LEADERBOARD(id, page, search)
  );
  return response.data.data;
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<ICommonResponse> {
  const res = await coderspaceBackend.patch(API_ROUTES.CHANGE_ACCOUNT_PASSWORD, {
    currentPassword,
    newPassword,
  });
  return res.data;
}
