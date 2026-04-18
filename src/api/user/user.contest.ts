import type {
  ICommonResponse,
  IContestSubmitProblemResponse,
  IGetAllContestUpcomingAndOngoingResponse,
  IGetContestProblemsResponse,
} from '@/types/response.types';
import { API_ROUTES } from '../apiRoutes';
import { coderspaceBackend } from '../instance';

export async function getAllUpcomingAndOngoingContests(
  page: number
): Promise<IGetAllContestUpcomingAndOngoingResponse> {
  
    const response = await coderspaceBackend.get(
      API_ROUTES.GET_ALL_UPCOMING_AND_ONGOING_CONTESTS(page)
    );
    return response.data.data;

}

export async function getAllPastContests(
  page: number
): Promise<IGetAllContestUpcomingAndOngoingResponse> {
 
    const response = await coderspaceBackend.get(API_ROUTES.GET_ALL_PAST_CONTESTS(page));
    return response.data.data;

}

export async function getContestProblems(id: string): Promise<IGetContestProblemsResponse> {
  
    const response = await coderspaceBackend.get(API_ROUTES.GET_USER_CONTEST(id));
    return response.data.data;

}

export async function contestSubmitProblemUser(
  id: string,
  code: string,
  language: string,
  contestId: string
): Promise<IContestSubmitProblemResponse> {
 
    const res = await coderspaceBackend.post(API_ROUTES.SUBMIT_CONTEST_PROBLEM, {
      problemId: id,
      code,
      language,
      contestId,
    });
    return res.data.data;

}

export async function joinContestUser(id: string): Promise<ICommonResponse> {
 
    const response = await coderspaceBackend.post(API_ROUTES.JOIN_CONTEST_USER, { contestId: id });
    return response.data;

}

export async function finishContestUser(id: string): Promise<ICommonResponse> {

    const response = await coderspaceBackend.post(API_ROUTES.FINISH_CONTEST_USER, {
      contestId: id,
    });
    return response.data;

}


