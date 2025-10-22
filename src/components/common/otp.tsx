import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/OtpInput";
import type { OtpProps } from "@/types/props.types";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { sendOtp } from "@/api/auth/auth.api";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { toastifyOptionsCenter } from "@/utils/toastify.options";

const OtpForm: React.FC<OtpProps> = ({ onSubmit }) => {
  const [otp, setOtp] = useState<string>("");
  const [timer, setTimer] = useState(60);
  const [resendDisable, setDisable] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setDisable(false);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [resendDisable]);

  const resendOtp = async () => {
    try {
      setDisable(true);
      setTimer(120);
      const res = await sendOtp();
      if (res && res.status === 200) {
        toast.success("Otp resend successfully", toastifyOptionsCenter);
      }
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      toast.error(
        axiosError.response?.data?.errors[0]?.error,
        toastifyOptionsCenter
      );
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
        <div className="flex flex-col justify-center">
          {resendDisable && (
            <p className="text-center text-sm font-semibold">
              {Math.floor(timer / 60)} : {timer % 60 === 0 ? "00" : timer % 60}
            </p>
          )}
          <Button
            disabled={resendDisable}
            className={`${
              resendDisable ? "hover:cursor-not-allowed" : "cursor-pointer"
            } select-none `}
            variant="ghost"
            size="sm"
            onClick={resendOtp}
          >
            Resend OTP
          </Button>
        </div>
      </div>

      <p className="text-xs text-center text-gray-500 px-10">
        Your OTP is valid for 5 minutes. Please enter it before it expires.
      </p>
    </>
  );
};

export default OtpForm;
