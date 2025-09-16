import { userLogin } from "@/api/auth/auth.api";
import { useAppDispatch } from "@/app/hooks/redux-custom-hook";
import AuthFormWraper from "@/components/common/auth-form-wraper";
import CustomForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { LoginFileds } from "@/utils/constants";
import { LoginShema } from "@/utils/validation/user-validation";
import type { AxiosError } from "axios";
import { Github } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type z from "zod";
import { setAuth } from "@/app/redux-slice/authReducer";
import { useCallback } from "react";
import { mapLoginErrors } from "@/utils/error-handlers/mapLoginErrors";
import { toastifyOptionsCenter } from "@/utils/toastify.options";
const googleAuthUrl = import.meta.env.VITE_REDIRECT_GOOGLE;
const githubAuthUrl = import.meta.env.VITE_REDIRECT_GITHUB;

const UserLogin: React.FC = () => {
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
        const res = await userLogin(data);
        if (res && res.status === 200) {
          dispatch(
            setAuth({
              accountId: res.data?.data?.accountId,
              profileUrl: res.data?.data?.profileUrl,
              profileComplete: res.data?.data?.profileComplete,
              role: res.data?.data?.role,
            })
          );
               toast.success("Successfully Logined",{...toastifyOptionsCenter,position:"bottom-left"}); 
          navigate("/");
        }
      } catch (error) {
        console.log(error);

        mapLoginErrors(error as AxiosError<any>, setErrors);
      }
    },
    [dispatch, navigate]
  );

  const redirect = useCallback((path: string) => {
    window.location.href = path;
  }, []);

  return (
    <AuthFormWraper>
      <h1 className="text-2xl font-bold font-[anybody-regular] text-center py-4">
        Welcome Back !
      </h1>
      <CustomForm
        fields={LoginFileds}
        zodSchema={LoginShema}
        onSubmit={onSubmit}
        btnName="Login"
      />
      <p
        className="text-xs cursor-pointer text-right px-5 pb-2  hover:"
        onClick={() => navigate("/auth/password/forget")}
      >
        Forgotten your password?
      </p>
      <div className="flex items-center justify-center ">
        <hr className="w-[40%] border-1 border-gray-200" />
        <span className="px-5 text-sm text-gray-400 font-semibold">Or</span>
        <hr className="w-[40%] border-1 border-gray-200" />
      </div>

      <div className="mt-3 flex flex-col justify-center gap-3">
        <Button variant={"outline"} onClick={() => redirect(githubAuthUrl)}>
          <Github
            className="rounded-full bg-black  p-1 box-content "
            color="white"
          />{" "}
          Continue with GitHub
        </Button>
        <Button variant={"outline"} onClick={() => redirect(googleAuthUrl)}>
          <img src="/google-icon.png" className="w-6" />
          Continue with Google
        </Button>
      </div>
      <div className="flex justify-center items-center pt-4 ">
        <p
          className="text-gray-600 text-sm select-none"
          onClick={() => navigate("/user/signup")}
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

export default UserLogin;
