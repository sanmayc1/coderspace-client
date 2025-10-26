import InputFiled from "@/components/common/Input";
import { Button } from "@/components/ui/Button";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddLanguage: React.FC = () => {
  const navigate = useNavigate();
  const [templateCode ,setTemplateCode] = useState("")
  const [solution,setSolution] =useState("")

  const handleTemplateCodeChange = (v:string|undefined)=>{
    setSolution(v||"")
    setTemplateCode(v||"")
  }
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
          <Button size={"sm"} className="text-xs pt-1 ">
            Save
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-5 bg-white p-6 rounded-md shadow-md ">
        <div className="bg-[#1E1E1E] rounded-md">
          <div className="py-2 bg-[#5F5F5F] text-white px-4 text-sm rounded-t-md ">
            <p>Template Code </p>
          </div>
          <div className="p-2">
            <Editor height={300} theme={"vs-dark"} language="javascript" value={templateCode} onChange={(v)=>handleTemplateCodeChange(v)}/>
          </div>
        </div>
        <InputFiled label="Function name" name="fnmae" value={""}  handleChange={()=>{}} placeholder="Template Function Name" />
        <div className="bg-[#1E1E1E] rounded-md">
          <div className="py-2 bg-[#5F5F5F] text-white px-4 text-sm rounded-t-md ">
            <p>Solution</p>
          </div>
          <div className="p-2">
            <Editor height={400} theme={"vs-dark"} language="javascript" value={solution} onChange={(v)=>setSolution(v||"")} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLanguage;
