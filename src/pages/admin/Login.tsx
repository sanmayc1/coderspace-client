import { API_ROUTES } from "@/api/apiRoutes";
import { authLogin } from "@/api/asyncThunk/thunk-api";
import { useAppDispatch } from "@/app/hooks/redux-custom-hook";
import AuthFormWraper from "@/components/common/AuthFormWraper";
import CustomForm from "@/components/common/Form";
import LoadingSpin from "@/components/common/LoadingSpin";
import type { AuthLoginError, ILoginPayload, ILoginResponse } from "@/types/types";
import { LoginFileds } from "@/utils/constants";
import { mapLoginErrors } from "@/utils/error-handlers/mapLoginErrors";
import { LoginShema } from "@/utils/validation/user-validation";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import type z from "zod";

const AdminLogin: React.FC = () => {
  const [isLoading,setLoading] = useState(false)
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onSubmit = useCallback(
    async function <T>(
      data: T,
      setErrors: React.Dispatch<
        React.SetStateAction<Partial<Record<keyof z.core.output<T>, string>>>
      >
    ) {
      try {
        setLoading(true)
        await dispatch(
          authLogin({
            endpoint:API_ROUTES.ADMIN_LOGIN,
            payload: data as ILoginPayload,
          })
        ).unwrap();
        setLoading(false)
        navigate("/admin");
      } catch (error) {
        mapLoginErrors(
          (error as AuthLoginError)?.error as ILoginResponse,
          (error as AuthLoginError)?.statusCode as number,
          setErrors
        );
        setLoading(false)
      }
    },

    [dispatch, navigate]
  );
  return (
    <>
      <AuthFormWraper>
        <div className="flex justify-center items-center">
          <img src="/logo.png" alt="logo" className=" w-40" />
        </div>

        <CustomForm
          zodSchema={LoginShema}
          fields={LoginFileds}
          onSubmit={onSubmit}
          btnName={isLoading ? <LoadingSpin/> : "Login"}
          btnDisable={isLoading}
          gap="4"
        />
      </AuthFormWraper>
    </>
  );
};

export default AdminLogin;
