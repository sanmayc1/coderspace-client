import { Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import type { ISkillProps } from "@/types/props.types";

const Skill: React.FC<ISkillProps> = ({ id, removeSkill, title }) => {
  return (
    <div className="border-1  hover:border-blue-400 border-gray-400  w-fit  flex justify-center h-fit   items-center  rounded-full">
      <Button
        variant={"ghost"}
        className="rounded-full "
        type="button"
        onClick={() => removeSkill(id)}
      >
        <Trash2 className="text-red-500" />
      </Button>
      <span className="text-sm text-gray-600 pr-4"> {title}</span>
    </div>
  );
};

export default Skill;
