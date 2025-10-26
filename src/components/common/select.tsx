import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import type { ISelectTagProps } from "@/types/props.types";

const SelectTag: React.FC<ISelectTagProps> = ({
  label,
  placeholder,
  options,
  name,
  handleChange,
  value,
  head,
  error

}) => {
  return (
    <>
    <div className="flex flex-col">
    { head && <p className="text-gray-700 pl-1 text-sm">{head}</p>}
    <Select name={name} onValueChange={handleChange} value={value}>
      
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel >{label}</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
          {error && (
        <span className="text-xs pt-1 pl-1 text-red-400">
          {error}
        </span>
      )}
    </div>
    </>
  );
};

export default SelectTag;
