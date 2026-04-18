import React, { useState } from 'react';
import { z } from 'zod';
import InputFiled from '../../components/common/Input';
import { Button } from '../../components/ui/button';
import { changePassword } from '@/api/common/common.api';
import { toastifyOptionsCenter } from '@/utils/toastify.options';
import { toast } from 'react-toastify';
import type { AxiosError } from 'axios';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Confirm Password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const Settings = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Clear validation error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setSuccessMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setSuccessMsg('');

    const result = changePasswordSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      const res = await changePassword(formData.currentPassword, formData.newPassword);

      console.log(res);
      setSuccessMsg('Password successfully changed!');
      toast.success('Password successfully changed!', toastifyOptionsCenter);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTouched({});
      setIsSubmitted(false);
    } catch (error) {
      const axError = error as AxiosError<{ errors: { message: string; path: string }[] }>;
      toast.error(axError.response?.data.errors[0].message, toastifyOptionsCenter);
    }
  };

  const getError = (fieldName: string) => {
    return touched[fieldName] || isSubmitted ? errors[fieldName] : '';
  };

  return (
    <div className="p-6 max-w-3xl lg:px-8 xl:px-12 mx-auto">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
          Change Password
        </h2>

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-lg text-sm border border-emerald-200">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputFiled
            label="Current Password"
            name="currentPassword"
            type="password"
            placeholder="Enter your current password"
            value={formData.currentPassword}
            handleChange={handleChange}
            error={getError('currentPassword')}
            className="w-full"
          />

          <InputFiled
            label="New Password"
            name="newPassword"
            type="password"
            placeholder="Enter new password"
            value={formData.newPassword}
            handleChange={handleChange}
            error={getError('newPassword')}
            className="w-full"
          />

          <InputFiled
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your new password"
            value={formData.confirmPassword}
            handleChange={handleChange}
            error={getError('confirmPassword')}
            className="w-full"
          />

          <div className="pt-2">
            <Button type="submit">Update Password</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
