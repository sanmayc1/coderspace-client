import { useAppDispatch } from "@/app/hooks/redux-custom-hook";
import AuthFormWraper from "@/components/common/AuthFormWraper";
import CustomForm from "@/components/common/Form";
import { Button } from "@/components/ui/Button";
import { LoginFileds } from "@/utils/constants";
import { LoginShema } from "@/utils/validation/user-validation";
import { Github } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type z from "zod";
import { useCallback } from "react";
import { mapLoginErrors } from "@/utils/error-handlers/mapLoginErrors";
import { authLogin } from "@/api/asyncThunk/thunk-api";
import type {
  AuthLoginError,
  ILoginPayload,
  ILoginResponse,
} from "@/types/types";
const googleAuthUrl = import.meta.env.VITE_REDIRECT_GOOGLE;
const githubAuthUrl = import.meta.env.VITE_REDIRECT_GITHUB;
const userLoginUrl = import.meta.env.VITE_USER_LOGIN_URL;

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
        await dispatch(
          authLogin({
            endpoint: userLoginUrl,
            payload: data as ILoginPayload,
          })
        ).unwrap();
        navigate("/");
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
        className="text-xs cursor-pointer text-right px-5 py-2  hover:"
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
