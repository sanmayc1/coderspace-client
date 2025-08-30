import AuthFormWraper from "@/components/common/auth-form-wraper";
import CustomForm from "@/components/common/form";
import { LoginFileds } from "@/utils/constants";
import { LoginShema } from "@/utils/validation/user-validation";
import { useNavigate } from "react-router-dom";


const CompanyLogin: React.FC = () => {
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    navigate(path);
  };

  function onSubmit<T>(data: T) {return data}


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
