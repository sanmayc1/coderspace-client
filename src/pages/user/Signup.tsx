import { sendOtp, userSignup } from "@/api/auth/auth.api";
import AuthFormWraper from "@/components/common/AuthFormWraper";
import CustomForm from "@/components/common/Form";
import { Button } from "@/components/ui/Button";
import { UserRegisterFormFields } from "@/utils/constants";
import { toastifyOptionsCenter } from "@/utils/toastify.options";
import { RegistreSchema } from "@/utils/validation/user-validation";
import { AxiosError } from "axios";
import { Github, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type z from "zod";
const googleAuthUrl = import.meta.env.VITE_REDIRECT_GOOGLE;
const githubAuthUrl = import.meta.env.VITE_REDIRECT_GITHUB;

const UserSignup: React.FC = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    navigate(path);
  };

  type IUserRegister = z.infer<typeof RegistreSchema>;

  async function onSubmit<T>(
    data: IUserRegister,
    setErrors: React.Dispatch<
      React.SetStateAction<Partial<Record<keyof z.core.output<T>, string>>>
    >
  ) {
    try {
      setLoading(true);
      const res = await userSignup({
        username: data.username,
        email: data.email,
        name: data.name,
        password: data.password,
      });
      if (res && res.status === 201) {
        setLoading(false);
        const res = await sendOtp();
        if (res && res.status === 200) {
          setLoading(false);

          toast.success("OTP sent to email", {
            ...toastifyOptionsCenter,
            position: "bottom-left",
          });
          navigateTo("/auth/otp-verify");
        }
      }
    } catch (error: any) {
      const axiosError = error as AxiosError<any>;
      console.log(axiosError);

      setLoading(false);
      if (
        axiosError.status === 409 ||
        (axiosError.status === 400 &&
          axiosError.response?.data.message === "Validation error occurred")
      ) {
        let newError: Partial<Record<keyof z.infer<T>, string>> = {};
        axiosError.response?.data?.errors.forEach(
          (err: Record<string, string>) => {
            newError[err?.path as keyof z.infer<T>] = err?.message;
          }
        );
        setErrors(newError);
      }
    }
  }

  const redirect = (path: string) => {
    window.location.href = path;
  };

  return (
    <AuthFormWraper>
      <h1 className="text-2xl font-bold font-[anybody-regular] text-center py-4">
        Join Us Today !
      </h1>
      <CustomForm
        fields={UserRegisterFormFields}
        zodSchema={RegistreSchema}
        onSubmit={onSubmit}
        gap="2"
        btnName={
          isLoading ? <LoaderCircle className="animate-spin" /> : "Signup"
        }
        btnDisable={isLoading}
      />
      <div className="flex items-center justify-center ">
        <hr className="w-[40%] border-1 border-gray-200" />
        <span className="px-5 text-sm text-gray-400 font-semibold">Or</span>
        <hr className="w-[40%] border-1 border-gray-200" />
      </div>

      <div className="mt-3 flex flex-col justify-center gap-3">
        <Button variant={"outline"} onClick={() => redirect(githubAuthUrl)}>
          <Github
            className="rounded-full bg-black  p-1 box-content"
            color="white"
          />{" "}
          Continue with GitHub
        </Button>
        <Button variant={"outline"} onClick={() => redirect(googleAuthUrl)}>
          <img src="/google-icon.png" className="w-6" />
          Continue with Google
        </Button>
      </div>
      <div className="flex justify-center items-center pt-3 ">
        <p
          className="text-gray-600 text-sm select-none"
          onClick={() => navigateTo("/user/login")}
        >
          Already have an account?
          <span className="text-black hover:scale-110 cursor-pointer">
            {" "}
            Login
          </span>
        </p>
      </div>
    </AuthFormWraper>
  );
};

export default UserSignup;
