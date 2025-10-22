import { API_ROUTES } from "@/api/apiRoutes";
import { authLogin } from "@/api/asyncThunk/thunk-api";
import { useAppDispatch } from "@/app/hooks/redux-custom-hook";
import AuthFormWraper from "@/components/common/AuthFormWraper";
import CustomForm from "@/components/common/Form";
import type {
  AuthLoginError,
  ILoginPayload,
  ILoginResponse,
} from "@/types/types";
import { LoginFileds } from "@/utils/constants";
import { mapLoginErrors } from "@/utils/error-handlers/mapLoginErrors";
import { LoginShema } from "@/utils/validation/user-validation";
import { useCallback} from "react";
import { useNavigate } from "react-router-dom";
import type z from "zod";


const CompanyLogin: React.FC = () => {
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
         await dispatch(
          authLogin({
            endpoint: API_ROUTES.COMPANY_LOGIN,
            payload: data as ILoginPayload,
          })
        ).unwrap();
        navigate("/company");
      } catch (error) {
        mapLoginErrors(
          (error as AuthLoginError)?.error as ILoginResponse,
          (error as AuthLoginError)?.statusCode as number,
          setErrors
        );
      }
    },

    [dispatch, navigate]
  );

  return (
    <AuthFormWraper>
      <h1 className="text-2xl font-bold font-[anybody-regular] text-center py-4">
        Business Login
      </h1>
      <CustomForm
        fields={LoginFileds}
        zodSchema={LoginShema}
        onSubmit={onSubmit}
        btnName="Login"
      />
      <p
        className="text-xs cursor-pointer text-right px-5  py-2 hover:"
        onClick={() => navigate("/auth/password/forget")}
      >
        Forgotten your password?
      </p>
      <div className="flex justify-center items-center pt-4 ">
        <p
          className="text-gray-600 text-sm select-none"
          onClick={() => navigate("/company/register")}
        >
          Don't have an account ?
          <span className="text-black hover:scale-110 cursor-pointer">
            {" "}
            Signup
          </span>
        </p>
      </div>
    </AuthFormWraper>
  );
};

export default CompanyLogin;
