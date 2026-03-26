import type {
  IGetAllUserInterviewsResponse,
  IGetInterviewQuestionResponse,
  ISuccessResponse,
} from '@/types/response.types';
import { API_ROUTES } from '../apiRoutes';
import { coderspaceBackend } from '../instance';

export async function getAllInterviews(
  page: number
): Promise<ISuccessResponse<IGetAllUserInterviewsResponse>> {
  const res = await coderspaceBackend.get(API_ROUTES.GET_ALL_INTERVIEWS_USER(page));
  return res.data;
}

export async function createInterviewSession(
  interviewId: string
): Promise<ISuccessResponse<{ sessionId: string }>> {
  const res = await coderspaceBackend.post(API_ROUTES.CREATE_INTERVIEW_SESSION, { interviewId });
  return res.data;
}

export async function getInterviewQuestion(
  sessionId: string,
  questionNumber: number
): Promise<ISuccessResponse<IGetInterviewQuestionResponse>> {
  const res = await coderspaceBackend.get(
    API_ROUTES.GET_INTERVIEW_QUESTION(sessionId, questionNumber)
  );
  return res.data;
}
