import { API_ROUTES } from '@/api/apiRoutes';
import { authLogin } from '@/api/asyncThunk/thunk-api';
import { useAppDispatch } from '@/app/hooks/redux-custom-hook';
import AuthFormWraper from '@/components/common/AuthFormWraper';
import CustomForm from '@/components/common/form';
import Modal from '@/components/common/modal';
import type { AuthLoginError, ILoginPayload, ILoginResponse } from '@/types/types';
import { LoginFileds } from '@/utils/constants';
import { mapLoginErrors } from '@/utils/error-handlers/mapLoginErrors';
import { LoginShema } from '@/utils/validation/user-validation';
import { Button } from '@/components/ui/button';
import { AlertCircle, Mail } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type z from 'zod';

const CompanyLogin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvalRemarks, setApprovalRemarks] = useState('');
  const [rejected,setRejected] = useState(false);

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
            endpoint: API_ROUTES.COMPANY_LOGIN,
            payload: data as ILoginPayload,
          })
        ).unwrap();
        navigate('/company/dashboard');
      } catch (error) {
        if ((error as AuthLoginError)?.error?.errors[0].path == 'approval') {
          setIsApprovalModalOpen(true);
          setApprovalRemarks((error as AuthLoginError).error?.errors[0].message as string);
          return;
        }

        if ((error as AuthLoginError)?.error?.errors[0].path == 'approval-rejected') {
          setIsApprovalModalOpen(true);
          setRejected(true)
          setApprovalRemarks((error as AuthLoginError).error?.errors[0].message as string);
          return;
        }

        mapLoginErrors(
          (error as AuthLoginError)?.error as ILoginResponse,
          (error as AuthLoginError)?.statusCode as number,
          setErrors
        );
      }
    },

    [dispatch, navigate]
  );

  return (
    <>
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
        <p
          className="text-xs cursor-pointer text-right px-5  py-2 hover:"
          onClick={() => navigate('/auth/password/forget')}
        >
          Forgotten your password?
        </p>
        <div className="flex justify-center items-center pt-4 ">
          <p
            className="text-gray-600 text-sm select-none"
            onClick={() => navigate('/company/register')}
          >
            Don't have an account ?
            <span className="text-black hover:scale-110 cursor-pointer"> Signup</span>
          </p>
        </div>
      </AuthFormWraper>
      <Modal isOpen={isApprovalModalOpen} className="max-w-2xl p-0 overflow-hidden">
        <div className="p-1 flex flex-col items-center justify-center text-black text-center">
          <div className="bg-white/20 p-4 rounded-full shadow-inner">
            <AlertCircle size={40} className={` ${rejected ? 'animate-shake text-red-500 ' : 'animate-pulse text-gray-500'}`} />
          </div>
          <h3 className={`text-xl font-bold tracking-wide ${rejected ? 'text-red-500' : 'text-black'}`}>{rejected ? 'Approval Rejected' : 'Approval Pending'}</h3>
        </div>

        <div className="p-7 text-center bg-white flex flex-col gap-6">
          <p className="text-gray-600 leading-relaxed text-base">{approvalRemarks}</p>

          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col items-center gap-3 shadow-sm transition-all hover:shadow-md">
            <p className="text-xs font-medium text-gray-800">
              For any urgent issues, please contact the admin:
            </p>
            <a
              href="mailto:sanmayc9@gmail.com"
              className="flex items-center gap-2 text-gray-700 font-semibold hover:text-gray-800 transition-colors bg-white px-5 py-2.5 rounded-xl shadow-xs border border-gray-200 hover:border-gray-300"
            >
              <Mail size={18} />
              sanmayc9@gmail.com
            </a>
          </div>

          <Button
            onClick={() => setIsApprovalModalOpen(false)}
            className="w-full mt-2  font-medium py-3 rounded-xl shadow-sm transition-all text-base"
          >
            Got it, thanks!
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default CompanyLogin;
