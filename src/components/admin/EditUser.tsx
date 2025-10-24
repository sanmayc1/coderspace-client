import { useState } from "react";
import InputFiled from "../common/Input";
import SelectTag from "../common/Select";
import { Badges } from "@/utils/constants";
import { Button } from "../ui/Button";
import type { IUsersData } from "@/types/types";
import { updateUser } from "@/api/admin/user-management";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { toastifyOptionsCenter } from "@/utils/toastify.options";
import type { IErrorResponse } from "@/types/response.types";

interface IEditUserProps {
  user: IUsersData;
  onClose: () => void;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditUser: React.FC<IEditUserProps> = ({ user, onClose, setRefetch }) => {
  const [level, setLevel] = useState<string>(String(user.level));
  const [badge, setBadge] = useState<string>(user.badge);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (Number.isNaN(Number(e.target.value))) {
      setError("Number only allowed");
      return;
    }

    if (Number(e.target.value) > 100) {
      setError("Maximum Level 100");
      return;
    }
    setError("");
    setLevel(e.target.value);
  };

  const handleBadgeChange = (value: string) => {
    setBadge(value);
  };

  const onSubmit = async () => {
    try {
      if (Number(level) > 100) {
        setError("Maximum Level 100");
        return;
      }
      if (Number(level) < 1) {
        setError("Minimum Level 1");
        return;
      }

      const data = await updateUser({
        badge: badge,
        id: user.userId,
        level: Number(level),
      });

      toast.success(data.data.message, toastifyOptionsCenter);
      onClose();
      setRefetch((prev) => !prev);
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>;
      toast.error(
        axiosError.response?.data.errors?.[0]?.error,
        toastifyOptionsCenter
      );
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h5 className="text-center text-xl font-semibold ">Edit User</h5>

      <form className="space-y-2">
        <SelectTag
          name="badge"
          placeholder="Select Badge"
          label="Badge"
          options={Badges}
          handleChange={handleBadgeChange}
          value={badge}
          head="Badge"
        />

        <InputFiled
          label="Level"
          name="level"
          placeholder="Level"
          value={level}
          type="number"
          handleChange={handleChange}
          error={error}
        />
        <div className="w-full flex gap-1 mt-5">
          <Button className="felx flex-grow" type="button" onClick={onClose}>
            Close
          </Button>
          <Button
            className="felx flex-grow"
            type="button"
            onClick={onSubmit}
            disabled={level === String(user.level) && badge === user.badge}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
