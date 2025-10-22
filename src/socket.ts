import { io, type Socket } from "socket.io-client";
const backendUrl= import.meta.env.VITE_BACKEND



export const socket:Socket = io(backendUrl,{withCredentials:true})