import { useState, type ChangeEvent } from "react";
import Modal from "../common/Modal";
import { Button } from "../ui/Button";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux-custom-hook";
import { updateSuggestionLevel } from "@/api/user/user.profile";
import { setProfileComplete } from "@/app/redux-slice/authReducer";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";
import LoadingSpin from "../common/LoadingSpin";
import type { IErrorResponse } from "@/types/response.types";

const UserExperienceModal: React.FC = () => {
  const [selected, setSelect] = useState("easy");
  const [isLoading, setLoading] = useState(false);
  const auth = useAppSelector((s) => s.authReducer);
  const dispatch = useAppDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelect(e.target.value);
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      const res = await updateSuggestionLevel({level:selected});
      if (res.status === 200) {
        console.log(res)
        dispatch(setProfileComplete());
      }
      setLoading(false);
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>;
      toast.error(axiosError.response?.data.message);
      setLoading(false);
    }
  };
  const data = [
    {
      label: "Beginner",
      description:
        "New to this field, just starting out and building the basics.",
      value: "easy",
    },
    {
      label: "Intermediate",
      description:
        "Extensive experience, strong expertise, and aiming for deeper professional mastery.",
      value: "medium",
    },
    {
      label: "Advanced",
      description:
        "Highly experienced, strong knowledge, and looking for expert-level insights.",
      value: "hard",
    },
  ];
  return (
    <>
      <Modal
        isOpen={auth.auth && auth.role === "user" && !auth.profileComplete}
        className="max-w-[43%] font-[anybody-regular] flex flex-col gap-6 p-10"
      >
        <h4 className="text-xl font-semibold">Better User Experience</h4>
        <div className="flex flex-col gap-3">
          <p className="text-sm pl-1 text-gray-500">Choose where you stand</p>
          <div className="grid w-full grid-cols-3 justify-start gap-4">
            {data.map((d) => (
              <label
              key={d.value}
                className={`bg-gray-50  p-5 ${
                  d.value === selected
                    ? "border-black border-2 "
                    : " border border-gray-200"
                } box-content rounded-2xl flex flex-col gap-5 shadow-sm relative`}
              >
                <input
                  type="radio"
                  name="level"
                  onChange={handleChange}
                  value={d.value}
                  className="hidden"
                />
                <h6>{d.label}</h6>
                <p className="text-xs text-gray-500">{d.description}</p>
              </label>
            ))}
          </div>
        </div>

        <Button onClick={onSubmit}>{isLoading ? <LoadingSpin/> :"Continue"}</Button>
      </Modal>
    </>
  );
};

export default UserExperienceModal;
