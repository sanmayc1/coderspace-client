import { verifyOtp } from "@/api/auth/auth.api";
import AuthFormWraper from "@/components/common/auth-form-wraper";
import OtpForm from "@/components/common/otp";
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
        navigate("/user/login");
      }
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      toast.error(axiosError.response?.data?.errors[0]?.error, {
        style: {
          whiteSpace: "nowrap", 
          maxWidth: "100%", 
          overflow: "hidden", 
          textOverflow: "ellipsis", 
        },
      });
    }
  };

  return (
    <AuthFormWraper>
      <OtpForm onSubmit={onSubmit} />
    </AuthFormWraper>
  );
};

export default UserOtpVerificationPage;
