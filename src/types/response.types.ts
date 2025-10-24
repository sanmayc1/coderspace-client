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
