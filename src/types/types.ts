


export interface IUserRegister {
    name:string
    username:string
    email:string
    password:string
    confirmPassword:string

}


export interface IUsersData {
    id:string
    username:string
    email:string
    profileUrl?:string
    status:boolean
    badge:string
    level:number
    actions?:string 
}