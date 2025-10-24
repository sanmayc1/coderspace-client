import {Trash2 } from "lucide-react";
import { Button } from "../ui/Button";

function Skill() {
  return (
    
      <div className="border-1  hover:border-blue-400 border-gray-400  w-fit  flex justify-center h-fit   items-center  rounded-full">
        <Button variant={"ghost"} className="rounded-full " type="button">
          <Trash2 className="text-red-500" />
        </Button>
        <span className="text-sm text-gray-600 pr-4"> Array</span>
       
      </div>
    
  );
}

export default Skill;
