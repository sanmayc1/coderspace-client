import type {
  ICommonResponse,
  IGetProblemUpdatesResponse,
  ISuccessResponse,
  IUserGetProblemDetailed,
  IUserGetProblemsResponse,
} from '@/types/response.types';
import { coderspaceBackend } from '../instance';
import { API_ROUTES } from '../apiRoutes';

export async function getProblemsUser(
  search: string,
  page: string,
  difficulty: string,
  skill: string
): Promise<ISuccessResponse<IUserGetProblemsResponse>> {
  try {
    const res = await coderspaceBackend.get(
      API_ROUTES.GET_ALL_PROBLEMS_USER(search, page, difficulty, skill)
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getProblemUser(
  id: string
): Promise<ISuccessResponse<IUserGetProblemDetailed>> {
  try {
    const res = await coderspaceBackend.get(API_ROUTES.GET_PROBLEM_USER(id));
    return res.data;
  } catch (error) {
    throw error;
  }
}


export async function runProblemUser(
  id: string,
  code: string,
  language: string,
): Promise<ICommonResponse> {
  try {
    const res = await coderspaceBackend.post(API_ROUTES.RUN_PROBLEM_USER,{
      problemId:id,
      code,
      language
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}


export async function submitProblemUser(
  id: string,
  code: string,
  language: string,
): Promise<ICommonResponse> {
  try {
    const res = await coderspaceBackend.post(API_ROUTES.SUBMIT_PROBLEM_USER,{
      problemId:id,
      code,
      language
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getProblemupdates(
  problemId: string,
  language: string,
): Promise<IGetProblemUpdatesResponse> {
  try {
    const res = await coderspaceBackend.get(API_ROUTES.GET_PROBLEM_UPDATES(problemId,language));
    return res.data.data;
  } catch (error) {
    throw error;
  }
}