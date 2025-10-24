import Skill from "@/components/admin/Skill";
import InputFiled from "@/components/common/Input";
import SelectTag from "@/components/common/Select";
import TextArea from "@/components/common/Textarea";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { Plus, PlusCircle, Trash2 } from "lucide-react";

const AddProblem: React.FC = () => {
  return (
    <>
      <div className="flex flex-col gap-4  ">
        <div className=" bg-white shadow-sm rounded-md flex justify-center items-center">
          <h1 className="text-xl  font-[500]  p-3 ">Add Problem</h1>
        </div>
        <div className="w-full p-6 bg-white shadow-md rounded-md flex flex-col gap-9">
          <form className="space-y-4">
            <InputFiled
              label="Title"
              placeholder="Problem Title"
              name="title"
              value={""}
              handleChange={() => {}}
            />
            <TextArea
              label="Description"
              name="description"
              placeholder="Description of the problem "
              error=""
              value={""}
              handleChange={() => {}}
            />
            <SelectTag
              options={[
                { label: "Easy", value: "easy" },
                { label: "Medium", value: "medium" },
                { label: "Hard", value: "hard" },
              ]}
              placeholder="Select Difficulty"
              label="Difficulty"
              head="Difficulty"
              name="difficulty"
              value=""
              handleChange={() => {}}
            ></SelectTag>
            <div className="flex flex-col gap-4">
              <div className="flex items-end  gap-4">
                <SelectTag
                  options={[
                    { label: "Array", value: "easy" },
                    { label: "Math", value: "medium" },
                  ]}
                  placeholder="Select Skill"
                  label="Skills"
                  head="Skills"
                  name="Skills"
                  value=""
                  handleChange={() => {}}
                ></SelectTag>
                <Button size={"sm"} type="button" className="pt-1 mb-1">
                  Add Skill
                </Button>
              </div>
              <div className="border  px-3 py-2 border-gray-200 flex flex-wrap rounded-md w-full gap-3 min-h-28">
                {Array(10)
                  .fill(0)
                  .map(() => {
                    return <Skill />;
                  })}
              </div>
            </div>
            <div className="flex gap-10 py-3">
              <p className="text-gray-700 pl-1 text-sm">Premium</p>
              <Switch />
            </div>
            <SelectTag
              options={[
                { label: "Javascript", value: "Javascript" },
                { label: "DSA", value: "hard" },
              ]}
              placeholder="Select Domain"
              label="Domain"
              head="Domain"
              name="Domain"
              value=""
              handleChange={() => {}}
            ></SelectTag>
            <InputFiled
              label="Constrain"
              placeholder="Constrain"
              name="Constrain"
              value={""}
              handleChange={() => {}}
            />

            <TextArea
              handleChange={() => {}}
              name="example"
              placeholder={"Examples"}
              value={""}
              label="Example"
            />
            <div className="flex justify-end">
              <Button size={"lg"}>Save</Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProblem;
