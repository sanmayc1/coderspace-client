import { createAsyncThunk } from "@reduxjs/toolkit";
import type { IFetchRoleData } from "../types";
import { coderspaceBackend } from "../instance";
import type { AxiosError } from "axios";
import type {
  AuthLoginError,
  ILoginPayload,
  ILoginResponse,
} from "@/types/types";
import { API_ROUTES } from "../apiRoutes";

export const fetchRoleData = createAsyncThunk(
  "fetch/role",
  async (_, thunkAPI) => {
    try {
      const response = await coderspaceBackend.get(API_ROUTES.AUTH_CHECK);
      return response.data.data as IFetchRoleData;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as AxiosError<any>).response?.data
      );
    }
  }
);

export const authLogin = createAsyncThunk<
  IFetchRoleData,
  { endpoint: string; payload: ILoginPayload },
  { rejectValue: AuthLoginError }
>("auth/login", async ({ endpoint, payload }, thunkAPI) => {
  try {
    const response = await coderspaceBackend.post(endpoint, payload);
    return response.data.data as IFetchRoleData;
  } catch (error) {
    return thunkAPI.rejectWithValue({
      error: (error as AxiosError<ILoginResponse>).response?.data,
      statusCode: (error as AxiosError<any>).status,
    });
  }
});
