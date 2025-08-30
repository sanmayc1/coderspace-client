import axios from "axios"
const baseURL = import.meta.env.VITE_BASE_URL

export const coderspaceBackend = axios.create({
    baseURL:baseURL,
    withCredentials:true
})



