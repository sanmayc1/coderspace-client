import { createSlice } from "@reduxjs/toolkit";


interface AuthSliceState {
    auth:boolean
    profileUrl:string
    accountId:string
    profileComplete:boolean
    role:string
}

const initialState:AuthSliceState = {auth:false ,profileUrl:"", accountId:"",profileComplete:false,role:""}
const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
      setAuth:(state,actions)=>{
        state.auth = true
        state.profileUrl = actions.payload.profileUrl ?? ""
        state.accountId = actions.payload.accountId
        state.profileComplete = actions.payload.profileComplete
        state.role = actions.payload.role
      },
      clearAuth:(state)=>{
        state.auth = false
        state.profileUrl =""
        state.accountId = ""
        state.role = ""
      }
    }
})

export const {clearAuth,setAuth} = authSlice.actions
export default authSlice.reducer