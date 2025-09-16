import { useState } from "react";
import InputFiled from "../common/input";
import SelectTag from "../common/select";
import { Badges } from "@/utils/constants";
import { Button } from "../ui/button";

const EditUser: React.FC = () => {
  const [level, setLevel] = useState('');
  const [error, setError] = useState(""); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(typeof e.target.value);
    if (typeof e.target.value !== "number") {
      setError("Number only allowed");
      return;
    }
    setError("");
    setLevel(e.target.value)
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
        />

        <InputFiled
          name="level"
          placeholder="Level"
          value={level}
          type="number"
          handleChange={handleChange}
          error={error}
        />
        <div className="w-full flex gap-1 mt-5">
          <Button className="felx flex-grow">Close</Button>
          <Button className="felx flex-grow">Submit</Button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
