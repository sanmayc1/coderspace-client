import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import type { OtpProps } from "@/types/props.types";
import { useState } from "react";
import { Button } from "../ui/button";
import { sendOtp } from "@/api/auth/auth.api";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

const OtpForm: React.FC<OtpProps> = ({ onSubmit }) => {
  const [otp, setOtp] = useState<string>("");
  const resendOtp = async () => {
    try {
      const res = await sendOtp();
      if (res && res.status === 200) {
        toast.success("Otp resend successfully");
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
    <>
      <h1 className="text-2xl font-bold font-[anybody-regular] text-center py-4">
        OTP Verification
      </h1>
      <div className="flex justify-center items-center py-5 flex-col gap-6">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={(value) => {
            setOtp(value);
          }}
          pattern="^\d+$"
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <Button onClick={() => onSubmit(otp)} disabled={otp.length < 6}>
          Verify
        </Button>
        <Button variant="ghost" size="sm" onClick={resendOtp}>
          Resend OTP
        </Button>
      </div>

      <p className="text-xs text-center text-gray-500 px-10">
        Your OTP is valid for 5 minutes. Please enter it before it expires.
      </p>
    </>
  );
};

export default OtpForm;
