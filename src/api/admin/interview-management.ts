// import { API_ROUTES } from '../apiRoutes';
// import { axiosInstance } from '../instance';

import type { ICommonResponse } from "@/types/response.types";
import type { title } from "process";
import { coderspaceBackend } from "../instance";
import { API_ROUTES } from "../apiRoutes";

export const getAllInterviewsAdmin = async (params: {
  page: number;
  sort: string;
  search: string;
  limit: string;
}) => {
  // To avoid lint errors about unused params, log them or use them in dummy data generation
  console.log('Fetching interviews with params:', params);

  // Dummy response for now
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          data: {
            interviews: [
              {
                title: 'Frontend Developer',
                id: 'int_1',
                description: 'John Doe',
                context: 'Frontend Developer',
                numberOfQuestions: 5,
                difficulty: 'easy',
                premium: true,
                duration: 60,
              },
              {
                title: 'Backend Developer',
                id: 'int_2',
                description: 'Jane Smith',
                context: 'Backend Developer',
                numberOfQuestions: 5,
                difficulty: 'easy',
                premium: true,
                duration: 60,
              },
              {
                title: 'Full Stack Engineer',
                id: 'int_3',
                description: 'Alice Johnson',
                context: 'Full Stack Engineer',
                numberOfQuestions: 5,
                difficulty: 'easy',
                premium: true,
                duration: 60,
              },
              {
                title: 'DevOps Engineer',
                id: 'int_4',
                description: 'Bob Brown',
                context: 'DevOps Engineer',
                numberOfQuestions: 5,
                difficulty: 'easy',
                premium: true,
                duration: 60,
              },
              {
                title: 'React Developer',
                id: 'int_5',
                description: 'Charlie Davis',
                context: 'React Developer',
                numberOfQuestions: 5,
                difficulty: 'easy',
                premium: true,
                duration: 60,
              },
              {
                title: 'Java Developer',
                id: 'int_6',
                description: 'David Evans',
                context: 'Java Developer',
                numberOfQuestions: 5,
                difficulty: 'easy',
                premium: true,
                duration: 60,
              },
            ]
              .filter((i) => i.title.toLowerCase().includes(params.search.toLowerCase()))
              .slice(0, parseInt(params.limit || '5')),
            totalPages: 2,
            page: params.page,
          },
        },
      });
    }, 500);
  });
};



export async function createInterview<T>(data: T): Promise<ICommonResponse> {
  
    const res = await coderspaceBackend.post(API_ROUTES.CREATE_INTERVIEW, data);

    return res.data;

}