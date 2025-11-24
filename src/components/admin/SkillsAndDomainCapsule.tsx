import { Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import type { ISkillProps } from "@/types/props.types";

const SkillsAndDomainCapsule: React.FC<ISkillProps> = ({ id, deleteFn, title }) => {
  return (
    <div className="border-1  hover:border-blue-400 border-gray-400  w-fit  flex justify-center h-fit   items-center  rounded-full">
      <Button
        variant={"ghost"}
        className="rounded-full "
        type="button"
        onClick={() => deleteFn(id)}
      >
        <Trash2 className="text-red-500" />
      </Button>
      <span className="text-sm text-gray-600 pr-4"> {title.charAt(0).toUpperCase() + title.slice(1)}</span>
    </div>
  );
};

export default SkillsAndDomainCapsule;
