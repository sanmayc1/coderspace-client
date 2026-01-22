import type {
  ICommonResponse,
  IContestLeaderboardResponse,
  IContestSubmitProblemResponse,
  IGetAllContestUpcomingAndOngoingResponse,
  IGetContestProblemsResponse,
} from '@/types/response.types';
import { API_ROUTES } from '../apiRoutes';
import { coderspaceBackend } from '../instance';

export async function getAllUpcomingAndOngoingContests(
  page: number
): Promise<IGetAllContestUpcomingAndOngoingResponse> {
  try {
    const response = await coderspaceBackend.get(
      API_ROUTES.GET_ALL_UPCOMING_AND_ONGOING_CONTESTS(page)
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function getAllPastContests(
  page: number
): Promise<IGetAllContestUpcomingAndOngoingResponse> {
  try {
    const response = await coderspaceBackend.get(API_ROUTES.GET_ALL_PAST_CONTESTS(page));
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function getContestProblems(id: string): Promise<IGetContestProblemsResponse> {
  try {
    const response = await coderspaceBackend.get(API_ROUTES.GET_USER_CONTEST(id));
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function contestSubmitProblemUser(
  id: string,
  code: string,
  language: string,
  contestId: string
): Promise<IContestSubmitProblemResponse> {
  try {
    const res = await coderspaceBackend.post(API_ROUTES.SUBMIT_CONTEST_PROBLEM, {
      problemId: id,
      code,
      language,
      contestId,
    });
    return res.data.data;
  } catch (error) {
    throw error;
  }
}

export async function joinContestUser(id: string): Promise<ICommonResponse> {
  try {
    const response = await coderspaceBackend.post(API_ROUTES.JOIN_CONTEST_USER, { contestId: id });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function finishContestUser(id: string): Promise<ICommonResponse> {
  try {
    const response = await coderspaceBackend.post(API_ROUTES.FINISH_CONTEST_USER, {
      contestId: id,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}


export async function getContestLeaderboard(id: string): Promise<IContestLeaderboardResponse[]> {
  try {
    const response = await coderspaceBackend.get(API_ROUTES.GET_CONTEST_LEADERBOARD(id));
    return response.data.data;
  } catch (error) {
    throw error;
  }
}