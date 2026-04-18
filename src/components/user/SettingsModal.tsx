import InputFiled from '../common/input';
import { Button } from '../ui/button';
import Modal from '../common/Modal';
import { Switch } from '../ui/Switch';
import { useState } from 'react';
import { ResetPasswordSchema } from '@/utils/validation/user-validation';
import LoadingSpin from '../common/LoadingSpin';
import { updateUserPassword } from '@/api/user/user.profile';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { toastifyOptionsCenter } from '@/utils/toastify.options';

const SettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  auth: string;
}> = ({ isOpen, onClose, auth }) => {
  const [activeTab, setActiveTab] = useState<'password' | 'notification'>('password');
  const [error, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const updatedPasswordData = {
      ...passwordData,
      [name]: value,
    };

    const result = ResetPasswordSchema.safeParse(updatedPasswordData);

    if (!result.success) {
      let flag = false;
      result.error.issues.forEach((error: any) => {
        if (error.path[0] === name) {
          setErrors((prev) => ({ ...prev, [name]: error.message }));
          flag = true;
        }
      });

      if (flag === false) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    } else {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    const result = ResetPasswordSchema.safeParse(passwordData);

    if (!result.success) {
      result.error.issues.map((error: any) => {
        setErrors((prev) => ({ ...prev, [error.path[0]]: error.message }));
      });
      setLoading(false);
      return;
    } else {
      setErrors({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }

    try {
      await updateUserPassword({
        newPassword: passwordData.newPassword,
        currentPassword: passwordData.currentPassword,
      });
      toast.success('Password updated successfully', toastifyOptionsCenter);
      setLoading(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        if (error.response?.data.message === 'Validation error occurred') {
          error.response?.data.errors.map((error: any) => {
            setErrors((prev) => ({
              ...prev,
              [error.path]: error.path === 'currentPassword' ? 'Invalid Password' : error.message,
            }));
          });
        }
        console.log(error.response?.data.errors);

        toast.error(error.response?.data.errors[0].error, toastifyOptionsCenter);
      }
    }
  };

  const onCloseModal = () => {
    setLoading(false);
    setErrors({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onCloseModal} className="max-w-4xl w-full">
      <div className="flex h-[400px] font-['anybody-regular']">
        {/* Left Side - Sidebar */}
        <div className="w-1/3 border-r border-gray-200 pr-4 flex flex-col gap-2">
          <h2 className="text-2xl font-bold mb-6 pl-2">Settings</h2>
          <button
            onClick={() => setActiveTab('password')}
            className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'password' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Change Password
          </button>
          {/* <button
            onClick={() => setActiveTab('notification')}
            className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'notification'
                ? 'bg-gray-100 text-black'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Notifications
          </button> */}
        </div>

        {/* Right Side - Content */}
        <div className="w-2/3 pl-8 pt-2">
          {activeTab === 'password' ? (
            <div className={`flex flex-col gap-6 ${auth === 'local' ? 'max-w-sm' : ''}`}>
              <h3 className="text-xl font-bold mb-2">Change Password</h3>
              {auth === 'local' ? (
                <div className="flex flex-col gap-4 ">
                  <InputFiled
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    handleChange={handlePasswordChange}
                    error={error.currentPassword}
                  />
                  <InputFiled
                    label="New Password"
                    name="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={passwordData.newPassword}
                    error={error.newPassword}
                    handleChange={handlePasswordChange}
                  />
                  <InputFiled
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    error={error.confirmPassword}
                    handleChange={handlePasswordChange}
                  />
                  <div className="mt-4">
                    <Button
                      className="w-full"
                      onClick={handleSubmit}
                      disabled={
                        loading ||
                        passwordData.confirmPassword !== passwordData.newPassword ||
                        !passwordData.currentPassword ||
                        !passwordData.newPassword ||
                        !passwordData.confirmPassword
                      }
                    >
                      {loading ? <LoadingSpin /> : 'Update Password'}
                    </Button>
                  </div>
                </div>
              ) : auth === 'github' ? (
                <div className="flex flex-col gap-2">
                  <p className="text-gray-500">
                    You are signed in with GitHub. You can't change your password here.
                  </p>
                  <div className="flex justify-center items-center h-50">
                    <img src="/github.png" alt="github" className="h-12" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-gray-500">
                    You are signed in with Google. You can't change your password here.
                  </p>
                  <div className="flex justify-center items-center h-50">
                    <img src="/google.png" alt="google" className="h-12" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <h3 className="text-xl font-bold mb-2">Notifications</h3>
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-gray-900">Push Notifications</span>
                  <span className="text-sm text-gray-500">
                    Receive notifications about your contests and problems
                  </span>
                </div>
                <Switch checked={notificationEnabled} onCheckedChange={setNotificationEnabled} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
