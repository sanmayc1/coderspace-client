import InputFiled from "@/components/common/Input";
import SelectTag from "@/components/common/Select";
import TextArea from "@/components/common/Textarea";
import { Button } from "@/components/ui/Button";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";

const AddProblem: React.FC = () => {
  const [parameter, setParameter] = useState<IParameter | null>(null);

  type TPrimitiveType = "number" | "string" | "boolean";

  interface IObjectField {
    name: string;
    type: TParameterType;
  }

  interface IPrimitiveParameter {
    kind: "primitive";
    type: TPrimitiveType;
  }

  interface IArrayParameter {
    kind: "array";
    elementType?: TParameterType;
  }

  interface IObjectParameter {
    kind: "object";
    fields: IObjectField[];
  }

  type TParameterType =
    | IPrimitiveParameter
    | IArrayParameter
    | IObjectParameter;

  interface IParameter {
    name: string;
    type: TParameterType;
  }

  const handleDataType = (val: string) => {
    if (val === "array") {
      setParameter((prev) => {
        return {
          name: prev?.name || "",
          type: {
            kind: val,
          },
        };
      });
    } else if (val === "string" || val === "number"|| val === "boolean") {
      setParameter((prev) => {
        return {
          name: prev?.name || "",
          type: {
            kind: "primitive",
            type:val
          },
        };
      });
    }
  };

  const handleElementType = (val: string) => {
    if (val === "string") {
      setParameter((prev) =>
        prev
          ? {
              name: prev?.name,
              type: prev?.type &&
                prev.type.kind && {
                  ...prev.type,
                  elementType: { kind: "primitive", type: "string" },
                },
            }
          : prev
      );
    }
  };
  console.log(parameter);
  return (
    <>
      <div className="flex flex-col gap-4 font-[anybody-regular]">
        <div className="w-full p-6 bg-white shadow-md rounded-md flex flex-col gap-9">
          <h1 className="text-2xl  font-semibold p-2">Add Problem</h1>
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
            <InputFiled
              label="Function Name"
              placeholder="Give a name to wraper function"
              name="functionName"
              className="w-[30%]"
              error=""
              value={""}
              handleChange={() => {}}
            />
            <div className="flex w-full justify-between items-center py-3">
              <h4 className="font-semibold">Parameters</h4>
              <Button type="button" size={"sm"} className="text-xs">
                <span className="pt-1">Add Parameter</span> <PlusCircleIcon />
              </Button>
            </div>
            <div className="flex gap-6  sm:flex-row flex-col ">
              <InputFiled
                label="Name"
                placeholder="Parameter name"
                name="parameterName"
                error=""
                value={""}
                handleChange={() => {}}
              />
              <SelectTag
                options={[
                  { label: "String", value: "string" },
                  { label: "Number", value: "number" },
                  { label: "Array", value: "array" },
                  { label: "Object", value: "object" },
                ]}
                value={parameter ? parameter.type.kind : ""}
                handleChange={handleDataType}
                head="Data Type"
                placeholder="Select Type"
                label="Data Type"
                name="datatype"
              />
              {parameter && parameter.type.kind === "array" && (
                <SelectTag
                  options={[
                    { label: "String", value: "string" },
                    { label: "Number", value: "number" },
                    { label: "Array", value: "array" },
                    { label: "Object", value: "object" },
                  ]}
                  value={
                    (parameter.type.kind === "array" &&
                      parameter.type.elementType?.kind === "primitive" &&
                      parameter.type.elementType.type) ||
                    ""
                  }
                  handleChange={handleElementType}
                  head="Element Type"
                  placeholder="Select Type"
                  label="Element Type"
                  name="elementtype"
                />
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProblem;
