import type { IUserGetProblem } from './response.types';

export interface IUserRegister {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IUsersData {
  accountId: string;
  username: string;
  email: string;
  profileUrl?: string;
  blocked: boolean;
  badge: string;
  level: number;
  userId: string;
}

export interface ISideBarItems {
  icon: any;
  label: string;
  navigate?: string;
}

export interface IAppRoutes {
  path?: string;
  element?: React.ReactNode;
  allowedRoles?: Role[];
  children?: IAppRoutes[];
  index?: boolean;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ILoginResponse {
  errors: { path: string; message: string }[];
  message: string;
  success: boolean;
}

export interface AuthLoginError {
  error?: ILoginResponse;
  statusCode?: number;
}

export interface IProblemState {
  title: string;
  description: string;
  difficulty: string;
  skill: string;
  premium: boolean;
  domain: string;
  constrain: string;
  example: IExample;
  validationType: string;
}

export interface IExample {
  id: string;
  input: string;
  output: string;
  explanation: string;
}

export interface ISkill {
  title: string;
  id: string;
}

export interface IDomain {
  title: string;
  id: string;
}
export interface IProblemListing {
  title: string;
  number: number;
  languages: { language: TLanguages; id: string }[];
  id: string;
  view: TView;
}
export type TSort = 'NEWEST' | 'OLDEST' | 'NAME_ASC' | 'NAME_DESC';

export type Role = 'admin' | 'user' | 'company' | 'guest';

export type TLanguages = 'javascript' | 'java' | 'python' | 'typescript';
export type TView = 'public' | 'private';

export interface IReward {
  id: string;
  rank: string;
  description: string;
}
export interface IContestProblem extends IUserGetProblem {}
export interface IContestState {
  title: string;
  description: string;
  dateAndTime: string;
  duration: string;
  visibility: string;
  domain: string;
  skill: string;
  problem: string;
  constrain?: string;
  difficulty?: string;
  rewardRank: string;
  rewardDescription: string;
}
export interface IContestError {
  title: string;
  description: string;
  dateAndTime: string;
  duration: string;
  visibility: string;
  domain: string;
  skill: string;
  problem: string;
  rewardRank: string;
  rewardDescription: string;
  rewards: string;
}

export interface IListContestState {
  dateAndTime: string;
  description: string;
  duration: number;
  id: string;
  title: string;
  view: string;
  endDateAndTime: string;
}

export interface IInterviewData {
  title: string;
  id?: string;
  description: string;
  context: string;
  numberOfQuestions: number;
  difficulty: string;
  premium: boolean;
  duration: number;
}


export interface IInterviewDataUser {
  title: string;
  id: string;
  description: string;
  numberOfQuestions: number;
  premium: boolean;
  duration: number;
  isAttempted:boolean;
  sessionId:string;
}