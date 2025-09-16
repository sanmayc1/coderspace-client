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
  icon:any;
  label: string;
  navigate?: string;
}
