import { createSlice } from "@reduxjs/toolkit";


interface AuthSliceState {
    auth:boolean
    profileUrl:string
    accountId:string
    profileComplete:boolean
    role:string
    loading:boolean
}

const initialState:AuthSliceState = {auth:false ,profileUrl:"", accountId:"",profileComplete:false,role:"",loading:true}
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
      },
      setLoading:(state,actions)=>{
        state.loading = actions.payload.loading
      }
    }
})

export const {clearAuth,setAuth,setLoading} = authSlice.actions
export default authSlice.reducer