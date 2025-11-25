import { Edit, Eye, EyeOff, MoveRight } from "lucide-react";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import type { IProblemCardProps } from "@/types/props.types";
import SelectTag from "../common/Select";
import { LANGUAGES } from "@/utils/constants";
import { useState } from "react";
import { toast } from "react-toastify";
import { toastifyOptionsCenter } from "@/utils/toastify.options";
import { addLanguage } from "@/api/admin/problem-management";


const ProblemCard: React.FC<IProblemCardProps> = ({ problem,refetch }) => {
  const [language, setLanguage] = useState("");
  const navigate = useNavigate();
  const addNewLanguage = async () => {
    if (!language.trim()) {
      toast.error("Select a language", toastifyOptionsCenter);
      return;
    }

    try {
      await addLanguage({ problemId: problem.id, language });
      toast.success("Language added successfully", toastifyOptionsCenter);
      refetch((prev)=>!prev)
      setLanguage("");
    } catch (error) {
      toast.error("Something went wrong", toastifyOptionsCenter);
    }
  };
  return (
    <div
      key={problem.id}
      className="p-5 bg-white group h-fit   rounded-2xl shadow-md flex  border-1   flex-col gap-3"
    >
      <div className="flex justify-between items-center">
        <p className="text-lg">
          <span>{problem.number}. </span>
          {problem.title
            .split(" ")
            .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
            .join(" ")}
        </p>
        <div className="flex gap-3 items-center">
          {problem.view === "public" ? (
            <Eye
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
              size={20}
            />
          ) : (
            <EyeOff
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
              size={20}
            />
          )}
          <Edit
            size={20}
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
            onClick={()=>navigate(`/admin/manage-problems/${problem.id}/edit`)}
          />

        </div>
      </div>
      <div
        className={`flex items-center gap-3 ${LANGUAGES.filter(
          (l) => !problem.languages.some(pl=> pl.language == l.value)
        ).length === 0 ?"opacity-50 pointer-events-none" :""}`}
      >
        <SelectTag
          handleChange={(v) => setLanguage(v)}
          name="language"
          value={language}
          options={LANGUAGES.filter(
            (l) => !problem.languages.some(pl=> pl.language == l.value)
          )}
          placeholder="Select Language"
          label="Language"
        />
        <Button
          className="text-xs flex justify-center items-center pt-1"
          size={"sm"}
          onClick={addNewLanguage}
        >
          Add
        </Button>
      </div>
      <div className="px-4 py-2 bg-gray-50  border-1  h-48  flex flex-col gap-2 rounded-md">
        {problem.languages.length !== 0 ? (
          problem.languages.map((l) => (
            <div
            key={l.id}
              onClick={() => navigate(`/admin/manage-problems/language/${l.id}`)}
              className="bg-white hover:scale-105 transition-all duration-300  text-sm shadow-md py-2 px-3  rounded-md flex justify-between items-center border-1 cursor-pointer"
            >
              {l.language.charAt(0).toUpperCase() + l.language.slice(1)}
              <span>
                <MoveRight size={15} className="text-gray-500" />
              </span>
            </div>
          ))
        ) : (
          <p className="text-center pt-5 text-sm">No languages</p>
        )}
      </div>
      <Button
        onClick={() => navigate(`/admin/manage-problems/testcase/${problem.id}`)}
        className="hover:scale-105 transition-all duration-300  text-sm shadow-md py-2 px-3  rounded-md flex justify-center items-center border-1 cursor-pointer"
      >
        Testcase
      </Button>
    </div>
  );
};

export default ProblemCard;
