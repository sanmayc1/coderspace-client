import { API_ROUTES } from "../apiRoutes";
import { coderspaceBackend } from "../instance";





export async function createProblem <T>(data:T){
  await  coderspaceBackend.post(API_ROUTES.CREATE_PROBLEM,data)


}