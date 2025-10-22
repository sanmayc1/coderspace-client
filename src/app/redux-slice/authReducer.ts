import { authLogin, fetchRoleData } from "@/api/asyncThunk/thunk-api"; 
import type { IFetchRoleData } from "@/api/types";
import type { Role } from "@/types/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface IAuthSliceState {
  auth: boolean;
  profileUrl: string;
  accountId: string;
  profileComplete: boolean;
  role: Role;
  loading: boolean;
}

const handleRoleDataFullfilled = (
  state: IAuthSliceState,
  actions: PayloadAction<IFetchRoleData>
) => {
  state.accountId = actions.payload.accountId;
  state.auth = true;
  state.profileComplete = actions.payload?.profileComplete ?? false;
  state.profileUrl = actions.payload.profileUrl || "";
  state.role = actions.payload.role;
  state.loading = false;
};

const handleRoleDataRejected = (state: IAuthSliceState) => {
  state.accountId = "";
  state.auth = false;
  state.profileComplete = false;
  state.profileUrl = "";
  state.role = "guest";
  state.loading = false;
};

const initialState: IAuthSliceState = {
  auth: false,
  profileUrl: "",
  accountId: "",
  profileComplete: false,
  role: "guest",
  loading: true,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, actions) => {
      state.auth = true;
      state.profileUrl = actions.payload.profileUrl ?? "";
      state.accountId = actions.payload.accountId;
      state.profileComplete = actions.payload.profileComplete;
      state.role = actions.payload.role;
    },
    clearAuth: (state) => {
      state.auth = false;
      state.profileUrl = "";
      state.accountId = "";
      state.role = "guest";
    },
    setProfileComplete(state) {
      state.profileComplete = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoleData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoleData.fulfilled, handleRoleDataFullfilled)
      .addCase(fetchRoleData.rejected, handleRoleDataRejected)
      .addCase(authLogin.fulfilled,handleRoleDataFullfilled)
      .addCase(authLogin.rejected,handleRoleDataRejected)
  },
});

export const { clearAuth, setAuth, setProfileComplete } = authSlice.actions;
export default authSlice.reducer;
