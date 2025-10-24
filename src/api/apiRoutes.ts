export const API_ROUTES = {
  USER_SIGNUP: "/auth/signup",
  SEND_OTP: "/auth/otp",
  VERIFY_OTP: "/auth/verify",
  AUTH_CHECK: "/auth/me",
  LOGOUT: "/auth/logout",
  FORGET_PASSWORD: "/auth/password/forget",
  REST_PASSWORD: "/auth/password/reset",
  COMPANY_REGISTER: "/auth/company/register",
  GET_USER_PROFILE: "/user",
  UPDATE_USER_SUGGESTION_LEVEL: "/user/suggestion/level",
  USER_LOGIN: "/auth/login",
  COMPANY_LOGIN: "/auth/company/login",
  ADMIN_LOGIN: "/auth/admin/login",
  GET_ALL_USERS: (page: number, sort: string, search: string, limit: string) =>
    `/admin/users?page=${page}&sort=${sort}&search=${search}&limit=${limit}`,
  UPDATE_USERS: (id: string) => `/admin/users/${id}`,
  UPDATE_USERS_STATUS: (id: string) => `/admin/users/${id}/status`,
  GET_COMPANY:"/company"
};
