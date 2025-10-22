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

export type TSort = "NEWEST" | "OLDEST" | "NAME_ASC" | "NAME_DESC";

export type Role = "admin" | "user" | "company" | "guest";
