import {
  getLanguageDetails,
  updateLanguage,
} from "@/api/admin/problem-management";
import InputFiled from "@/components/common/Input";
import { Button } from "@/components/ui/Button";
import { toastifyOptionsCenter } from "@/utils/toastify.options";
import Editor from "@monaco-editor/react";
import "monaco-editor/esm/vs/basic-languages/java/java.contribution";
import "monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution";
import "monaco-editor/esm/vs/basic-languages/python/python.contribution";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpin from "@/components/common/LoadingSpin";

const AddLanguage: React.FC = () => {
  const navigate = useNavigate();
  const [templateCode, setTemplateCode] = useState("");
  const [language, setLanguage] = useState("");
  const [solution, setSolution] = useState("");
  const [fnName, setFnName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    async function fetchLanguage() {
      try {
        setIsLoading(true);
        const res = await getLanguageDetails(id || "");
        setLanguage(res.data.language);
        setTemplateCode(res.data.tmpCode);
        setSolution(res.data.solution);
        setFnName(res.data.fnName);
        setIsLoading(false);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data.errors[0].error,
            toastifyOptionsCenter
          );
        }
        setIsLoading(false);
      }
    }
    if (id) {
      fetchLanguage();
    }
  }, []);

  const handleTemplateCodeChange = (v: string | undefined) => {
    setSolution(v || "");
    setTemplateCode(v || "");
  };

  const saveData = async () => {
    if (!solution.trim() || !templateCode.trim() || !fnName.trim()) {
      toast.error("All filed are required", toastifyOptionsCenter);
      return;
    }

    try {
      await updateLanguage({ languageId: id, templateCode, solution, fnName });
      toast.success("Language Updated",toastifyOptionsCenter)
      navigate("/admin/manage-problems");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.errors[0].message,
          toastifyOptionsCenter
        );
      }

      
    }
  };

  return (
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
        <h1 className="text-xl text-center p-3">Add Language</h1>
        <div className="flex px-5 justify-end">
          <Button size={"sm"} className="text-xs pt-1 " onClick={saveData}>
            Save
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-5 bg-white p-6 rounded-md shadow-md ">
        {isLoading ? (
          <div className="flex h-[50vh] w-full justify-center items-center">
            <LoadingSpin size={40} />
          </div>
        ) : (
          <>
            <div className="bg-[#1E1E1E] rounded-md">
              <div className="py-2 bg-[#5F5F5F] text-white px-4 text-sm rounded-t-md ">
                <p>Template Code </p>
              </div>
              <div className="p-2">
                <Editor
                  height={300}
                  theme={"vs-dark"}
                  language={language}
                  value={templateCode}
                  onChange={(v) => handleTemplateCodeChange(v)}
                />
              </div>
            </div>
            <InputFiled
              label="Function name"
              name="fnName"
              value={fnName}
              handleChange={(e) => setFnName(e.target.value)}
              placeholder="Template Code Function Name"
            />
            <div className="bg-[#1E1E1E] rounded-md">
              <div className="py-2 bg-[#5F5F5F] text-white px-4 text-sm rounded-t-md ">
                <p>Solution</p>
              </div>
              <div className="p-2">
                <Editor
                  height={400}
                  theme={"vs-dark"}
                  language={language}
                  value={solution}
                  onChange={(v) => setSolution(v || "")}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddLanguage;
