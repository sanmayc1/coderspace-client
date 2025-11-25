import type { IDomain, IProblemListing, ISkill, TLanguages, TView } from "./types";

export interface ICommonResponse {
  success: boolean;
  message: string;
}

export interface ISuccessResponse<T> extends ICommonResponse {
  data: T;
}

export interface IErrorResponse extends ICommonResponse {
  errors?: any[];
}

export interface IGetCompanyResponse {
  companyName: string;
  gstin: string;
  email: string;
  profileUrl: string;
}

export interface IGetAllUsersResponse {
  page: number;
  totalPages: number;
  users: IUsersDetails[];
}

export interface IUsersDetails {
  username: string;
  email: string;
  level: number;
  badge: "silver" | "gold" | "platinum";
  userId: string;
  accountId: string;
  blocked: boolean;
  profileUrl?: string;
}

export interface IGetUserResponse {
  id: string;
  name: string;
  username: string;
  xpCoin: number;
  currentLevel: number;
  currentBadge: string;
  accountId: string;
  about?: string;
  premiumActive: boolean;
  skills: any[];
}

export interface IGetAllDomains {
  domains:IDomain[]
}

export interface IGetAllSkills {
  skills:ISkill[]
}




export interface IGetAllProblemAdminListing{
    totalPages:number
    currentPage:number
    problems:IProblemListing[]

}


export interface IGetLanguageDetails{
    id:string
    language:TLanguages
    tmpCode:string
    solution:string
    fnName:string
}

export interface IGetTestcase{
  id:string,
  input:string,
  output:string,
  example?:boolean
}