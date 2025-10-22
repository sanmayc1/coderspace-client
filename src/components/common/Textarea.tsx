import type { ITextAreaProps } from "@/types/props.types";

const TextArea: React.FC<ITextAreaProps> = ({
  label,
  name,
  placeholder,
  value,
  className,
  error,
  handleChange,
}) => {
  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={name} className="text-gray-700 pl-1 text-sm">
          {label}
        </label>
      )}

      <textarea
        name={name}
        rows={5}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={`border-1 py-2 px-3 rounded-md text-sm ${
          error ? "outline-red-600 border-red-300" : "outline-gray-200"
        } ${className}`}
      />

      {error && <span className="text-xs pt-1 pl-1 text-red-400">{error}</span>}
    </div>
  );
};

export default TextArea;
