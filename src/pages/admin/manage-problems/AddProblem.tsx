import { createProblem } from "@/api/admin/problem-management";
import Skill from "@/components/admin/Skill";
import InputFiled from "@/components/common/Input";
import SelectTag from "@/components/common/Select";
import TextArea from "@/components/common/Textarea";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import type { IExample, IProblemState, ISkill } from "@/types/types";
import { toastifyOptionsCenter } from "@/utils/toastify.options";
import { createProblemSchema } from "@/utils/validation/admin-validation";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";

const AddProblem: React.FC = () => {
  const [data, setData] = useState<IProblemState>({
    constrain: "",
    description: "",
    difficulty: "",
    domain: "",
    premium: false,
    skill: "",
    title: "",
    example: { id: "", explanation: "", input: "", output: "" },
  });

  const [error, setError] = useState({
    constrain: "",
    description: "",
    difficulty: "",
    domain: "",
    premium: "",
    skill: "",
    title: "",
    example: { id: "", explanation: "", input: "", output: "" },
  });

  const [skills, setSkills] = useState<ISkill[]>([
    { id: "1", title: "Array" },
    { id: "2", title: "Object" },
    { id: "3", title: "HashTable" },
  ]);

  const [selectedSkills, setSelectedSkills] = useState<ISkill[]>([]);
  const [examples, setExamples] = useState<IExample[]>([]);
  const navigate = useNavigate();
  const handleChangeInputField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeOtherTag = (
    v: string | undefined | boolean,
    name: string
  ) => {
    setData((prev) => ({ ...prev, [name]: v }));
  };

  const addSkills = () => {
    const exists = selectedSkills.find((s) => s.id === data.skill);

    if (exists) {
      toast.error(`${exists.title} already added`, toastifyOptionsCenter);
      return;
    }

    const skill = skills.find((s) => s.id === data.skill);
    if (skill) {
      setSelectedSkills((prev) => [...prev, skill]);
    }
    setData((prev) => ({ ...prev, ["skill"]: "" }));
  };

  const removeSkill = (id: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s.id !== id));
  };

  const handleChangeExample = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      example: { ...data.example, [name]: value },
    }));
  };

  const addExample = () => {
    const exampleError: IExample = {
      id: "",
      input: "",
      explanation: "",
      output: "",
    };

    const fields = ["input", "explanation", "output"];

    fields.forEach((f) => {
      if (!data.example[f as keyof IExample].trim()) {
        exampleError[f as keyof IExample] = "Required";
      }
    });

    if (exampleError.input || exampleError.explanation || exampleError.output) {
      setError((prev) => ({ ...prev, example: exampleError }));
      return;
    } else setError((prev) => ({ ...prev, example: exampleError }));

    setExamples((prev) => [...prev, { ...data.example, id: uuid() }]);
    setData((prev) => ({
      ...prev,
      example: { id: "", input: "", explanation: "", output: "" },
    }));
  };

  const handleRemoveExample = (id: string) => {
    setExamples((prev) => prev.filter((ex) => ex.id !== id));
  };

  const handleSubmit = () => {
    const body = { ...data, examples: examples, skills: selectedSkills };
    const result = createProblemSchema.safeParse(body);

    if (!result.success) {
      const validationError = {
        constrain: "",
        description: "",
        difficulty: "",
        domain: "",
        premium: "",
        skills: "",
        title: "",
        examples: "",
      };

      result.error.issues.forEach((er) => {
        validationError[er.path[0] as keyof typeof validationError] =
          er.message;
      });

      setError({
        ...validationError,
        example: {
          id: validationError.examples,
          input: "",
          output: "",
          explanation: "",
        },
        skill: validationError.skills,
      });
      return;
    }

    setError({
      constrain: "",
      description: "",
      difficulty: "",
      domain: "",
      premium: "",
      skill: "",
      title: "",
      example: { id: "", explanation: "", input: "", output: "" },
    });

    console.log(result.data);
  };

  return (
    <>
      <div className="flex flex-col gap-4 ">
        <div className=" bg-white shadow-sm rounded-md grid grid-flow-col grid-cols-3  justify-center items-center">
          <div className="flex px-5 justify-start">
            <Button
              variant={"ghost"}
              onClick={() => navigate("/admin/manage-problems/")}
            >
              Back
            </Button>
          </div>
          <h1 className="text-xl text-center p-3">Add Problem</h1>
        </div>
        <div className="w-full p-6 bg-white shadow-md rounded-md flex flex-col gap-9">
          <form className="space-y-4">
            <InputFiled
              label="Title"
              placeholder="Problem Title"
              name="title"
              value={data.title}
              error={error.title}
              handleChange={handleChangeInputField}
            />
            <TextArea
              label="Description"
              name="description"
              placeholder="Description of the problem "
              error={error.description}
              value={data.description}
              handleChange={handleChangeInputField}
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
              value={data.difficulty}
              error={error.difficulty}
              handleChange={(v) => handleChangeOtherTag(v, "difficulty")}
            ></SelectTag>
            <div className="flex flex-col gap-4">
              <div className="flex items-end  gap-4">
                <SelectTag
                  options={skills.map((s) => ({ label: s.title, value: s.id }))}
                  placeholder="Select Skill"
                  label="Skills"
                  head="Skills"
                  name="skill"
                  value={data.skill}
                  handleChange={(v) => handleChangeOtherTag(v, "skill")}
                ></SelectTag>
                <Button
                  size={"sm"}
                  type="button"
                  className="pt-1 mb-1"
                  onClick={addSkills}
                >
                  Add Skill
                </Button>
              </div>
              <div
                className={`border ${
                  error.skill && "border-red-400"
                } px-3 py-2 border-gray-200 flex flex-wrap rounded-md w-full gap-3 min-h-28`}
              >
                {selectedSkills.map((v) => {
                  return (
                    <Skill
                      key={v.id}
                      id={v.id}
                      title={v.title}
                      removeSkill={removeSkill}
                    />
                  );
                })}
              </div>
            </div>
            {error.skill && (
              <span className="text-xs pt-1 pl-1 text-red-400">
                {error.skill}
              </span>
            )}
            <div className="flex gap-10 py-3">
              <p className="text-gray-700 pl-1 text-sm">Premium</p>
              <Switch
                checked={data.premium}
                onCheckedChange={(v) => handleChangeOtherTag(v, "premium")}
              />
            </div>
            <SelectTag
              options={[
                { label: "Javascript", value: "javascript" },
                { label: "DSA", value: "DSA" },
              ]}
              placeholder="Select Domain"
              label="Domain"
              head="Domain"
              name="Domain"
              value={data.domain}
              error={error.domain}
              handleChange={(v) => handleChangeOtherTag(v, "domain")}
            ></SelectTag>
            <InputFiled
              label="Constrain"
              placeholder="Constrain"
              name="constrain"
              error={error.constrain}
              value={data.constrain}
              handleChange={handleChangeInputField}
            />

            <p className="text-gray-900 pl-1 text-sm">Examples</p>
            <div className="flex flex-col sm:items-center sm:flex-row gap-5">
              <div className="flex flex-col sm:items-center sm:flex-row  gap-4 p-2">
                <InputFiled
                  label="Input"
                  placeholder="num = [1,2,3,8] target = 9"
                  name="input"
                  error={error.example.input}
                  value={data.example.input}
                  handleChange={handleChangeExample}
                />
                <InputFiled
                  label="Output"
                  placeholder="[0,3]"
                  name="output"
                  error={error.example.output}
                  value={data.example.output}
                  handleChange={handleChangeExample}
                />
                <InputFiled
                  label="Explanation"
                  placeholder="index 0 is 1 and 3 is 8 so 8 + 1 is 9"
                  name="explanation"
                  value={data.example.explanation}
                  error={error.example.explanation}
                  handleChange={handleChangeExample}
                />
              </div>
              <Button
                size={"sm"}
                type="button"
                className="pt-1 mb-1"
                onClick={addExample}
              >
                Add
              </Button>
            </div>
            <div
              className={`bg-white border ${
                error.example.id && "border-red-400"
              } rounded-md p-4 min-h-32 shadow-sm max-w-full`}
            >
              <div className="grid grid-cols-4 gap-4">
                {examples.map((ex) => (
                  <section
                    key={ex.id}
                    className="border group rounded p-3 gap-3 flex flex-col bg-gray-50"
                  >
                    <div className=" justify-between  flex">
                      <p className="text-sm text-gray-700 ">Example</p>
                      <Trash2
                        size={15}
                        className="text-red-500 hidden group-hover:block cursor-pointer"
                        onClick={() => handleRemoveExample(ex.id)}
                      />
                    </div>
                    <p className="text-xs text-gray-500">Input : {ex.input}</p>
                    <p className="text-xs text-gray-500">
                      Output : {ex.output}
                    </p>
                    <p className="text-xs text-gray-500">
                      Explanation : {ex.explanation}
                    </p>
                  </section>
                ))}
              </div>
            </div>
            {error.example.id && (
              <span className="text-xs pt-1 pl-1 text-red-400">
                {error.example.id}
              </span>
            )}

            <div className="flex justify-end">
              <Button type="button" size={"lg"} onClick={handleSubmit}>
                Save
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProblem;
