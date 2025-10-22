import { verifyOtp } from "@/api/auth/auth.api";
import AuthFormWraper from "@/components/common/AuthFormWraper";
import OtpForm from "@/components/common/Otp";
import { toastifyOptionsCenter } from "@/utils/toastify.options";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserOtpVerificationPage: React.FC = () => {
  const navigate = useNavigate();

  const onSubmit = async (otp: string) => {
    try {
      const res = await verifyOtp(otp);
      if (res && res.status === 200) {
        toast.success("User Registered Successfully");
        navigate("/access-login"); 
      }
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      toast.error(axiosError.response?.data?.errors[0]?.error, toastifyOptionsCenter);
    }
  };

  return (
    <AuthFormWraper>
      <OtpForm onSubmit={onSubmit} />
    </AuthFormWraper>
  );
};

export default UserOtpVerificationPage;
