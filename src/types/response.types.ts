import type { IDomain, IExample, IListContestState, IProblemListing, ISkill, TLanguages} from "./types";

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


export interface IGetProblem{
  title: string;
  description: string;
  difficulty: string;
  skills: ISkill[];
  premium: boolean;
  domain: string;
  constrain: string;
  examples: IExample[];
}


export interface IUserGetProblem{
  id:string
  title: string;
  number:number
  difficulty: string;
  skills: ISkill[];
  premium:boolean
}

export interface IUserGetProblemsResponse{
  problems:IUserGetProblem[],
  totalPages:number,
  currentPage:number
}



export interface ITemplateCodes{
  language:string
  id:string,
  templateCode:string
}

export interface IUserGetProblemDetailed{
  title: string;
  description: string;
  number:number
  difficulty: string;
  skills: ISkill[];
  premium: boolean;
  domain: string;
  constrain: string;
  examples: IExample[];
  templateCodes:ITemplateCodes[]
}



export interface IGetAllContest{
  contests:IListContestState[]
  currentPage:number
  totalPages:number

  
}

