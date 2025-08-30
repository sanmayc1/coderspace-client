import AuthFormWraper from "@/components/common/auth-form-wraper";
import CustomForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { UserRegisterFormFields } from "@/utils/constants";
import { RegistreSchema } from "@/utils/validation/user-validation";
import { Github } from "lucide-react";
import { useNavigate } from "react-router-dom";
const googleAuthUrl = import.meta.env.VITE_REDIRECT_GOOGLE;
const githubAuthUrl = import.meta.env.VITE_REDIRECT_GITHUB;

const UserSignup: React.FC = () => {
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    navigate(path);
  };

  function onSubmit<T>(data: T) {}

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
        btnName="Signup"
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
