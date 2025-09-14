import { commonLogin } from "@/api/auth/auth.api";
import { useAppDispatch } from "@/app/hooks/redux-custom-hook";
import { setAuth } from "@/app/redux-slice/authReducer";
import AuthFormWraper from "@/components/common/auth-form-wraper";
import CustomForm from "@/components/common/form";
import { LoginFileds } from "@/utils/constants";
import { mapLoginErrors } from "@/utils/error-handlers/mapLoginErrors";
import { LoginShema } from "@/utils/validation/user-validation";
import type { AxiosError } from "axios";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type z from "zod";

const CompanyLogin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const navigateTo = (path: string) => {
    navigate(path);
  };

  const onSubmit = useCallback(
    async function <T>(
      data: T,
      setErrors: React.Dispatch<
        React.SetStateAction<Partial<Record<keyof z.core.output<T>, string>>>
      >
    ) {
      try {
        const res = await commonLogin(data);
        if (res && res.status === 200) {
          dispatch(
            setAuth({
              accountId: res.data?.data?.accountId,
              profileUrl: res.data?.data?.profileUrl,
              profileComplete: res.data?.data?.profileComplete,
              role: res.data?.data?.role,
            })
          );
          toast.success("Logined");
          if (res.data?.data?.role === "admin") navigate("/admin");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.log(error);

        mapLoginErrors(error as AxiosError<any>, setErrors);
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

      <div className="flex justify-center items-center pt-4 ">
        <p
          className="text-gray-600 text-sm select-none"
          onClick={() => navigateTo("/company/register")}
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
