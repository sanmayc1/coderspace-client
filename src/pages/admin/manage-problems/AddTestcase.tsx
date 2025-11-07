import InputFiled from "@/components/common/Input";
import CustomPagination from "@/components/common/Pagination";
import { Button } from "@/components/ui/Button";
import { Editor } from "@monaco-editor/react";
import { Edit, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddTestcase = () => {
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-2">
      <div className=" bg-white shadow-sm rounded-md grid grid-flow-col grid-cols-3  justify-center items-center">
        <div className="flex px-5 justify-start">
          <Button
            variant={"ghost"}
            onClick={() => navigate("/admin/manage-problems/")}
          >
            Back
          </Button>
        </div>
        <h1 className="text-xl text-center p-3">Add Testcase</h1>
      </div>

      <div className="flex flex-col bg-white p-5 rounded-md shadow-md gap-5">
        <div className="flex justify-center w-full gap-6">
          <div className="w-full flex items-end gap-4">
            <div className="bg-[#1E1E1E] rounded-md">
              <div className="py-2 bg-[#5F5F5F] text-white px-4 flex items-center justify-between text-sm rounded-t-md ">
                <p>Single Testcase</p>
                <Button size={"sm"} className="text-xs cursor-pointer">
                  Add testcase
                </Button>
              </div>
              <div className="p-2">
                <Editor
                  theme="vs-dark"
                  height={210}
                  language="json"
                  width={500}
                  defaultValue={`\n\n{ \n\n "input" : [ param1, param2, param4 ], \n\n "output" : any \n\n }`}
                  options={{
                    minimap: { enabled: false },
                    formatOnPaste: true,
                    formatOnType: true,
                  }}
                  onChange={(v) => setValue(v || "")}
                  value={value}
                />
              </div>
            </div>
          </div>

          <div className="w-full flex items-end gap-4 ">
            <div className="bg-[#1E1E1E] rounded-md">
              <div className="py-2 bg-[#5F5F5F] text-white px-4 flex items-center justify-between text-sm rounded-t-md ">
                <p>Bulk Testcase Json</p>
                <Button size={"sm"} className="text-xs cursor-pointer">
                  Add testcases
                </Button>
              </div>
              <div className="p-2">
                <Editor
                  theme="vs-dark"
                  height={210}
                  language="json"
                  width={500}
                  defaultValue={`\n[\n { \n   "input" : [ param1, param2, param4 ], \n   "output" : any \n  },\n { \n   "input" : [ param1, param2, param4 ], \n   "output" : any \n  }\n]`}
                  options={{
                    minimap: { enabled: false },
                    formatOnPaste: true,
                    formatOnType: true,
                  }}
                  onChange={(v) => setValue(v || "")}
                  value={value}
                />
              </div>
            </div>
          </div>
        </div>

        {/* added testcases */}
        <p>Added Testcases</p>
        <div className="bg-gray-100 p-5 border rounded-md grid gap-5 grid-cols-5">
          {Array(10) 
            .fill(0)
            .map((v) => (
              <div className="bg-white p-3 flex flex-col gap-2 shadow-md rounded-md">
                <div className="flex justify-between gap-2">
                  <p className="text-sm">Test</p>
                  <div className="flex gap-3">
                    <Edit size={17} className="" />
                    <Trash2 size={17} className="text-red-500" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 ">
                  {`\n\n{ \n\n "input" : [ param1, param2, param4 ], \n\n "output" : any \n\n }`}
                </p>
              </div>
            ))}
        </div>
        <CustomPagination totalPages={10}/>
      </div>
    </div>
  );
};

export default AddTestcase;
