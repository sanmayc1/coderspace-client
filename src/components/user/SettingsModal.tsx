import InputFiled from "../common/Input";
import { Button } from "../ui/Button";
import Modal from "../common/Modal";
import { Switch } from "../ui/Switch";
import { useState } from "react";

const SettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"password" | "notification">(
    "password"
  );
  const [error, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    
    setPasswordData((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl w-full">
      <div className="flex h-[400px] font-['anybody-regular']">
        {/* Left Side - Sidebar */}
        <div className="w-1/3 border-r border-gray-200 pr-4 flex flex-col gap-2">
          <h2 className="text-2xl font-bold mb-6 pl-2">Settings</h2>
          <button
            onClick={() => setActiveTab("password")}
            className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "password"
                ? "bg-gray-100 text-black"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Change Password
          </button>
          <button
            onClick={() => setActiveTab("notification")}
            className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "notification"
                ? "bg-gray-100 text-black"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Notifications
          </button>
        </div>

        {/* Right Side - Content */}
        <div className="w-2/3 pl-8 pt-2">
          {activeTab === "password" ? (
            <div className="flex flex-col gap-6 max-w-sm">
              <h3 className="text-xl font-bold mb-2">Change Password</h3>
              <div className="flex flex-col gap-4">
                <InputFiled
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  value={passwordData.currentPassword}
                  handleChange={handlePasswordChange}
                />
                <InputFiled
                  label="New Password"
                  name="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={passwordData.newPassword}
                  handleChange={handlePasswordChange}
                />
                <InputFiled
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  handleChange={handlePasswordChange}
                />
                <div className="mt-4">
                  <Button className="w-full">Update Password</Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <h3 className="text-xl font-bold mb-2">Notifications</h3>
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-gray-900">
                    Push Notifications
                  </span>
                  <span className="text-sm text-gray-500">
                    Receive notifications about your contests and problems
                  </span>
                </div>
                <Switch
                  checked={notificationEnabled}
                  onCheckedChange={setNotificationEnabled}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
