// import type { IFiled } from "@/types/props.types";
// import type { FieldValues } from "react-hook-form";

// function InputFiled<T extends FieldValues>({
//   label,
//   name,
//   placeholder,
//   register,
//   error,
//   rules,
//   type="text",
// }: IFiled<T>) {
//   return (
//     <div className="flex flex-col">
//       <label htmlFor="name" className="text-gray-700 pl-1 text-sm">
//         {label}
//       </label>
//       <input
//         type={type}
//         className={`border-2 p-2 rounded-md ${
//           error ? "outline-red-600 border-red-300" : ""
//         } `}
//         placeholder={placeholder}
//         {...register(name, rules)}
//       />
//       {error && (
//         <span className="text-xs pt-1 pl-1 text-red-400">{error.message}</span>
//       )}
//     </div>
//   );
// }

// export default InputFiled;
