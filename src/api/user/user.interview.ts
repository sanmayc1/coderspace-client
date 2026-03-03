import { coderspaceBackend } from "../instance";



export async function getAudio():Promise<any>{
  const res = await coderspaceBackend.get('/user/interviews/test');
  return res;
}