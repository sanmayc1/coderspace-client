import { companyRegister, sendOtp } from "@/api/auth/auth.api";
import AuthFormWraper from "@/components/common/AuthFormWraper";
import CustomForm from "@/components/common/Form";
import LoadingSpin from "@/components/common/LoadingSpin";
import type { IErrorResponse } from "@/types/response.types";
import { CompanyRegisterFields } from "@/utils/constants";
import { toastifyOptionsCenter } from "@/utils/toastify.options";
import { CompanyRegistreSchema } from "@/utils/validation/company-validation";
import type { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type z from "zod";

const CompanyRegister: React.FC = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const navigateTo = (path: string) => {
    navigate(path);
  };

  type ICompanyRegister = z.infer<typeof CompanyRegistreSchema>;

  async function onSubmit<T>(
    data: ICompanyRegister,
    setErrors: React.Dispatch<
      React.SetStateAction<Partial<Record<keyof z.core.output<T>, string>>>
    >
  ) {
    try {
      setLoading(true);
      const res = await companyRegister({
        gstin: data.gstin,
        email: data.email,
        companyName: data.companyName,
        password: data.password,
      });

      if (res && res.status === 201) {
        setLoading(false);
        const res = await sendOtp();
        if (res && res.status === 200) {
          setLoading(false);
          toast.success("OTP sent to email", { ...toastifyOptionsCenter , position:"bottom-left"}); 
          navigateTo("/auth/otp-verify");
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>;
      console.log(axiosError);

      setLoading(false);
      if (
        axiosError.status === 409 ||
        (axiosError.status === 400 &&
          axiosError.response?.data.message === "Validation error occurred")
      ) {
        const newError: Partial<Record<keyof z.infer<T>, string>> = {};
        axiosError.response?.data?.errors?.forEach(
          (err: Record<string, string>) => {
            newError[err?.path as keyof z.infer<T>] = err?.message;
          }
        );
        setErrors(newError);
      }
    }
  }

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
        btnName={isLoading ? <LoadingSpin /> : "Register"}
      />

      <div className="flex justify-center items-center pt-3 ">
        <p
          className="text-gray-600 text-sm select-none"
          onClick={() => navigateTo("/company/login")}
        >
          Already have an account?
          <span className="text-black hover:scale-110 cursor-pointer">
            Login
          </span>
        </p>
      </div>
    </AuthFormWraper>
  );
};

export default CompanyRegister;
