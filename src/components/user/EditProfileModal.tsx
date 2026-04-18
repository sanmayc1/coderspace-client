import { ImageUp } from 'lucide-react';
import Modal from '../common/Modal';
import InputFiled from '../common/input';
import TextArea from '../common/Textarea';
import { Button } from '../ui/button';
import LoadingSpin from '../common/LoadingSpin';
import { useState } from 'react';
import type { IUserState } from '@/pages/user/Profile';
import { UserProfileEditSchema } from '@/utils/validation/user-validation';
import { toast } from 'react-toastify';
import { toastifyOptionsCenter } from '@/utils/toastify.options';
import { updateUserProfile } from '@/api/user/user.profile';
import { AxiosError } from 'axios';

const EditProfileModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  data: IUserState;
  setEditModalOpen: (value: boolean) => void;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ isOpen, onClose, data, setEditModalOpen, setRefetch }) => {
  const [newImgae, setNewImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    username: '',
    about: '',
  });
  const [editData, setEditData] = useState({
    name: data.name,
    username: data.username,
    about: data.about,
  });

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    const result = UserProfileEditSchema.safeParse({
      [name]: value,
    });

    if (!result.success) {
      let flag = false;
      result.error.issues.map((error: any) => {
        console.log(error.path[0] === name);
        if (error.path[0] === name) {
          setErrors((prev) => ({ ...prev, [name]: error.message }));
          flag = true;
        }
      });

      if (flag === false) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    }

    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
    }
  };

  const handleEditSubmit = async () => {
    setIsLoading(true);
    const result = UserProfileEditSchema.safeParse({
      name: editData.name,
      username: editData.username,
      ...(editData.about && { about: editData.about }),
    });
    if (!result.success) {
      result.error.issues.map((error: any) => {
        setErrors((prev) => ({ ...prev, [error.path[0]]: error.message }));
      });
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', result.data.name);
      formData.append('username', result.data.username);
      if (result.data.about) {
        formData.append('about', result.data.about);
      }
      if (newImgae) {
        formData.append('profileImage', newImgae);
      }

      await updateUserProfile(formData);
      toast.success('Profile updated successfully', toastifyOptionsCenter);
      setTimeout(() => {
        setRefetch((prev) => !prev);
      }, 1000);

      setEditModalOpen(false);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        console.log(error);
        if (error.status === 409) {
          setErrors((prev) => ({ ...prev, username: 'Username already exists' }));
          setIsLoading(false);
          return;
        }
      }

      toast.error('Failed to update profile', toastifyOptionsCenter);
      setIsLoading(false);
    }
  };

  const onCloseModal = () => {
    setEditData({
      name: data.name,
      username: data.username,
      about: data.about,
    });
    setErrors({
      name: '',
      username: '',
      about: '',
    });
    setNewImage(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onCloseModal} className="max-w-lg">
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center">Edit Profile</h2>
        <div className="flex justify-center items-center ">
          <div className="relative cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className=" w-full h-full absolute opacity-0 cursor-pointer z-22"
              onChange={handleUploadImage}
            />
            <img
              src={newImgae ? URL.createObjectURL(newImgae) : data.profileUrl}
              alt="profile"
              className="h-28 w-28 object-cover object-center rounded-full border-2 border-gray-300"
            />
            <ImageUp
              size={20}
              className="absolute bottom-0 right-0 bg-gray-300 box-content p-1 rounded-full z-10"
            />
          </div>
        </div>

        <InputFiled
          label="Name"
          name="name"
          placeholder="Enter your name"
          value={editData.name}
          handleChange={handleEditChange}
          error={errors.name}
        />
        <InputFiled
          label="Username"
          name="username"
          placeholder="Enter your username"
          value={editData.username}
          handleChange={handleEditChange}
          error={errors.username}
        />
        <TextArea
          label="About"
          name="about"
          placeholder="Tell us about yourself"
          value={editData.about || ''}
          handleChange={handleEditChange}
          error={errors.about}
        />
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onCloseModal} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            disabled={
              isLoading ||
              (editData.name === data.name &&
                editData.username === data.username &&
                editData.about === data.about &&
                newImgae === null)
            }
            onClick={handleEditSubmit}
          >
            {isLoading ? <LoadingSpin /> : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
