import { forgetPassword } from "@/api/auth/auth.api";
import AuthFormWraper from "@/components/common/auth-form-wraper";
import CustomForm from "@/components/common/form";
import LoadingSpin from "@/components/common/loading-spin";
import { toastifyOptionsCenter } from "@/utils/toastify.options";
import { ForgetPasswordSchema } from "@/utils/validation/user-validation";
import type { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword: React.FC = () => {
  const [isLoading,setLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const onSubmit = useCallback(
    async <T,>(
      data: T
    ) => {
       try {
        setLoading(true)
        const res = await forgetPassword(data)
        setLoading(false)
        if(res.status === 200){
            toast.success('Reset link sent to your registered email',toastifyOptionsCenter)
            navigate("/")
        }
       } catch (error) {
        setLoading(false)
        const axiosError  = error as AxiosError<any>
        const errorMessage  =axiosError.response?.data?.errors[0].error
        if(errorMessage){
          toast.error(errorMessage,toastifyOptionsCenter)
        }
       }
    },
    []
  );
  return (
    <AuthFormWraper>
      <div>
        <h1 className="text-2xl font-bold font-[anybody-regular] text-center py-4">
          Forget Password
        </h1>
        <CustomForm
          fields={[{ name: "email", placeholder: "Email" }]}
          zodSchema={ForgetPasswordSchema}
          onSubmit={onSubmit}
          btnName={isLoading ? <LoadingSpin/> :"Submit"} 
          btnDisable={isLoading}
        />
      </div>
    </AuthFormWraper>
  );
};

export default ForgotPassword;
