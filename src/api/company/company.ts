import type { IGetCompanyResponse } from "@/types/response.types"
import { API_ROUTES } from "../apiRoutes"
import { coderspaceBackend } from "../instance"




export const getComapny = async():Promise<IGetCompanyResponse>=>{
     try {
        const data =  (await coderspaceBackend.get(API_ROUTES.GET_COMPANY)).data
        const company:IGetCompanyResponse = data.data
        return company
        
     } catch (error) {
        throw error
     }
}