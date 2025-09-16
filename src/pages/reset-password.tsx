import { resetPassword } from "@/api/auth/auth.api";
import { useAppSelector } from "@/app/hooks/redux-custom-hook";
import AuthFormWraper from "@/components/common/auth-form-wraper";
import CustomForm from "@/components/common/form";
import LoadingSpin from "@/components/common/loading-spin";
import { ResetPasswordFields } from "@/utils/constants";
import { uuidRegex } from "@/utils/regex";
import { toastifyOptionsCenter } from "@/utils/toastify.options";
import { ResetPasswordSchema } from "@/utils/validation/user-validation";
import type { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import type z from "zod";

const RestPassword: React.FC = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const auth = useAppSelector((s) => s.authReducer.auth);
  const token = searchParams.get("token");

  type IRestPasswordData = z.infer<typeof ResetPasswordSchema>;
  const onSubmit = useCallback(
    async (data: IRestPasswordData) => {
      try {
        setLoading(true);
        const body = {
          newPassword: data.newPassword,
          token,
        };

        const res = await resetPassword(body);
        if (res.status === 200) {
          toast.success(
            "Your password has been reset successfully",
            toastifyOptionsCenter
          );
          navigate("/");
        }
      } catch (error) {
        setLoading(false);
        const axiosError = error as AxiosError<any>;
        console.log(axiosError);

        const errorMessage = axiosError.response?.data?.errors[0].error;
        if (errorMessage) {
          toast.error(errorMessage, toastifyOptionsCenter);
        }
      }
    },
    [token, navigate]
  );

  if (!token || !uuidRegex.test(token) || auth) {
    return <Navigate to={"/"} replace />;
  }
  return (
    <AuthFormWraper>
      <div>
        <h1 className="text-2xl font-bold font-[anybody-regular] text-center py-4">
          Rest Password
        </h1>
        <CustomForm
          fields={ResetPasswordFields}
          zodSchema={ResetPasswordSchema}
          onSubmit={onSubmit}
          btnName={isLoading ? <LoadingSpin /> : "Change"}
          btnDisable={isLoading}
        />
      </div>
    </AuthFormWraper>
  );
};

export default RestPassword;
