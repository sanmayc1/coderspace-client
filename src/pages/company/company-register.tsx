import AuthFormWraper from "@/components/common/auth-form-wraper";
import CustomForm from "@/components/common/form";
import { CompanyRegisterFields } from "@/utils/constants";
import { CompanyRegistreSchema } from "@/utils/validation/company-validation";
import { useNavigate } from "react-router-dom";

const CompanyRegister: React.FC = () => {
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    navigate(path);
  };

  function onSubmit<T>(data: T) {}
  return (
    <AuthFormWraper>
      <h1 className="text-2xl font-bold font-[anybody-regular] text-center py-4">
        Business Register
      </h1>
      <CustomForm
        fields={CompanyRegisterFields}
        zodSchema={CompanyRegistreSchema}
        onSubmit={onSubmit}
        gap="2"
        btnName="Register"
      />


      <div className="flex justify-center items-center pt-3 ">
        <p
          className="text-gray-600 text-sm select-none"
          onClick={() => navigateTo("/company/login")}
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

export default CompanyRegister;
